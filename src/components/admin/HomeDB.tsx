import { useEffect, useState } from "react";
import { animerchStore, useAnimerchStore } from "@/store/animerchStore";
import { formatIDR } from "@/data/animerch";
import { PixelButton } from "@/components/animerch/PixelButton";
import { ProductCard } from "@/components/animerch/ProductCard";
import { AdminModal } from "./AdminModal";
import { pushToast } from "./AdminToast";

export function HomeDB() {
  const products = useAnimerchStore((s) => s.products);
  const stored = useAnimerchStore((s) => s.featured);
  const [draft, setDraft] = useState<(string | null)[]>([stored[0] ?? null, stored[1] ?? null, stored[2] ?? null]);
  const [pickerSlot, setPickerSlot] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  // If a featured product gets deleted from elsewhere, reflect it
  useEffect(() => {
    setDraft((d) => d.map((id) => (id && products.find((p) => p.id === id) ? id : null)));
  }, [products]);

  const setSlot = (i: number, id: string | null) =>
    setDraft((d) => d.map((v, idx) => (idx === i ? id : v)));

  const save = () => {
    if (draft.some((d) => !d)) {
      pushToast("⚠ FILL ALL 3 SLOTS", "warning");
      return;
    }
    animerchStore.setFeatured(draft);
    pushToast("✔ SAVED!", "success");
  };

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  const draftHasDeleted = stored.some((id) => id && !products.find((p) => p.id === id));

  return (
    <div className="admin-panel p-6">
      <h2 className="font-pixel text-sm text-ink">[ FEATURED ITEMS MANAGER ]</h2>
      <p className="font-body text-sm text-ink/70 mt-2">Select exactly 3 products to display on the Home page.</p>

      {draftHasDeleted && (
        <div className="mt-4 border-[3px] border-ink p-3 font-pixel text-[10px] text-ink"
          style={{ background: "hsl(var(--admin-warning))" }}>
          ⚠ A FEATURED PRODUCT WAS DELETED — REASSIGN SLOT
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        {draft.map((id, i) => {
          const p = products.find((x) => x.id === id);
          return (
            <div key={i}>
              <p className="font-pixel text-[10px] text-ink mb-2 text-center">SLOT {i + 1}</p>
              {p ? (
                <div className="pixel-box bg-card p-3 flex flex-col gap-2">
                  <div className="aspect-square border-[2px] border-ink grid place-items-center text-6xl overflow-hidden" style={{ background: p.imageBg }}>
                    {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <span>{p.emoji}</span>}
                  </div>
                  <p className="font-pixel text-[8px] text-ink leading-snug">{p.name}</p>
                  <p className="font-body font-bold text-ink">{formatIDR(p.price)}</p>
                  <PixelButton onClick={() => setPickerSlot(i)} className="text-[8px] py-2">[ CHANGE ]</PixelButton>
                  <PixelButton onClick={() => setSlot(i, null)} className="text-[8px] py-2" style={{ background: "hsl(var(--admin-danger))" }}>[ REMOVE ]</PixelButton>
                </div>
              ) : (
                <div className="empty-slot">
                  <div>
                    <p className="font-pixel text-[10px] text-ink mb-3">[ EMPTY SLOT ]</p>
                    <PixelButton onClick={() => setPickerSlot(i)} variant="primary" className="text-[10px]">[ + SELECT PRODUCT ]</PixelButton>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <PixelButton onClick={save} variant="primary" className="text-[12px] px-8 py-4">
          [ SAVE FEATURED ]
        </PixelButton>
      </div>

      {/* Live preview */}
      <div className="mt-10">
        <h3 className="font-pixel text-[10px] text-ink mb-3">[ LIVE PREVIEW ]</h3>
        <div className="relative pixel-box bg-cloud p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 opacity-70 pointer-events-none">
            {draft.map((id, i) => {
              const p = products.find((x) => x.id === id);
              if (!p) return (
                <div key={i} className="empty-slot" style={{ minHeight: 200 }}>
                  <p className="font-pixel text-[10px] text-ink/60">[ EMPTY ]</p>
                </div>
              );
              return <ProductCard key={i} product={p} />;
            })}
          </div>
          <span className="absolute inset-0 grid place-items-center font-pixel text-2xl text-ink/30 pointer-events-none select-none">
            PREVIEW
          </span>
        </div>
      </div>

      <AdminModal
        open={pickerSlot !== null}
        onClose={() => setPickerSlot(null)}
        title="SELECT A PRODUCT"
      >
        <input
          type="text"
          className="pixel-input mb-4 font-pixel text-[10px]"
          placeholder="SEARCH..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[60vh] overflow-auto pr-1">
          {filtered.map((p) => {
            const isFeatured = draft.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                disabled={isFeatured}
                className="pixel-card p-0 text-left relative disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  if (isFeatured) return;
                  if (pickerSlot !== null) setSlot(pickerSlot, p.id);
                  setPickerSlot(null);
                  setSearch("");
                }}
              >
                <div className="aspect-square border-b-[2px] border-ink grid place-items-center text-5xl overflow-hidden" style={{ background: p.imageBg }}>
                  {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <span>{p.emoji}</span>}
                </div>
                <div className="p-2">
                  <p className="font-pixel text-[7px] text-ink leading-snug">{p.name}</p>
                  <p className="font-body text-xs font-bold text-ink mt-1">{formatIDR(p.price)}</p>
                </div>
                {isFeatured && (
                  <span className="absolute top-1 right-1 font-pixel text-[7px] bg-gold text-ink border-2 border-ink px-1 py-0.5">
                    FEATURED
                  </span>
                )}
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="col-span-full text-center font-pixel text-[10px] text-ink py-8">[ NO ITEMS FOUND ]</p>
          )}
        </div>
      </AdminModal>
    </div>
  );
}
