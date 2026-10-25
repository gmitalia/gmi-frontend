import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CheckIcon, CloseIcon, InfoIcon } from "./Icons";

export type ToastVariant = "success" | "error" | "info";

type ToastProps = {
  message: string;
  variant?: ToastVariant;
  onClose: () => void;
  duration?: number;
};

const VARIANT_STYLES: Record<
  ToastVariant,
  { border: string; icon: string; iconNode: React.ReactNode; role: "status" | "alert" }
> = {
  success: {
    border: "border-success/30 border-l-success",
    icon: "bg-success/10 text-success",
    iconNode: <CheckIcon size={15} />,
    role: "status",
  },
  error: {
    border: "border-error/30 border-l-error",
    icon: "bg-error/10 text-error",
    iconNode: <InfoIcon size={15} />,
    role: "alert",
  },
  info: {
    border: "border-default border-l-secondary",
    icon: "bg-surface-muted text-content-muted",
    iconNode: <InfoIcon size={15} />,
    role: "status",
  },
};

export function Toast({
  message,
  variant = "success",
  onClose,
  duration = 5000,
}: ToastProps) {
  const [mounted, setMounted] = useState(false);
  const onCloseRef = useRef(onClose);
  const styles = VARIANT_STYLES[variant];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!mounted || duration <= 0)
      return;

    const timer = window.setTimeout(() => onCloseRef.current(), duration);
    return () => window.clearTimeout(timer);
  }, [mounted, duration]);

  if (!mounted)
    return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[3000] flex justify-center px-4 sm:bottom-6 sm:left-auto sm:right-6 sm:justify-end sm:px-0">
      <div
        role={styles.role}
        aria-live={variant === "error" ? "assertive" : "polite"}
        className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 border border-l-[3px] bg-surface-solid p-3.5 shadow-lg ${styles.border}`}
      >
        <span
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center ${styles.icon}`}
        >
          {styles.iconNode}
        </span>

        <p className="min-w-0 flex-1 break-words text-sm font-medium leading-snug text-content">
          {message}
        </p>

        <button
          type="button"
          onClick={onClose}
          aria-label="Chiudi notifica"
          className="shrink-0 p-0.5 text-content-muted transition-colors hover:bg-content/5 hover:text-content"
        >
          <CloseIcon size={14} />
        </button>
      </div>
    </div>,
    document.body
  );
}
