import { useMemo, useState } from "react";
import { animerchStore, useAnimerchStore } from "@/store/animerchStore";
import { GALLERY_SERIES, GalleryItem } from "@/data/animerch";
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
  const [series, setSeries] = useState<string[]>([]);
  const [year, setYear] = useState("All");
  const [sort, setSort] = useState<Sort>("Newest First");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [deleting, setDeleting] = useState<GalleryItem | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = items.filter((g) =>
      (series.length === 0 || series.includes(g.series)) &&
      (year === "All" || g.date.startsWith(year))
    );
    if (sort === "Newest First") list = [...list].sort((a, b) => b.date.localeCompare(a.date));
    if (sort === "Oldest First") list = [...list].sort((a, b) => a.date.localeCompare(b.date));
    if (sort === "Name A–Z") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [items, series, year, sort]);

  const toggle = (s: string) => setSeries((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
  const reset = () => { setSeries([]); setYear("All"); setSort("Newest First"); };

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
            {GALLERY_SERIES.map((s) => (
              <PixelCheckbox key={s} label={s} checked={series.includes(s)} onChange={() => toggle(s)} />
            ))}
          </div>
        </div>
        <div>
          <p className="font-pixel text-[8px] text-ink mb-2">YEAR</p>
          <select value={year} onChange={(e) => setYear(e.target.value)} className="pixel-input">
            <option>All</option><option>2023</option><option>2024</option><option>2025</option><option>2026</option>
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
                <div className="w-12 h-12 border-2 border-ink grid place-items-center text-2xl" style={{ background: g.bg }}>
                  {g.emoji}
                </div>
                <div className="min-w-0">
                  <p className="font-pixel text-[8px] text-ink leading-snug truncate">{g.name}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="font-body text-ink/60 text-xs">{fmt(g.date)}</span>
                    <span className="pill">{g.series}</span>
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
        emoji={deleting?.emoji}
        bg={deleting?.bg}
      />
    </div>
  );
}