import { useMemo, useState } from "react";
import { animerchStore, categoryName, useAnimerchStore } from "@/store/animerchStore";
import { Product, formatIDR } from "@/data/animerch";
import { PixelButton } from "@/components/animerch/PixelButton";
import { PixelCheckbox } from "@/components/animerch/PixelCheckbox";
import { ProductFormModal } from "./ProductFormModal";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { pushToast } from "./AdminToast";

const SORTS = ["Newest", "Price Low→High", "Price High→Low", "Name A–Z"] as const;
type Sort = (typeof SORTS)[number];

export function ProductListDB() {
  const products = useAnimerchStore((s) => s.products);
  const cats = useAnimerchStore((s) => s.productCategories);
  const sortedCats = [...cats].sort((a, b) => a.name.localeCompare(b.name));
  const minP = products.length ? Math.min(...products.map((p) => p.price)) : 0;
  const maxP = products.length ? Math.max(...products.map((p) => p.price)) : 1000000;
  const [catIds, setCatIds] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(maxP);
  const [sort, setSort] = useState<Sort>("Newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = products.filter((p) =>
      p.price <= maxPrice &&
      (catIds.length === 0 || (p.category_id && catIds.includes(p.category_id)))
    );
    if (sort === "Price Low→High") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "Price High→Low") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "Name A–Z") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, catIds, maxPrice, sort]);

  const toggleCat = (id: string) => setCatIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const reset = () => { setCatIds([]); setMaxPrice(maxP); setSort("Newest"); };

  const confirmDelete = () => {
    if (!deleting) return;
    const id = deleting.id;
    setRemovingId(id);
    setDeleting(null);
    setTimeout(() => {
      animerchStore.removeProduct(id);
      setRemovingId(null);
      pushToast("✔ PRODUCT DELETED", "success");
    }, 250);
  };

  const filterContent = (
    <>
      <h3 className="font-pixel text-[10px] text-ink mb-4">[ FILTER ]</h3>
      <div className="space-y-5">
        <div>
          <p className="font-pixel text-[8px] text-ink mb-2">CATEGORY</p>
          <div className="space-y-2">
            {sortedCats.map((c) => (
              <PixelCheckbox key={c.id} label={c.name} checked={catIds.includes(c.id)} onChange={() => toggleCat(c.id)} />
            ))}
          </div>
        </div>
        <div>
          <p className="font-pixel text-[8px] text-ink mb-2">MAX PRICE: {formatIDR(maxPrice)}</p>
          <input type="range" min={minP} max={maxP || 1} step={1000} value={maxPrice}
            onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))} className="w-full accent-ink" />
        </div>
        <div>
          <p className="font-pixel text-[8px] text-ink mb-2">SORT BY</p>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="pixel-input">
            {SORTS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <PixelButton variant="primary" onClick={() => setFiltersOpen(false)} className="w-full">[ APPLY ]</PixelButton>
          <PixelButton onClick={reset} className="w-full" style={{ background: "hsl(var(--admin-danger))" }}>[ RESET ]</PixelButton>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <aside className="hidden md:block pixel-box bg-cloud p-4 w-[240px] flex-shrink-0 self-start">
        {filterContent}
      </aside>
      <div className="md:hidden">
        <PixelButton onClick={() => setFiltersOpen((v) => !v)} className="w-full">
          [ FILTER {filtersOpen ? "▲" : "▼"} ]
        </PixelButton>
        {filtersOpen && <div className="pixel-box bg-cloud p-4 mt-2">{filterContent}</div>}
      </div>

      <div className="flex-1 min-w-0 admin-panel p-4">
        <h2 className="font-pixel text-sm text-ink mb-3">[ PRODUCT LIST DATABASE ]</h2>
        <div className="flex justify-between items-center flex-wrap gap-2 mb-3">
          <p className="font-body text-sm text-ink/80">Showing {filtered.length} products</p>
          <PixelButton onClick={() => setAdding(true)} style={{ background: "hsl(var(--admin-success))" }} className="text-[10px]">
            [ + ADD NEW PRODUCT ]
          </PixelButton>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-3">📦</div>
            <p className="font-pixel text-[10px] text-ink">[ NO ITEMS FOUND ]</p>
          </div>
        ) : (
          <div className="border-t-2 border-ink">
            {filtered.map((p) => (
              <div key={p.id} className={`row-card ${removingId === p.id ? "row-removing" : ""}`}>
                <div className="w-12 h-12 border-2 border-ink grid place-items-center text-2xl overflow-hidden" style={{ background: p.imageBg }}>
                  {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <span>{p.emoji}</span>}
                </div>
                <div className="min-w-0">
                  <p className="font-pixel text-[8px] text-ink leading-snug truncate">{p.name}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="font-body font-bold text-ink text-sm">{formatIDR(p.price)}</span>
                    <span className="pill">{categoryName(cats, p.category_id)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <PixelButton onClick={() => setEditing(p)} className="text-[8px] py-2" style={{ background: "hsl(var(--sky-accent))" }}>
                    [ EDIT ]
                  </PixelButton>
                  <PixelButton onClick={() => setDeleting(p)} className="text-[8px] py-2" style={{ background: "hsl(var(--admin-danger))" }}>
                    [ DELETE ]
                  </PixelButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ProductFormModal
        open={adding}
        onClose={() => setAdding(false)}
        onSubmit={(p) => { animerchStore.addProduct(p); setAdding(false); pushToast("✔ PRODUCT ADDED!", "success"); }}
      />
      <ProductFormModal
        open={!!editing}
        product={editing}
        onClose={() => setEditing(null)}
        onSubmit={(p) => { animerchStore.updateProduct(p.id, p); setEditing(null); pushToast("✔ PRODUCT UPDATED!", "success"); }}
      />
      <ConfirmDeleteModal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="DELETE PRODUCT?"
        name={deleting?.name ?? ""}
        image={deleting?.image}
        emoji={deleting?.emoji}
        bg={deleting?.imageBg}
      />
    </div>
  );
}
