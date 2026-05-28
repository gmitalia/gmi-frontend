import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import { CloseIcon, InfoIcon } from "./Icons";

/**
 * A beautiful, premium confirmation modal.
 */
export default function ConfirmationModal({ 
	isOpen, 
	title, 
	message, 
	onConfirm, 
	onCancel, 
	confirmText = "Conferma", 
	cancelText = "Annulla", 
	variant = "primary" 
}) {
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
		<div className="fixed inset-0 z-[2000] bg-surface-muted/80 backdrop-blur-md flex items-center justify-center p-4">
			<div className="bg-surface-solid border border-default shadow-2xl rounded-xl max-w-md w-full overflow-hidden flex flex-col gap-4 p-6 animate-in fade-in zoom-in-95 duration-200">
				<div className="flex items-start justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="text-secondary p-2 bg-secondary/10 rounded-lg">
							<InfoIcon size={24} />
						</div>
						<h3 className="text-lg font-bold text-content">{title}</h3>
					</div>
					<Button variant="ghost" size="icon" onClick={onCancel} className="!rounded-full hover:bg-content/5 border-none p-1">
						<CloseIcon size={18} />
					</Button>
				</div>
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
