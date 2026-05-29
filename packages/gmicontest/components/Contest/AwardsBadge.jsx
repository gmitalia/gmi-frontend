import React, { useState } from "react";
import { getAwardConfigByType, AwardIcons } from "../../src/AwardTypes";
import GMIApi from "../../src/api/GMIApi";

/**
 * AwardBadge - A premium, high-fidelity badge for special contest awards.
 * Shows award image when available, falls back to classic gradient badge.
 */
export const AwardBadge = ({ award, gameId, contestId }) => {
  const name = award.name || award.text || "";
  const type = award.type || 0;
  const [imgFailed, setImgFailed] = useState(false);

  const imageUrl = award.url
    ? `${GMIApi.getInstance().awardsURL}${contestId}/${award.url}`
    : null;

  const Shimmer = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none ds-rounded-cta">
      {/* Primary diagonal streak - bright and fast */}
      <div className="absolute top-0 bottom-0 bg-gradient-to-r from-transparent via-white/10 via-40% to-transparent"
        style={{ width: "25%", animation: "shimmer-prime 2s cubic-bezier(0.4, 0, 0.2, 1) infinite" }} />
      {/* Tertiary ambient sweep - very subtle, fills gaps */}
      <div className="absolute top-0 bottom-0 bg-gradient-to-r from-transparent via-white/[0.06] via-25% to-transparent"
        style={{ width: "80%", animation: "shimmer-ambient 4.5s cubic-bezier(0.4, 0, 0.2, 1) infinite 1.2s" }} />
      {/* Top-down depth gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent opacity-60" />
      {/* Corner accent light */}
      <style>{`
        @keyframes shimmer-prime {
          0% { transform: translateX(-200%); }
          20%, 100% { transform: translateX(500%); }
        }
        @keyframes shimmer-wave {
          0% { transform: translateX(-150%); }
          50%, 100% { transform: translateX(400%); }
        }
        @keyframes shimmer-ambient {
          0% { transform: translateX(-80%); }
          45%, 100% { transform: translateX(380%); }
        }
      `}</style>
    </div>
  );

  const config = getAwardConfigByType(type);
  const showShimmer = config.shimmer === true;

  // Render award image replacing entire badge
  if (imageUrl && !imgFailed) {
    return (
      <div
        className="group relative ds-rounded-cta overflow-hidden transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
        title={name}
      >
        <img
          src={imageUrl}
          alt={name}
          className="w-[280px] h-auto object-cover"
          onError={() => setImgFailed(true)}
        />
        {showShimmer && <Shimmer />}
      </div>
    );
  }

  // Converti classi Tailwind color in stili inline
  const colorMap = {
    "from-rose-500/20": "rgba(244, 63, 94, 0.2)",
    "to-orange-500/20": "rgba(249, 115, 22, 0.2)",
    "from-blue-500/20": "rgba(59, 130, 246, 0.2)",
    "to-indigo-500/20": "rgba(99, 102, 241, 0.2)",
    "from-emerald-500/20": "rgba(16, 185, 129, 0.2)",
    "to-cyan-500/20": "rgba(6, 182, 212, 0.2)",
    "from-amber-500/20": "rgba(245, 158, 11, 0.2)",
    "to-yellow-500/20": "rgba(234, 179, 8, 0.2)",
    "from-purple-500/20": "rgba(168, 85, 247, 0.2)",
    "to-fuchsia-500/20": "rgba(217, 70, 239, 0.2)",
    "from-indigo-500/20": "rgba(99, 102, 241, 0.2)",
    "to-violet-500/20": "rgba(139, 92, 246, 0.2)",
    "from-slate-500/20": "rgba(100, 116, 139, 0.2)",
    "to-gray-500/20": "rgba(107, 114, 128, 0.2)",
    "from-pink-500/20": "rgba(236, 72, 153, 0.2)",
    "to-rose-500/20": "rgba(244, 63, 94, 0.2)",
    "from-teal-500/20": "rgba(20, 184, 166, 0.2)",
    "to-emerald-500/20": "rgba(16, 185, 129, 0.2)",
    "from-orange-500/20": "rgba(249, 115, 22, 0.2)",
    "to-red-500/20": "rgba(239, 68, 68, 0.2)",
    "from-yellow-400/20": "rgba(250, 204, 21, 0.2)",
    "to-amber-500/20": "rgba(245, 158, 11, 0.2)",
    "from-slate-300/20": "rgba(203, 213, 225, 0.2)",
    "to-slate-400/20": "rgba(148, 163, 184, 0.2)",
    "from-orange-600/20": "rgba(234, 88, 12, 0.2)",
    "to-amber-700/20": "rgba(180, 83, 9, 0.2)",
    "from-lime-500/20": "rgba(132, 204, 22, 0.2)",
    "to-green-500/20": "rgba(34, 197, 94, 0.2)",
    "from-sky-500/20": "rgba(14, 165, 233, 0.2)",
    "to-blue-500/20": "rgba(59, 130, 246, 0.2)",
    "from-red-500/20": "rgba(239, 68, 68, 0.2)",
    "to-rose-500/20": "rgba(244, 63, 94, 0.2)",
    "from-violet-500/20": "rgba(139, 92, 246, 0.2)",
    "to-purple-500/20": "rgba(168, 85, 247, 0.2)",
    "from-fuchsia-500/20": "rgba(217, 70, 239, 0.2)",
    "to-pink-500/20": "rgba(236, 72, 153, 0.2)",
    "from-stone-500/20": "rgba(120, 113, 108, 0.2)",
    "to-stone-400/20": "rgba(168, 162, 158, 0.2)",
    "from-cyan-500/20": "rgba(6, 182, 212, 0.2)",
    "to-teal-500/20": "rgba(20, 184, 166, 0.2)",
    "from-cyan-500/20": "rgba(6, 182, 212, 0.2)",
    "to-blue-500/20": "rgba(59, 130, 246, 0.2)"
  };

  const borderColorMap = {
    "border-rose-500/30": "rgba(244, 63, 94, 0.3)",
    "border-blue-500/30": "rgba(59, 130, 246, 0.3)",
    "border-emerald-500/30": "rgba(16, 185, 129, 0.3)",
    "border-amber-500/30": "rgba(245, 158, 11, 0.3)",
    "border-purple-500/30": "rgba(168, 85, 247, 0.3)",
    "border-indigo-500/30": "rgba(99, 102, 241, 0.3)",
    "border-slate-500/30": "rgba(100, 116, 139, 0.3)",
    "border-pink-500/30": "rgba(236, 72, 153, 0.3)",
    "border-teal-500/30": "rgba(20, 184, 166, 0.3)",
    "border-orange-500/30": "rgba(249, 115, 22, 0.3)",
    "border-yellow-400/50": "rgba(250, 204, 21, 0.5)",
    "border-slate-300/50": "rgba(203, 213, 225, 0.5)",
    "border-orange-600/50": "rgba(234, 88, 12, 0.5)",
    "border-lime-500/30": "rgba(132, 204, 22, 0.3)",
    "border-sky-500/30": "rgba(14, 165, 233, 0.3)",
    "border-red-500/30": "rgba(239, 68, 68, 0.3)",
    "border-violet-500/30": "rgba(139, 92, 246, 0.3)",
    "border-fuchsia-500/30": "rgba(217, 70, 239, 0.3)",
    "border-stone-500/30": "rgba(120, 113, 108, 0.3)",
    "border-cyan-500/30": "rgba(6, 182, 212, 0.3)"
  };

  const glowColorMap = {
    "shadow-rose-500/20": "0 4px 6px -1px rgba(244, 63, 94, 0.2), 0 2px 4px -2px rgba(244, 63, 94, 0.2)",
    "shadow-blue-500/20": "0 4px 6px -1px rgba(59, 130, 246, 0.2), 0 2px 4px -2px rgba(59, 130, 246, 0.2)",
    "shadow-emerald-500/20": "0 4px 6px -1px rgba(16, 185, 129, 0.2), 0 2px 4px -2px rgba(16, 185, 129, 0.2)",
    "shadow-amber-500/20": "0 4px 6px -1px rgba(245, 158, 11, 0.2), 0 2px 4px -2px rgba(245, 158, 11, 0.2)",
    "shadow-purple-500/20": "0 4px 6px -1px rgba(168, 85, 247, 0.2), 0 2px 4px -2px rgba(168, 85, 247, 0.2)",
    "shadow-indigo-500/20": "0 4px 6px -1px rgba(99, 102, 241, 0.2), 0 2px 4px -2px rgba(99, 102, 241, 0.2)",
    "shadow-slate-500/20": "0 4px 6px -1px rgba(100, 116, 139, 0.2), 0 2px 4px -2px rgba(100, 116, 139, 0.2)",
    "shadow-pink-500/20": "0 4px 6px -1px rgba(236, 72, 153, 0.2), 0 2px 4px -2px rgba(236, 72, 153, 0.2)",
    "shadow-teal-500/20": "0 4px 6px -1px rgba(20, 184, 166, 0.2), 0 2px 4px -2px rgba(20, 184, 166, 0.2)",
    "shadow-orange-500/20": "0 4px 6px -1px rgba(249, 115, 22, 0.2), 0 2px 4px -2px rgba(249, 115, 22, 0.2)",
    "shadow-yellow-400/30": "0 4px 6px -1px rgba(250, 204, 21, 0.3), 0 2px 4px -2px rgba(250, 204, 21, 0.3)",
    "shadow-slate-300/30": "0 4px 6px -1px rgba(203, 213, 225, 0.3), 0 2px 4px -2px rgba(203, 213, 225, 0.3)",
    "shadow-orange-600/30": "0 4px 6px -1px rgba(234, 88, 12, 0.3), 0 2px 4px -2px rgba(234, 88, 12, 0.3)",
    "shadow-lime-500/20": "0 4px 6px -1px rgba(132, 204, 22, 0.2), 0 2px 4px -2px rgba(132, 204, 22, 0.2)",
    "shadow-sky-500/20": "0 4px 6px -1px rgba(14, 165, 233, 0.2), 0 2px 4px -2px rgba(14, 165, 233, 0.2)",
    "shadow-red-500/20": "0 4px 6px -1px rgba(239, 68, 68, 0.2), 0 2px 4px -2px rgba(239, 68, 68, 0.2)",
    "shadow-violet-500/20": "0 4px 6px -1px rgba(139, 92, 246, 0.2), 0 2px 4px -2px rgba(139, 92, 246, 0.2)",
    "shadow-fuchsia-500/20": "0 4px 6px -1px rgba(217, 70, 239, 0.2), 0 2px 4px -2px rgba(217, 70, 239, 0.2)",
    "shadow-stone-500/20": "0 4px 6px -1px rgba(120, 113, 108, 0.2), 0 2px 4px -2px rgba(120, 113, 108, 0.2)",
    "shadow-cyan-500/20": "0 4px 6px -1px rgba(6, 182, 212, 0.2), 0 2px 4px -2px rgba(6, 182, 212, 0.2)"
  };

  const textColorMap = {
    "text-rose-400": "#fb7185",
    "text-blue-400": "#60a5fa",
    "text-emerald-400": "#34d399",
    "text-amber-400": "#fbbf24",
    "text-purple-400": "#c084fc",
    "text-indigo-400": "#818cf8",
    "text-slate-400": "#94a3b8",
    "text-pink-400": "#f472b6",
    "text-teal-400": "#2dd4bf",
    "text-orange-400": "#fb923c",
    "text-yellow-400": "#facc15",
    "text-slate-300": "#cbd5e1",
    "text-orange-600": "#ea580c",
    "text-lime-400": "#a3e635",
    "text-sky-400": "#38bdf8",
    "text-red-400": "#f87171",
    "text-violet-400": "#a78bfa",
    "text-fuchsia-400": "#e879f9",
    "text-stone-400": "#a8a29e",
    "text-cyan-400": "#22d3ee"
  };

  const colors = config.color.split(" ");
  const fromColor = colorMap[colors[0]] || "rgba(6, 182, 212, 0.2)";
  const toColor = colorMap[colors[1]] || "rgba(59, 130, 246, 0.2)";
  const borderColor = borderColorMap[config.border] || "rgba(6, 182, 212, 0.3)";
  const glowShadow = glowColorMap[config.glow] || glowColorMap["shadow-cyan-500/20"];
  const textColor = textColorMap[config.text] || "#22d3ee";

  return (
    <div
      className="group relative flex items-center gap-3 px-4 py-2 w-[280px] ds-rounded-cta backdrop-blur-md transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-glow border"
      style={{
        background: `linear-gradient(to bottom right, ${fromColor}, ${toColor})`,
        borderColor: borderColor,
        boxShadow: glowShadow
      }}
      title={award.desc || name}
    >
      <div
        className="flex-shrink-0 p-1.5 ds-rounded-sm bg-content/5 border border-default group-hover:scale-110 transition-transform"
        style={{ color: textColor, borderColor: 'var(--ds-color-border)' }}
      >
        {AwardIcons[config.icon] || AwardIcons.trophy}
      </div>

      <div className="flex flex-col">
        <span
          className="text-xs font-black uppercase tracking-widest whitespace-normal break-words leading-tight"
          style={{ color: textColor }}
        >
          {name}
        </span>
      </div>

      {showShimmer && <Shimmer />}

      {/* Subtle internal glow */}
      <div className="absolute inset-0 bg-content/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};
