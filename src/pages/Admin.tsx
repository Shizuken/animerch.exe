import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/animerch/Footer";
import { PixelButton } from "@/components/animerch/PixelButton";
import { HomeDB } from "@/components/admin/HomeDB";
import { ProductListDB } from "@/components/admin/ProductListDB";
import { GalleryDB } from "@/components/admin/GalleryDB";
import { ToastHost } from "@/components/admin/AdminToast";
import { supabase } from "@/integrations/supabase/client";

type DBTab = "home" | "products" | "gallery";
const TABS: { id: DBTab; label: string }[] = [
  { id: "home", label: "HOME DB" },
  { id: "products", label: "PRODUCT LIST DB" },
  { id: "gallery", label: "GALLERY DB" },
];

export default function Admin() {
  const [tab, setTab] = useState<DBTab>("home");

  useEffect(() => {
    document.title = "Database — animerch.exe";
  }, []);

  return (
    <div className="min-h-screen flex flex-col cloud-sky">
      {/* Admin navbar */}
      <header className="sticky top-0 z-40 w-full bg-white border-b-[4px] border-ink">
        <div className="container flex items-center justify-between gap-4 py-3 flex-wrap">
          <Link to="/" className="flex items-center gap-2 font-pixel text-[14px] text-ink">
            <span aria-hidden className="inline-block w-3 h-3 bg-gold border-2 border-ink float-2" />
            animerch.exe
            <span className="font-pixel text-[8px] bg-gold border-2 border-ink px-2 py-1 ml-1">ADMIN</span>
          </Link>
          <Link to="/">
            <PixelButton className="text-[8px] sm:text-[10px]">← BACK TO SITE</PixelButton>
          </Link>
          <PixelButton
            className="text-[8px] sm:text-[10px]"
            onClick={async () => { await supabase.auth.signOut(); window.location.href = "/auth"; }}
          >
            SIGN OUT
          </PixelButton>
        </div>
      </header>

      {/* Title bar */}
      <div className="container pt-6">
        <div className="admin-titlebar flex items-center justify-between">
          <span>[ ANIMERCH.EXE // DATABASE v1.0 ]</span>
          <span className="cursor-blink">_</span>
        </div>
      </div>

      {/* Folder tabs */}
      <div className="container pt-6">
        <div className="flex gap-1 px-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              data-active={tab === t.id}
              className="admin-tab"
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 container pb-12">
        <div>
          {tab === "home" && <HomeDB />}
          {tab === "products" && <ProductListDB />}
          {tab === "gallery" && <GalleryDB />}
        </div>
      </main>

      <div className="pixel-grass" aria-hidden />
      <Footer />
      <ToastHost />
    </div>
  );
}