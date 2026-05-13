import React from "react";

const VARIANT_MAP = {
  complete: { label: "Conclusa", chipClass: "ds-chip ds-chip-complete" },
  judging: { label: "In giudizio", chipClass: "ds-chip ds-chip-judging" },
  open: { label: "In corso", chipClass: "ds-chip ds-chip-open" },
};

export const ContestStatusBadge = ({ variant, className = "" }) => {
  const config = VARIANT_MAP[variant];
  if (!config) return null;

  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${config.chipClass} ${className}`}>
      {config.label}
    </span>
  );
};

export default ContestStatusBadge;
