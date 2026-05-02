import { ReactNode } from "react";
import { PixelButton } from "./PixelButton";

export function FilterPanel({
  title = "[ FILTER ]",
  onApply,
  children,
}: {
  title?: string;
  onApply: () => void;
  children: ReactNode;
}) {
  return (
    <aside className="pixel-box bg-cloud p-4 md:sticky md:top-24 self-start w-full md:w-[240px] flex-shrink-0">
      <h3 className="font-pixel text-[10px] text-ink mb-4">{title}</h3>
      <div className="space-y-5">{children}</div>
      <div className="mt-5">
        <PixelButton variant="primary" onClick={onApply} className="w-full">
          [ APPLY ]
        </PixelButton>
      </div>
    </aside>
  );
}