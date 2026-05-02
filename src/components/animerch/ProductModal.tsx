import { useEffect } from "react";
import { Product } from "@/data/animerch";
import { PixelButton } from "./PixelButton";

export function ProductModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  if (!product) return null;
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4"
      style={{ background: "hsla(224, 42%, 30%, 0.6)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div
        className="pixel-box-lg relative w-full max-w-3xl bg-card animate-slide-up-fade"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pixel corner decorations */}
        {(["tl","tr","bl","br"] as const).map((c) => (
          <span
            key={c}
            aria-hidden
            className="absolute font-pixel text-gold text-xs"
            style={{
              top: c.startsWith("t") ? 6 : undefined,
              bottom: c.startsWith("b") ? 6 : undefined,
              left: c.endsWith("l") ? 8 : undefined,
              right: c.endsWith("r") ? 8 : undefined,
            }}
          >◆</span>
        ))}

        <button
          onClick={onClose}
          className="pixel-btn absolute -top-3 -right-3 !p-0 w-9 h-9"
          aria-label="Close"
        >
          X
        </button>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          <div
            className="aspect-square border-[3px] border-ink relative grid place-items-center"
            style={{ background: product.imageBg }}
          >
            <div className="text-[8rem] select-none">{product.emoji}</div>
            <span className="absolute bottom-2 right-2 font-pixel text-[8px] bg-white border-2 border-ink px-2 py-1">🔍 ZOOM</span>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-pixel text-[10px] text-ink/70">[ ITEM INFO ]</p>
            <h2 className="font-pixel text-base text-ink leading-snug">{product.name}</h2>
            <p className="font-body font-extrabold text-2xl text-ink">¥ {product.price.toLocaleString()}</p>
            <div className="pixel-divider" />
            <ul className="font-body text-sm text-ink space-y-1">
              <li>📐 {product.dims.l} × {product.dims.w} × {product.dims.h} cm</li>
              <li>⚖️ {product.weight} g</li>
              <li>🏷️ {product.category}</li>
            </ul>
            <div className="pixel-divider" />
            <p className="font-body text-sm text-ink/80 max-h-32 overflow-auto pr-2">
              {product.description}
            </p>
            <div className="mt-2">
              <a href={product.buyUrl} target="_blank" rel="noopener noreferrer">
                <PixelButton variant="primary" className="w-full text-[12px] py-4">
                  BUY NOW →
                </PixelButton>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}