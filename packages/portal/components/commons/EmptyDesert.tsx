import type { ReactNode } from "react";

type EmptyDesertProps = {
  children: ReactNode;
  className?: string;
  /** Colore CSS dell'illustrazione; se omesso usa il default del foglio di stile. */
  iconColor?: string;
};

/** Empty state condiviso: illustrazione deserta e messaggio contestuale. */
export function EmptyDesert({
  children,
  className = "",
  iconColor,
}: EmptyDesertProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 border border-dashed border-default bg-surface-muted/30 px-6 py-10 text-center ${className}`}
    >
      <span
        aria-hidden="true"
        className="empty-desert-icon block h-16 w-16 shrink-0"
        style={iconColor ? { backgroundColor: iconColor } : undefined}
      />
      <p className="max-w-md text-sm leading-6 text-content-muted">
        {children}
      </p>
    </div>
  );
}

export default EmptyDesert;
