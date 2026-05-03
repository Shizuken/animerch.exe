import { useEffect, useState } from "react";
import { GalleryItem } from "@/data/animerch";
import { useAnimerchStore } from "@/store/animerchStore";
import { PixelButton } from "@/components/animerch/PixelButton";
import { AdminModal } from "./AdminModal";
import { pushToast } from "./AdminToast";
import { CategoryManager } from "./CategoryManager";

type Form = { image: string; emoji: string; name: string; date: string; category_id: string; description: string };
const empty = (): Form => ({ image: "", emoji: "🖼️", name: "", date: "", category_id: "", description: "" });

export function GalleryFormModal({
  open, onClose, item, onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  item?: GalleryItem | null;
  onSubmit: (g: GalleryItem) => void;
}) {
  const cats = useAnimerchStore((s) => s.galleryCategories);
  const sortedCats = [...cats].sort((a, b) => a.name.localeCompare(b.name));
  const [f, setF] = useState<Form>(empty);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [mgrOpen, setMgrOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    if (item) {
      setF({
        image: item.image ?? "",
        emoji: item.emoji,
        name: item.name,
        date: item.date,
        category_id: item.category_id ?? "",
        description: item.description,
      });
    } else setF({ ...empty(), category_id: sortedCats[0]?.id ?? "" });
  }, [open, item]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((s) => ({ ...s, [k]: v }));

  const handleFile = (file?: File) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => set("image", String(r.result));
    r.readAsDataURL(file);
  };

  const submit = () => {
    const err: Record<string, boolean> = {};
    (["name", "date", "category_id", "description"] as (keyof Form)[]).forEach((k) => {
      if (!String(f[k]).trim()) err[k] = true;
    });
    if (Object.keys(err).length) {
      setErrors(err);
      pushToast("⚠ FILL ALL REQUIRED FIELDS", "warning");
      return;
    }
    const out: GalleryItem = {
      id: item?.id ?? `gal_${Date.now()}`,
      name: f.name,
      category_id: f.category_id,
      date: f.date,
      description: f.description,
      image: f.image,
      bg: item?.bg ?? "#ddf0ff",
      emoji: f.emoji || "🖼️",
      height: item?.height ?? 260,
    };
    onSubmit(out);
  };

  const cls = (k: keyof Form) => `pixel-input ${errors[k] ? "invalid" : ""}`;

  return (
    <>
      <AdminModal open={open} onClose={onClose} title={item ? "EDIT IMAGE" : "ADD NEW IMAGE"}>
        <div className="space-y-4">
          <div>
            <label className="pixel-label">PICTURE *</label>
            <label className="block border-[3px] border-dashed border-ink bg-cloud p-4 text-center cursor-pointer">
              {f.image ? (
                <img src={f.image} alt="preview" className="mx-auto max-h-48 object-contain border-2 border-ink" />
              ) : (
                <span className="font-pixel text-[10px] text-ink">📁 DROP IMAGE OR CLICK TO UPLOAD</span>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
            </label>
            {f.image && (
              <PixelButton onClick={() => set("image", "")} className="text-[8px] mt-2" style={{ background: "hsl(var(--admin-danger))" }}>
                [ REMOVE IMAGE ]
              </PixelButton>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="pixel-label">NAME *</label>
              <input className={cls("name")} value={f.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div>
              <label className="pixel-label">DATE *</label>
              <input type="month" className={cls("date")} value={f.date} onChange={(e) => set("date", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="pixel-label">CATEGORY *</label>
              <select className={cls("category_id")} value={f.category_id} onChange={(e) => set("category_id", e.target.value)}>
                <option value="" disabled>— Select category —</option>
                {sortedCats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <div className="mt-2">
                <PixelButton type="button" onClick={() => setMgrOpen(true)} className="text-[8px]">[ ⚙ MANAGE CATEGORIES ]</PixelButton>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="pixel-label">DESCRIPTION *</label>
              <textarea className={cls("description")} rows={4} value={f.description} onChange={(e) => set("description", e.target.value)} />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-3 border-t-[3px] border-ink">
            <PixelButton onClick={onClose}>[ CANCEL ]</PixelButton>
            <PixelButton onClick={submit} variant="primary">[ {item ? "UPDATE" : "SAVE"} IMAGE ]</PixelButton>
          </div>
        </div>
      </AdminModal>
      <CategoryManager open={mgrOpen} onClose={() => setMgrOpen(false)} kind="gallery" selectedId={f.category_id} />
    </>
  );
}
