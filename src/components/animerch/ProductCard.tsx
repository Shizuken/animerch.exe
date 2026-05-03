import { Product, formatIDR } from "@/data/animerch";
import { categoryName, useAnimerchStore } from "@/store/animerchStore";

export function ProductCard({ product, onClick }: { product: Product; onClick?: () => void }) {
  const cats = useAnimerchStore((s) => s.productCategories);
  const cat = categoryName(cats, product.category_id);
  return (
    <button
      type="button"
      onClick={onClick}
      className="pixel-card text-left p-0 flex flex-col w-full"
      aria-label={`Open ${product.name}`}
    >
      <div className="relative w-full aspect-square border-b-[3px] border-ink overflow-hidden" style={{ background: product.imageBg }}>
        {product.image
          ? <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
          : <div className="absolute inset-0 grid place-items-center text-6xl select-none">{product.emoji}</div>}
        {product.badge && (
          <span className="absolute top-2 right-2 font-pixel text-[8px] bg-gold text-ink border-2 border-ink px-2 py-1">
            {product.badge}
          </span>
        )}
        <span className="absolute top-3 left-3 w-2 h-2 bg-white twinkle" />
        <span className="absolute bottom-4 right-6 w-2 h-2 bg-white twinkle" style={{ animationDelay: "1s" }} />
      </div>
      <div className="p-3 flex flex-col gap-1 bg-card">
        <p className="font-pixel text-[8px] leading-snug text-ink">{product.name}</p>
        <p className="font-body text-xs text-ink/60">{cat}</p>
        <p className="font-body font-bold text-ink text-base">{formatIDR(product.price)}</p>
      </div>
    </button>
  );
}
