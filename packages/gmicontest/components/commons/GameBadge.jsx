import React from "react";
import { TrophyIcon } from "./Icons";

const GameBadge = ({ placement }) => {
  if (!placement) return null;

  const isPodium = placement <= 3;

  if (isPodium) {
    const config = {
      1: { label: "1°", style: "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 border border-amber-200/50 shadow-lg shadow-amber-500/40" },
      2: { label: "2°", style: "bg-gradient-to-r from-slate-500 via-slate-500 to-slate-600 border border-slate-100/50 shadow-lg shadow-slate-400/40" },
      3: { label: "3°", style: "bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600 border border-orange-300/50 shadow-lg shadow-orange-500/40" },
    }[placement];

    return (
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.style}`}>
        <span className="text-white">
          <TrophyIcon size={14} strokeWidth="3" />
        </span>
        <span className="text-[10px] font-black text-white uppercase tracking-tight drop-shadow-sm">
          {config.label}
        </span>
      </div>
    );
  }

  return (
    <div className={`px-2 py-0.5 rounded bg-primary backdrop-blur-md border border-default text-[10px] font-bold text-content/80 shadow-xl`}>
      #{placement}
    </div>
  );
};

export default GameBadge;
