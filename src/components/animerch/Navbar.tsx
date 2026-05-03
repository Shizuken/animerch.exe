import { PixelButton } from "./PixelButton";
import { Link } from "react-router-dom";

export type Tab = "home" | "products" | "gallery";

const TABS: { id: Tab; label: string }[] = [
  { id: "home", label: "HOME" },
  { id: "products", label: "PRODUCT LIST" },
  { id: "gallery", label: "GALLERY" },
];

export function Navbar({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b-[4px] border-ink">
      <div className="container flex items-center justify-between gap-4 py-3">
        <button
          onClick={() => onChange("home")}
          className="flex items-center gap-2 font-pixel text-[14px] text-ink hover:text-ink/80"
          aria-label="animerch.exe home"
        >
          <span aria-hidden className="inline-block w-3 h-3 bg-gold border-2 border-ink float-2" />
          animerch.exe
          <span className="cursor-blink">_</span>
        </button>
        <nav className="flex gap-2 sm:gap-3">
          {TABS.map((t) => (
            <PixelButton
              key={t.id}
              variant={tab === t.id ? "active" : "default"}
              onClick={() => onChange(t.id)}
              aria-current={tab === t.id ? "page" : undefined}
              className="text-[8px] sm:text-[10px] px-2 py-2 sm:px-3 sm:py-3"
            >
              {t.label}
            </PixelButton>
          ))}
          <Link to="/admin">
            <PixelButton className="text-[8px] sm:text-[10px] px-2 py-2 sm:px-3 sm:py-3" style={{ background: "hsl(var(--gold))" }}>
              DB
            </PixelButton>
          </Link>
        </nav>
      </div>
    </header>
  );
}