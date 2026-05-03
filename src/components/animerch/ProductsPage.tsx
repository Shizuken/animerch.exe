import { useMemo, useState } from "react";
import { Product, formatIDR } from "@/data/animerch";
import { useAnimerchStore } from "@/store/animerchStore";
import { ProductCard } from "./ProductCard";
import { FilterPanel } from "./FilterPanel";
import { PixelCheckbox } from "./PixelCheckbox";

const SORTS = ["Newest", "Price Low→High", "Price High→Low", "Name A–Z"] as const;
type Sort = (typeof SORTS)[number];

export function ProductsPage({ onPick }: { onPick: (p: Product) => void }) {
  const PRODUCTS = useAnimerchStore((s) => s.products);
  const cats = useAnimerchStore((s) => s.productCategories);
  const sortedCats = [...cats].sort((a, b) => a.name.localeCompare(b.name));
  const minP = PRODUCTS.length ? Math.min(...PRODUCTS.map((p) => p.price)) : 0;
  const maxP = PRODUCTS.length ? Math.max(...PRODUCTS.map((p) => p.price)) : 1000000;
  const [catIds, setCatIds] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(maxP);
  const [sort, setSort] = useState<Sort>("Newest");
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) =>
      p.price <= maxPrice &&
      (catIds.length === 0 || (p.category_id && catIds.includes(p.category_id)))
    );
    switch (sort) {
      case "Price Low→High": list = [...list].sort((a, b) => a.price - b.price); break;
      case "Price High→Low": list = [...list].sort((a, b) => b.price - a.price); break;
      case "Name A–Z":       list = [...list].sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return list;
  }, [catIds, maxPrice, sort, PRODUCTS]);

  const apply = () => { setLoading(true); setTimeout(() => setLoading(false), 300); };
  const toggleCat = (id: string) =>
    setCatIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <section className="container py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <FilterPanel onApply={apply}>
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
              onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
              className="w-full accent-ink" aria-label="Maximum price" />
          </div>
          <div>
            <p className="font-pixel text-[8px] text-ink mb-2">SORT BY</p>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}
              className="w-full bg-card border-[3px] border-ink p-2 font-body text-sm text-ink focus:outline-none"
              style={{ boxShadow: "3px 3px 0 0 hsl(var(--pixel-shadow))" }}>
              {SORTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </FilterPanel>

        <div className="flex-1 min-w-0">
          <div className="flex items-end justify-between mb-4 flex-wrap gap-2">
            <h2 className="font-pixel text-sm sm:text-base text-ink">[ PRODUCT LIST ]</h2>
            <p className="font-body text-sm text-ink/70">
              {loading ? <span className="cursor-blink font-pixel text-[10px]">LOADING…</span> : `Showing ${filtered.length} items`}
            </p>
          </div>
          {filtered.length === 0 ? (
            <div className="pixel-box bg-cloud p-10 text-center font-body text-ink">
              <p className="font-pixel text-[10px] mb-2">[ EMPTY ]</p>
              No items match your filter. Try widening the search!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} onClick={() => onPick(p)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
