import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary" | "active";
};

export const PixelButton = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "default", ...rest }, ref) => (
    <button
      ref={ref}
      className={cn(
        "pixel-btn",
        variant === "primary" && "pixel-btn-primary",
        variant === "active" && "pixel-btn-active",
        className,
      )}
      {...rest}
    />
  ),
);
PixelButton.displayName = "PixelButton";