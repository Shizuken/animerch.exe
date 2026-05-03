import { useMemo, useState } from "react";
import { animerchStore, categoryName, useAnimerchStore } from "@/store/animerchStore";
import { GalleryItem } from "@/data/animerch";
import { PixelButton } from "@/components/animerch/PixelButton";
import { PixelCheckbox } from "@/components/animerch/PixelCheckbox";
import { GalleryFormModal } from "./GalleryFormModal";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { pushToast } from "./AdminToast";

const SORTS = ["Newest First", "Oldest First", "Name A–Z"] as const;
type Sort = (typeof SORTS)[number];

function fmt(d: string) {
  const [y, m] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m,10)-1]} ${y}`;
}

export function GalleryDB() {
  const items = useAnimerchStore((s) => s.gallery);
  const cats = useAnimerchStore((s) => s.galleryCategories);
  const sortedCats = [...cats].sort((a, b) => a.name.localeCompare(b.name));
  const [catIds, setCatIds] = useState<string[]>([]);
  const [year, setYear] = useState("All");
  const [sort, setSort] = useState<Sort>("Newest First");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [deleting, setDeleting] = useState<GalleryItem | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const years = useMemo(() => {
    const ys = new Set(items.map((g) => g.date.slice(0, 4)));
    return ["All", ...Array.from(ys).sort().reverse()];
  }, [items]);

  const filtered = useMemo(() => {
    let list = items.filter((g) =>
      (catIds.length === 0 || (g.category_id && catIds.includes(g.category_id))) &&
      (year === "All" || g.date.startsWith(year))
    );
    if (sort === "Newest First") list = [...list].sort((a, b) => b.date.localeCompare(a.date));
    if (sort === "Oldest First") list = [...list].sort((a, b) => a.date.localeCompare(b.date));
    if (sort === "Name A–Z") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [items, catIds, year, sort]);

  const toggle = (id: string) => setCatIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const reset = () => { setCatIds([]); setYear("All"); setSort("Newest First"); };

  const confirmDelete = () => {
    if (!deleting) return;
    const id = deleting.id;
    setRemovingId(id);
    setDeleting(null);
    setTimeout(() => {
      animerchStore.removeGallery(id);
      setRemovingId(null);
      pushToast("✔ IMAGE DELETED", "success");
    }, 250);
  };

  const filterContent = (
    <>
      <h3 className="font-pixel text-[10px] text-ink mb-4">[ FILTER ]</h3>
      <div className="space-y-5">
        <div>
          <p className="font-pixel text-[8px] text-ink mb-2">SERIES</p>
          <div className="space-y-2">
            {sortedCats.map((c) => (
              <PixelCheckbox key={c.id} label={c.name} checked={catIds.includes(c.id)} onChange={() => toggle(c.id)} />
            ))}
          </div>
        </div>
        <div>
          <p className="font-pixel text-[8px] text-ink mb-2">YEAR</p>
          <select value={year} onChange={(e) => setYear(e.target.value)} className="pixel-input">
            {years.map((y) => <option key={y}>{y}</option>)}
          </select>
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
        <h2 className="font-pixel text-sm text-ink mb-3">[ GALLERY DATABASE ]</h2>
        <div className="flex justify-between items-center flex-wrap gap-2 mb-3">
          <p className="font-body text-sm text-ink/80">Showing {filtered.length} items</p>
          <PixelButton onClick={() => setAdding(true)} style={{ background: "hsl(var(--admin-success))" }} className="text-[10px]">
            [ + ADD NEW IMAGE ]
          </PixelButton>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-3">🗃️</div>
            <p className="font-pixel text-[10px] text-ink">[ NO ITEMS FOUND ]</p>
          </div>
        ) : (
          <div className="border-t-2 border-ink">
            {filtered.map((g) => (
              <div key={g.id} className={`row-card ${removingId === g.id ? "row-removing" : ""}`}>
                <div className="w-12 h-12 border-2 border-ink grid place-items-center text-2xl overflow-hidden" style={{ background: g.bg }}>
                  {g.image ? <img src={g.image} alt={g.name} className="w-full h-full object-cover" /> : <span>{g.emoji}</span>}
                </div>
                <div className="min-w-0">
                  <p className="font-pixel text-[8px] text-ink leading-snug truncate">{g.name}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="font-body text-ink/60 text-xs">{fmt(g.date)}</span>
                    <span className="pill">{categoryName(cats, g.category_id)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <PixelButton onClick={() => setEditing(g)} className="text-[8px] py-2" style={{ background: "hsl(var(--sky-accent))" }}>
                    [ EDIT ]
                  </PixelButton>
                  <PixelButton onClick={() => setDeleting(g)} className="text-[8px] py-2" style={{ background: "hsl(var(--admin-danger))" }}>
                    [ DELETE ]
                  </PixelButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <GalleryFormModal
        open={adding}
        onClose={() => setAdding(false)}
        onSubmit={(g) => { animerchStore.addGallery(g); setAdding(false); pushToast("✔ IMAGE ADDED!", "success"); }}
      />
      <GalleryFormModal
        open={!!editing}
        item={editing}
        onClose={() => setEditing(null)}
        onSubmit={(g) => { animerchStore.updateGallery(g.id, g); setEditing(null); pushToast("✔ IMAGE UPDATED!", "success"); }}
      />
      <ConfirmDeleteModal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="DELETE IMAGE?"
        name={deleting?.name ?? ""}
        image={deleting?.image}
        emoji={deleting?.emoji}
        bg={deleting?.bg}
      />
    </div>
  );
}
