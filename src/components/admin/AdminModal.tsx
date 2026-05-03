import { ReactNode, useEffect } from "react";

export function AdminModal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-2xl",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[90] grid place-items-center p-4"
      style={{ background: "hsla(224, 42%, 30%, 0.6)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`relative w-full ${maxWidth} bg-card border-[4px] border-ink animate-slide-up-fade`}
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
        <div className="overflow-auto p-5">{children}</div>
      </div>
    </div>
  );
}