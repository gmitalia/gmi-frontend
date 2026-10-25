import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button, type ButtonVariant } from "./Button";

/**
 * A simple confirmation modal.
 */
type ConfirmationModalProps = {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: ButtonVariant;
};

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Conferma",
  cancelText = "Annulla",
  variant = "primary",
}: ConfirmationModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[2000] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-surface-solid border border-default rounded-md max-w-md w-full overflow-hidden flex flex-col gap-4 p-6">
        <h3 className="text-lg font-bold text-content">{title}</h3>
        <div className="text-content-muted text-sm leading-relaxed">
          {message}
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="secondary" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
