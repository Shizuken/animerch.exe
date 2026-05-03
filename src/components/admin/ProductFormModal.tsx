import { useEffect, useState } from "react";
import { Product } from "@/data/animerch";
import { useAnimerchStore } from "@/store/animerchStore";
import { PixelButton } from "@/components/animerch/PixelButton";
import { AdminModal } from "./AdminModal";
import { pushToast } from "./AdminToast";
import { CategoryManager } from "./CategoryManager";

const BG_FALLBACK = "#ddf0ff";

type Form = {
  image: string;
  emoji: string;
  name: string;
  price: string;
  category_id: string;
  l: string; w: string; h: string;
  weight: string;
  description: string;
  buyUrl: string;
};

const empty = (): Form => ({
  image: "", emoji: "🎁", name: "", price: "", category_id: "",
  l: "", w: "", h: "", weight: "", description: "", buyUrl: "",
});

export function ProductFormModal({
  open, onClose, product, onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
  onSubmit: (p: Product) => void;
}) {
  const cats = useAnimerchStore((s) => s.productCategories);
  const sortedCats = [...cats].sort((a, b) => a.name.localeCompare(b.name));
  const [f, setF] = useState<Form>(empty);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [mgrOpen, setMgrOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    if (product) {
      setF({
        image: product.image, emoji: product.emoji, name: product.name,
        price: String(product.price), category_id: product.category_id ?? "",
        l: String(product.dims.l), w: String(product.dims.w), h: String(product.dims.h),
        weight: String(product.weight), description: product.description, buyUrl: product.buyUrl,
      });
    } else {
      setF({ ...empty(), category_id: sortedCats[0]?.id ?? "" });
    }
  }, [open, product]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((s) => ({ ...s, [k]: v }));

  const handleFile = (file?: File) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => set("image", String(r.result));
    r.readAsDataURL(file);
  };

  const submit = () => {
    const req: (keyof Form)[] = ["name", "price", "category_id", "l", "w", "h", "weight", "description", "buyUrl"];
    const err: Record<string, boolean> = {};
    req.forEach((k) => { if (!String(f[k]).trim()) err[k] = true; });
    if (Object.keys(err).length) {
      setErrors(err);
      pushToast("⚠ FILL ALL REQUIRED FIELDS", "warning");
      return;
    }
    const out: Product = {
      id: product?.id ?? `prod_${Date.now()}`,
      name: f.name, category_id: f.category_id, price: Number(f.price),
      image: f.image, imageBg: product?.imageBg ?? BG_FALLBACK,
      emoji: f.emoji || "🎁",
      dims: { l: Number(f.l), w: Number(f.w), h: Number(f.h) },
      weight: Number(f.weight),
      description: f.description, buyUrl: f.buyUrl,
      badge: product?.badge,
    };
    onSubmit(out);
  };

  const cls = (k: keyof Form) => `pixel-input ${errors[k] ? "invalid" : ""}`;

  return (
    <>
      <AdminModal open={open} onClose={onClose} title={product ? "EDIT PRODUCT" : "ADD NEW PRODUCT"}>
        <div className="space-y-4">
          <div>
            <label className="pixel-label">PICTURE <span style={{ color: "hsl(var(--admin-danger))" }}>*</span></label>
            <label className="block border-[3px] border-dashed border-ink bg-cloud p-4 text-center cursor-pointer">
              {f.image ? (
                <div className="space-y-2">
                  <img src={f.image} alt="preview" className="mx-auto max-h-40 object-cover border-2 border-ink" />
                  <PixelButton type="button" onClick={(e) => { e.preventDefault(); set("image", ""); }} className="text-[8px]" style={{ background: "hsl(var(--admin-danger))" }}>
                    [ REMOVE IMAGE ]
                  </PixelButton>
                </div>
              ) : (
                <span className="font-pixel text-[10px] text-ink">📁 DROP IMAGE OR CLICK TO UPLOAD</span>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="pixel-label">NAME *</label>
              <input className={cls("name")} value={f.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div>
              <label className="pixel-label">PRICE *</label>
              <div className="flex items-stretch">
                <span className="font-pixel text-[10px] px-3 grid place-items-center border-2 border-r-0 border-ink bg-gold">Rp</span>
                <input type="number" min="0" step="1000" placeholder="0" className={cls("price")} value={f.price} onChange={(e) => set("price", e.target.value)} />
              </div>
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
            <div>
              <label className="pixel-label">LENGTH (cm) *</label>
              <input type="number" className={cls("l")} value={f.l} onChange={(e) => set("l", e.target.value)} />
            </div>
            <div>
              <label className="pixel-label">WIDTH (cm) *</label>
              <input type="number" className={cls("w")} value={f.w} onChange={(e) => set("w", e.target.value)} />
            </div>
            <div>
              <label className="pixel-label">HEIGHT (cm) *</label>
              <input type="number" className={cls("h")} value={f.h} onChange={(e) => set("h", e.target.value)} />
            </div>
            <div>
              <label className="pixel-label">WEIGHT (g) *</label>
              <input type="number" className={cls("weight")} value={f.weight} onChange={(e) => set("weight", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="pixel-label">DESCRIPTION *</label>
              <textarea className={cls("description")} rows={4} value={f.description} onChange={(e) => set("description", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="pixel-label">LINK TO BUY 🔗 *</label>
              <input type="url" className={cls("buyUrl")} value={f.buyUrl} onChange={(e) => set("buyUrl", e.target.value)} />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-3 border-t-[3px] border-ink">
            <PixelButton onClick={onClose}>[ CANCEL ]</PixelButton>
            <PixelButton onClick={submit} variant="primary">
              [ {product ? "UPDATE" : "SAVE"} PRODUCT ]
            </PixelButton>
          </div>
        </div>
      </AdminModal>
      <CategoryManager open={mgrOpen} onClose={() => setMgrOpen(false)} kind="product" selectedId={f.category_id} />
    </>
  );
}
