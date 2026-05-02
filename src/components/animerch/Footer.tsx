export function Footer() {
  return (
    <footer className="relative mt-16 bg-ink text-cloud">
      <div
        aria-hidden
        className="absolute -top-[14px] left-0 right-0 h-[14px]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 100%, #ffffff 0 14px, transparent 15px), radial-gradient(circle at 38% 100%, #ffffff 0 12px, transparent 13px), radial-gradient(circle at 64% 100%, #ffffff 0 14px, transparent 15px), radial-gradient(circle at 88% 100%, #ffffff 0 12px, transparent 13px)",
          backgroundSize: "200px 28px",
          backgroundRepeat: "repeat-x",
        }}
      />
      <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-pixel text-[10px]">© animerch.exe 2026</p>
        <div className="flex gap-3" aria-label="Social links">
          {["X", "IG", "TT"].map((s) => (
            <a
              key={s}
              href="#"
              className="w-8 h-8 grid place-items-center bg-cloud text-ink border-[2px] border-cloud font-pixel text-[8px] hover:bg-blush"
              aria-label={s}
            >
              {s}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}