import type { ReactNode } from "react";

type EmptyStateProps = {
  children: ReactNode;
  className?: string;
};

/** Empty state condiviso: illustrazione deserta e messaggio contestuale. */
export function EmptyState({ children, className = "" }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 border border-dashed border-default bg-surface-muted/30 px-6 py-10 text-center ${className}`}
    >
      <img
        src="/images/empty_state.svg"
        alt=""
        aria-hidden="true"
        className="h-14 w-14 shrink-0 object-contain"
        loading="lazy"
      />
      <p className="max-w-md text-sm leading-6 text-content-muted">
        {children}
      </p>
    </div>
  );
}

export default EmptyState;
