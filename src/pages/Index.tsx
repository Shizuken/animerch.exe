import { useEffect, useState } from "react";
import { Navbar, Tab } from "@/components/animerch/Navbar";
import { Footer } from "@/components/animerch/Footer";
import { HomePage } from "@/components/animerch/HomePage";
import { ProductsPage } from "@/components/animerch/ProductsPage";
import { GalleryPage } from "@/components/animerch/GalleryPage";
import { ProductModal } from "@/components/animerch/ProductModal";
import { Product } from "@/data/animerch";

const TITLES: Record<Tab, string> = {
  home: "animerch.exe — kawaii cloudcore anime merch shop",
  products: "Products — animerch.exe",
  gallery: "Gallery — animerch.exe",
};

const Index = () => {
  const [tab, setTab] = useState<Tab>("home");
  const [picked, setPicked] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = TITLES[tab];
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(t);
  }, [tab]);

  return (
    <div className="min-h-screen flex flex-col cloud-sky">
      <Navbar tab={tab} onChange={setTab} />

      <main className="flex-1 relative">
        {loading ? (
          <div className="container py-32 text-center">
            <p className="font-pixel text-sm text-ink cursor-blink">LOADING…</p>
          </div>
        ) : (
          <>
            {tab === "home" && (
              <HomePage onEnterShop={() => setTab("products")} onPick={setPicked} />
            )}
            {tab === "products" && <ProductsPage onPick={setPicked} />}
            {tab === "gallery" && <GalleryPage />}
          </>
        )}
      </main>

      <div className="pixel-grass" aria-hidden />
      <Footer />

      <ProductModal product={picked} onClose={() => setPicked(null)} />
    </div>
  );
};

export default Index;
