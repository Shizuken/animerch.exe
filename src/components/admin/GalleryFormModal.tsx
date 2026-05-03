import { useEffect, useState } from "react";
import { GalleryItem } from "@/data/animerch";
import { PixelButton } from "@/components/animerch/PixelButton";
import { AdminModal } from "./AdminModal";
import { pushToast } from "./AdminToast";

type Form = { image: string; emoji: string; name: string; date: string; series: string; description: string };
const empty = (): Form => ({ image: "", emoji: "🖼️", name: "", date: "", series: "Original", description: "" });

export function GalleryFormModal({
  open, onClose, item, onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  item?: GalleryItem | null;
  onSubmit: (g: GalleryItem) => void;
}) {
  const [f, setF] = useState<Form>(empty);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    if (item) {
      const dateInput = item.date.length === 7 ? `${item.date}-01` : item.date;
      setF({ image: "", emoji: item.emoji, name: item.name, date: dateInput, series: item.series, description: item.description });
    } else setF(empty());
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
    (["name", "date", "series", "description"] as (keyof Form)[]).forEach((k) => {
      if (!String(f[k]).trim()) err[k] = true;
    });
    if (Object.keys(err).length) {
      setErrors(err);
      pushToast("⚠ FILL ALL REQUIRED FIELDS", "warning");
      return;
    }
    const out: GalleryItem = {
      id: item?.id ?? `g-${Date.now()}`,
      name: f.name,
      series: f.series,
      date: f.date.slice(0, 7),
      description: f.description,
      bg: item?.bg ?? "#ddf0ff",
      emoji: f.emoji || "🖼️",
      height: item?.height ?? 260,
    };
    onSubmit(out);
  };

  const cls = (k: keyof Form) => `pixel-input ${errors[k] ? "invalid" : ""}`;

  return (
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
            <input type="date" className={cls("date")} value={f.date} onChange={(e) => set("date", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="pixel-label">CATEGORY / SERIES *</label>
            <input className={cls("series")} value={f.series} onChange={(e) => set("series", e.target.value)} list="series-list" />
            <datalist id="series-list">
              <option value="Original" /><option value="Demon Slayer" /><option value="One Piece" />
            </datalist>
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
  );
}