import { useEffect, useRef, useState } from "react";
import { Category } from "@/data/animerch";
import { animerchStore, useAnimerchStore } from "@/store/animerchStore";
import { PixelButton } from "@/components/animerch/PixelButton";

type Kind = "product" | "gallery";

export function CategoryManager({
  open,
  onClose,
  kind,
  selectedId,
}: {
  open: boolean;
  onClose: () => void;
  kind: Kind;
  selectedId?: string | null;
}) {
  const productCats = useAnimerchStore((s) => s.productCategories);
  const galleryCats = useAnimerchStore((s) => s.galleryCategories);
  const products = useAnimerchStore((s) => s.products);
  const gallery = useAnimerchStore((s) => s.gallery);
  const cats = kind === "product" ? productCats : galleryCats;

  const [newName, setNewName] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameVal, setRenameVal] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [micro, setMicro] = useState<{ text: string; ok: boolean } | null>(null);
  const microTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { e.stopPropagation(); onClose(); } };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setNewName(""); setRenamingId(null); setRenameVal(""); setDeletingId(null); setMicro(null);
    }
  }, [open]);

  const flash = (text: string, ok: boolean) => {
    setMicro({ text, ok });
    if (microTimer.current) window.clearTimeout(microTimer.current);
    microTimer.current = window.setTimeout(() => setMicro(null), 1500);
  };

  const isDup = (name: string, exceptId?: string) =>
    cats.some((c) => c.name.trim().toLowerCase() === name.trim().toLowerCase() && c.id !== exceptId);

  const add = () => {
    const n = newName.trim();
    if (!n) return flash("⚠ NAME CANNOT BE EMPTY", false);
    if (isDup(n)) return flash("⚠ ALREADY EXISTS", false);
    if (kind === "product") animerchStore.addProductCategory(n);
    else animerchStore.addGalleryCategory(n);
    setNewName("");
    flash("✔ CATEGORY ADDED", true);
  };

  const startRename = (c: Category) => { setRenamingId(c.id); setRenameVal(c.name); setDeletingId(null); };
  const saveRename = () => {
    const n = renameVal.trim();
    if (!renamingId) return;
    if (!n) return flash("⚠ NAME CANNOT BE EMPTY", false);
    if (isDup(n, renamingId)) return flash("⚠ ALREADY EXISTS", false);
    if (kind === "product") animerchStore.renameProductCategory(renamingId, n);
    else animerchStore.renameGalleryCategory(renamingId, n);
    setRenamingId(null);
    flash("✔ RENAMED SUCCESSFULLY", true);
  };

  const usageOf = (id: string) => {
    if (kind === "product")
      return { products: products.filter((p) => p.category_id === id).length, gallery: 0 };
    return { products: 0, gallery: gallery.filter((g) => g.category_id === id).length };
  };

  const confirmDelete = (id: string) => {
    if (id === selectedId) return flash("⚠ DESELECT BEFORE DELETING", false);
    if (kind === "product") animerchStore.removeProductCategory(id);
    else animerchStore.removeGalleryCategory(id);
    setDeletingId(null);
    flash("✔ CATEGORY DELETED", true);
  };

  if (!open) return null;
  const title = kind === "product" ? "MANAGE PRODUCT CATEGORIES" : "MANAGE GALLERY CATEGORIES";

  return (
    <div
      className="fixed inset-0 z-[120] grid place-items-center p-4"
      style={{ background: "hsla(224, 42%, 30%, 0.55)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="relative w-full max-w-lg bg-card border-[4px] border-ink animate-slide-up-fade"
        style={{ boxShadow: "8px 8px 0 0 hsl(var(--pixel-shadow))", maxHeight: "92vh", display: "flex", flexDirection: "column" }}
        onClick={(e) => e.stopPropagation()}
      >
        {(["tl","tr","bl","br"] as const).map((c) => (
          <span key={c} aria-hidden className="absolute font-pixel text-gold text-xs"
            style={{
              top: c.startsWith("t") ? 6 : undefined,
              bottom: c.startsWith("b") ? 6 : undefined,
              left: c.endsWith("l") ? 8 : undefined,
              right: c.endsWith("r") ? 8 : undefined,
            }}
          >◆</span>
        ))}
        <div className="admin-titlebar flex items-center justify-between !border-0 !shadow-none">
          <span>[ {title} ]</span>
          <button onClick={onClose} className="font-pixel text-[10px] text-white" aria-label="Close">[X]</button>
        </div>

        <div className="overflow-auto p-5 space-y-4">
          {/* Add new */}
          <div className="flex gap-2 items-stretch">
            <input
              type="text"
              className="pixel-input font-pixel text-[9px] flex-1"
              placeholder="NEW CATEGORY NAME..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") add(); }}
            />
            <PixelButton onClick={add} className="text-[9px] whitespace-nowrap" style={{ background: "hsl(var(--admin-success))" }}>
              [ + ADD ]
            </PixelButton>
          </div>

          {/* Micro toast */}
          {micro && (
            <div
              className="border-[2px] border-ink p-2 font-pixel text-[9px] text-ink"
              style={{ background: micro.ok ? "hsl(var(--admin-success))" : "hsl(var(--admin-warning))" }}
            >
              {micro.text}
            </div>
          )}

          {/* List */}
          <div className="border-[2px] border-ink max-h-[300px] overflow-auto">
            {cats.length === 0 && (
              <p className="text-center font-pixel text-[10px] text-ink/70 p-6">[ NO CATEGORIES ]</p>
            )}
            {cats.map((c, idx) => {
              const u = usageOf(c.id);
              const usageText = kind === "product" ? `(${u.products} products)` : `(${u.gallery} gallery items)`;
              const isRenaming = renamingId === c.id;
              const isDeleting = deletingId === c.id;
              return (
                <div key={c.id} style={{ background: idx % 2 === 0 ? "#fff" : "#f0f8ff" }}>
                  <div className="flex items-center gap-2 p-2 flex-wrap">
                    {isRenaming ? (
                      <input
                        autoFocus
                        className="pixel-input flex-1 min-w-[140px]"
                        value={renameVal}
                        onChange={(e) => setRenameVal(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") saveRename(); if (e.key === "Escape") setRenamingId(null); }}
                      />
                    ) : (
                      <>
                        <span className="font-body font-bold text-ink flex-1 min-w-0 truncate">{c.name}</span>
                        <span className="font-body text-xs text-ink/60">{usageText}</span>
                      </>
                    )}
                    {isRenaming ? (
                      <div className="flex gap-1">
                        <PixelButton onClick={saveRename} className="text-[8px] py-1" style={{ background: "hsl(var(--admin-success))" }}>[ ✔ SAVE ]</PixelButton>
                        <PixelButton onClick={() => setRenamingId(null)} className="text-[8px] py-1">[ ✖ CANCEL ]</PixelButton>
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        <PixelButton onClick={() => startRename(c)} className="text-[8px] py-1" style={{ background: "hsl(var(--sky-accent))" }}>[ ✏ RENAME ]</PixelButton>
                        <PixelButton onClick={() => setDeletingId(isDeleting ? null : c.id)} className="text-[8px] py-1" style={{ background: "hsl(var(--admin-danger))" }}>[ 🗑 DELETE ]</PixelButton>
                      </div>
                    )}
                  </div>
                  {isDeleting && (
                    <div className="px-3 pb-3 pt-1 border-t-2 border-ink/20">
                      <p className="font-body text-xs" style={{ color: "#a33" }}>
                        Delete '{c.name}'? {usageText.replace(/[()]/g, "")} will become Uncategorized.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <PixelButton onClick={() => confirmDelete(c.id)} className="text-[8px] py-1" style={{ background: "hsl(var(--admin-danger))" }}>[ CONFIRM DELETE ]</PixelButton>
                        <PixelButton onClick={() => setDeletingId(null)} className="text-[8px] py-1">[ CANCEL ]</PixelButton>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <PixelButton onClick={onClose} variant="primary" className="px-8 py-3 text-[11px]">[ DONE ]</PixelButton>
          </div>
        </div>
      </div>
    </div>
  );
}
