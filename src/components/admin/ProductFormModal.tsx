import { useEffect, useState } from "react";
import { Product } from "@/data/animerch";
import { PixelButton } from "@/components/animerch/PixelButton";
import { AdminModal } from "./AdminModal";
import { pushToast } from "./AdminToast";

const CATEGORIES: Product["category"][] = ["Keychain", "Plushie", "Poster", "Apparel", "Acrylic Stand"];
const BG_BY_CAT: Record<Product["category"], string> = {
  Keychain: "#ffcde8", Plushie: "#ffcde8", Poster: "#89c4f4", Apparel: "#ddf0ff", "Acrylic Stand": "#ffe76a",
};

type Form = {
  image: string;
  emoji: string;
  name: string;
  price: string;
  category: Product["category"];
  l: string; w: string; h: string;
  weight: string;
  description: string;
  buyUrl: string;
};

const empty = (): Form => ({
  image: "", emoji: "🎁", name: "", price: "", category: "Keychain",
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
  const [f, setF] = useState<Form>(empty);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    if (product) {
      setF({
        image: product.image, emoji: product.emoji, name: product.name,
        price: String(product.price), category: product.category,
        l: String(product.dims.l), w: String(product.dims.w), h: String(product.dims.h),
        weight: String(product.weight), description: product.description, buyUrl: product.buyUrl,
      });
    } else {
      setF(empty());
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
    const req: (keyof Form)[] = ["name", "price", "category", "l", "w", "h", "weight", "description", "buyUrl"];
    const err: Record<string, boolean> = {};
    req.forEach((k) => { if (!String(f[k]).trim()) err[k] = true; });
    if (Object.keys(err).length) {
      setErrors(err);
      pushToast("⚠ FILL ALL REQUIRED FIELDS", "warning");
      return;
    }
    const out: Product = {
      id: product?.id ?? `p-${Date.now()}`,
      name: f.name, category: f.category, price: Number(f.price),
      image: f.image, imageBg: product?.imageBg ?? BG_BY_CAT[f.category],
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
            <label className="pixel-label">NAME <span style={{ color: "hsl(var(--admin-danger))" }}>*</span></label>
            <input className={cls("name")} value={f.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div>
            <label className="pixel-label">PRICE (¥) <span style={{ color: "hsl(var(--admin-danger))" }}>*</span></label>
            <input type="number" className={cls("price")} value={f.price} onChange={(e) => set("price", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="pixel-label">CATEGORY <span style={{ color: "hsl(var(--admin-danger))" }}>*</span></label>
            <select className={cls("category")} value={f.category} onChange={(e) => set("category", e.target.value as Product["category"])}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
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
  );
}