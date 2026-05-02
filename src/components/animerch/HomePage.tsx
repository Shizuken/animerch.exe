import { CloudIsland } from "./CloudIsland";
import { PixelButton } from "./PixelButton";
import { ProductCard } from "./ProductCard";
import { PRODUCTS, Product } from "@/data/animerch";

export function HomePage({
  onEnterShop,
  onPick,
}: {
  onEnterShop: () => void;
  onPick: (p: Product) => void;
}) {
  const featured = PRODUCTS.slice(0, 3);
  return (
    <section className="relative">
      <div className="container py-12 md:py-20 text-center relative">
        {/* Twinkling pixels */}
        {[
          { t: 40, l: 8 }, { t: 20, l: 80 }, { t: 60, l: 20 }, { t: 90, l: 70 },
        ].map((s, i) => (
          <span
            key={i}
            className="absolute w-2 h-2 bg-white twinkle pointer-events-none"
            style={{ top: `${s.t}px`, left: `${s.l}%`, animationDelay: `${i * 0.4}s` }}
          />
        ))}

        <div className="float-2 mx-auto mb-6 w-[280px] sm:w-[360px]">
          <CloudIsland className="w-full h-auto" />
        </div>

        <h1 className="font-pixel text-2xl sm:text-4xl text-ink leading-tight">
          animerch.exe<span className="cursor-blink">_</span>
        </h1>
        <p className="mt-4 font-body text-base sm:text-lg text-ink/80 max-w-xl mx-auto">
          Your favorite anime gear, delivered with love ✨
        </p>

        <div className="mt-8">
          <PixelButton variant="primary" onClick={onEnterShop} className="text-[12px] sm:text-[14px] px-6 py-4">
            ENTER SHOP →
          </PixelButton>
        </div>
      </div>

      <div className="container pb-16">
        <h2 className="font-pixel text-xs sm:text-sm text-center text-ink mb-6">[ FEATURED ITEMS ]</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} onClick={() => onPick(p)} />
          ))}
        </div>
      </div>
    </section>
  );
}