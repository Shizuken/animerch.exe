import { useEffect, useMemo, useState } from "react";
import { GalleryItem } from "@/data/animerch";
import { categoryName, useAnimerchStore } from "@/store/animerchStore";
import { FilterPanel } from "./FilterPanel";
import { PixelCheckbox } from "./PixelCheckbox";
import { PixelButton } from "./PixelButton";

const SORTS = ["Newest First", "Oldest First", "Name A–Z"] as const;
type Sort = (typeof SORTS)[number];

function fmtDate(d: string) {
  const [y, m] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m,10)-1]} ${y}`;
}

export function GalleryPage() {
  const GALLERY = useAnimerchStore((s) => s.gallery);
  const cats = useAnimerchStore((s) => s.galleryCategories);
  const sortedCats = [...cats].sort((a, b) => a.name.localeCompare(b.name));
  const [catIds, setCatIds] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>("Newest First");
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const filtered = useMemo(() => {
    let list = GALLERY.filter((g) => catIds.length === 0 || (g.category_id && catIds.includes(g.category_id)));
    switch (sort) {
      case "Newest First": list = [...list].sort((a, b) => b.date.localeCompare(a.date)); break;
      case "Oldest First": list = [...list].sort((a, b) => a.date.localeCompare(b.date)); break;
      case "Name A–Z":     list = [...list].sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return list;
  }, [catIds, sort, GALLERY]);

  const toggle = (id: string) =>
    setCatIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const open = openIdx !== null ? filtered[openIdx] : null;

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIdx(null);
      if (e.key === "ArrowRight") setOpenIdx((i) => (i === null ? null : (i + 1) % filtered.length));
      if (e.key === "ArrowLeft")  setOpenIdx((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, filtered.length]);

  return (
    <section className="container py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <FilterPanel onApply={() => {}}>
          <div>
            <p className="font-pixel text-[8px] text-ink mb-2">SERIES</p>
            <div className="space-y-2">
              {sortedCats.map((c) => (
                <PixelCheckbox key={c.id} label={c.name} checked={catIds.includes(c.id)} onChange={() => toggle(c.id)} />
              ))}
            </div>
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
            <h2 className="font-pixel text-sm sm:text-base text-ink">[ GALLERY ]</h2>
            <p className="font-body text-sm text-ink/70">{filtered.length} pieces</p>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
            {filtered.map((g, i) => (
              <button key={g.id} type="button" onClick={() => setOpenIdx(i)}
                className="pixel-card mb-5 break-inside-avoid block w-full text-left p-0 group" aria-label={`View ${g.name}`}>
                <div className="relative w-full" style={{ background: g.bg, height: g.height }}>
                  {g.image
                    ? <img src={g.image} alt={g.name} className="absolute inset-0 w-full h-full object-cover" />
                    : <div className="absolute inset-0 grid place-items-center text-7xl select-none">{g.emoji}</div>}
                  <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/30 transition-colors grid place-items-center">
                    <span className="opacity-0 group-hover:opacity-100 font-pixel text-[10px] text-cloud bg-ink border-2 border-cloud px-3 py-2">🔍 VIEW</span>
                  </div>
                </div>
                <div className="bg-white/85 px-3 py-2 border-t-[3px] border-ink">
                  <p className="font-pixel text-[8px] text-ink leading-snug">{g.name}</p>
                  <p className="font-body text-xs text-ink/60 mt-1">{fmtDate(g.date)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {open && (
        <Lightbox
          item={open}
          categoryLabel={categoryName(cats, open.category_id)}
          onClose={() => setOpenIdx(null)}
          onPrev={() => setOpenIdx((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length))}
          onNext={() => setOpenIdx((i) => (i === null ? null : (i + 1) % filtered.length))}
        />
      )}
    </section>
  );
}

function Lightbox({
  item, categoryLabel, onClose, onPrev, onNext,
}: { item: GalleryItem; categoryLabel: string; onClose: () => void; onPrev: () => void; onNext: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4"
      style={{ background: "hsla(224, 42%, 30%, 0.8)" }} onClick={onClose}
      role="dialog" aria-modal="true" aria-label={item.name}>
      <div className="relative w-full max-w-4xl pixel-box-lg bg-card animate-slide-up-fade" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="pixel-btn absolute -top-3 -right-3 !p-0 w-9 h-9" aria-label="Close">X</button>
        <PixelButton onClick={onPrev} aria-label="Previous" className="absolute left-2 top-1/2 -translate-y-1/2 !p-0 w-10 h-10">◀</PixelButton>
        <PixelButton onClick={onNext} aria-label="Next"     className="absolute right-2 top-1/2 -translate-y-1/2 !p-0 w-10 h-10">▶</PixelButton>

        <div className="p-4">
          <div className="relative w-full grid place-items-center border-[3px] border-ink overflow-hidden"
            style={{ background: item.bg, height: "min(60vh, 480px)" }}>
            {item.image
              ? <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
              : <div className="text-[10rem] sm:text-[12rem] select-none">{item.emoji}</div>}
          </div>
          <div className="mt-4 space-y-2">
            <h3 className="font-pixel text-sm text-ink">{item.name}</h3>
            <p className="font-body text-xs text-ink/60">{categoryLabel} · {(() => { const [y,m]=item.date.split("-"); const months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; return `${months[parseInt(m,10)-1]} ${y}`; })()}</p>
            <p className="font-body text-sm text-ink/80">{item.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
