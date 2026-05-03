import { PixelButton } from "@/components/animerch/PixelButton";
import { AdminModal } from "./AdminModal";

export function ConfirmDeleteModal({
  open, onClose, onConfirm, title, name, image, emoji, bg,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  name: string;
  image?: string;
  emoji?: string;
  bg?: string;
}) {
  return (
    <AdminModal open={open} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="text-center space-y-4">
        <div className="mx-auto w-24 h-24 border-[3px] border-ink grid place-items-center text-4xl" style={{ background: bg || "#ddf0ff" }}>
          {image ? <img src={image} alt={name} className="w-full h-full object-cover" /> : <span>{emoji || "🎁"}</span>}
        </div>
        <p className="font-pixel text-[10px] text-ink">{name}</p>
        <p className="font-body text-sm text-ink/80">This action cannot be undone.</p>
        <div className="flex gap-3 justify-center pt-2">
          <PixelButton onClick={onClose}>[ CANCEL ]</PixelButton>
          <PixelButton onClick={onConfirm} style={{ background: "hsl(var(--admin-danger))" }}>
            [ YES, DELETE ]
          </PixelButton>
        </div>
      </div>
    </AdminModal>
  );
}