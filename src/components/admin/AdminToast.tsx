import { useEffect, useState } from "react";

export type ToastVariant = "success" | "warning" | "danger";
export type ToastItem = { id: number; text: string; variant: ToastVariant };

let counter = 1;
const listeners = new Set<(t: ToastItem) => void>();

export function pushToast(text: string, variant: ToastVariant = "success") {
  const t = { id: counter++, text, variant };
  listeners.forEach((l) => l(t));
}

const BG: Record<ToastVariant, string> = {
  success: "hsl(var(--admin-success))",
  warning: "hsl(var(--admin-warning))",
  danger: "hsl(var(--admin-danger))",
};

export function ToastHost() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const l = (t: ToastItem) => {
      setItems((x) => [...x, t]);
      setTimeout(() => setItems((x) => x.filter((i) => i.id !== t.id)), 2200);
    };
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-xs">
      {items.map((t) => (
        <div
          key={t.id}
          className="border-[3px] border-ink p-3 font-pixel text-[10px] text-ink relative overflow-hidden"
          style={{ background: BG[t.variant], boxShadow: "4px 4px 0 0 hsl(var(--ink))" }}
        >
          <div className="flex items-start gap-2">
            <span className="flex-1">{t.text}</span>
            <button
              onClick={() => setItems((x) => x.filter((i) => i.id !== t.id))}
              className="font-pixel text-[10px]"
              aria-label="Dismiss"
            >X</button>
          </div>
          <div
            className="absolute left-0 bottom-0 h-1 bg-ink"
            style={{ animation: "toast-bar 2s linear forwards", width: "100%" }}
          />
          <style>{`@keyframes toast-bar { from { width: 100% } to { width: 0% } }`}</style>
        </div>
      ))}
    </div>
  );
}