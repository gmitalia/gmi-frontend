import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import { CloseIcon } from "./Icons";

/**
 * A full-screen interactive image viewer with zoom and pan capabilities.
 * @param {Object} props
 * @param {string} props.src - The source URL of the image.
 * @param {string} props.alt - Alternative text for the image.
 * @param {Function} props.onClose - Callback function to close the modal.
 */
export default function ImageModal({ src, alt, onClose }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(scale * delta, 1), 5);
    setScale(newScale);
    if (newScale === 1) setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  if (!mounted) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[1000] bg-primary backdrop-blur-2xl flex items-center justify-center overflow-hidden touch-none"
      onWheel={handleWheel}
      onClick={onClose}
    >
      {/* Controls & Info */}
      <div className="absolute top-6 right-6 flex items-center gap-4 z-[1010]">
        <div className="hidden md:block px-4 py-2 bg-content/5 border-default rounded-full text-xs font-bold text-content-muted backdrop-blur-md">
          Rotella per zoom • Trascina per spostare
        </div>
        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onClose(); }} className="!rounded-full !bg-content/10 hover:!bg-error/20 hover:!text-error !border-default !backdrop-blur-md !shadow-xl">
          <CloseIcon size={24} strokeWidth="2.5" />
        </Button>
      </div>

      {/* Image Container */}
      <div 
        className={`relative select-none ${scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
        style={{ 
          transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img 
          src={src} 
          alt={alt} 
          className="max-w-[90vw] max-h-[90vh] object-contain shadow-2xl rounded-lg border-default pointer-events-none"
          draggable={false}
        />
      </div>

      {/* Zoom Indicator */}
      {scale > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1 bg-secondary/20 border border-secondary/30 rounded-full text-[10px] font-black text-secondary uppercase tracking-widest backdrop-blur-md">
          Zoom: {scale.toFixed(1)}x
        </div>
      )}
    </div>,
    document.body
  );
}
