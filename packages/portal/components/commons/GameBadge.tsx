import React from "react";

const GameBadge = ({ placement }) => {
  if (!placement) return null;

  const isPodium = placement <= 3;

  if (isPodium) {
    const config = {
      1: { label: "1°", style: "bg-amber-500 border border-amber-600" },
      2: { label: "2°", style: "bg-slate-500 border border-slate-600" },
      3: { label: "3°", style: "bg-orange-600 border border-orange-700" },
    }[placement];

    return (
      <div className={`inline-flex items-center px-2.5 py-1 rounded-md ${config.style}`}>
        <span className="text-[10px] font-semibold text-white uppercase tracking-tight">
          {config.label}
        </span>
      </div>
    );
  }

  return (
    <div className="inline-block px-2 py-0.5 rounded-md bg-surface border border-default text-[10px] font-semibold text-content-muted">
      #{placement}
    </div>
  );
};

export default GameBadge;
