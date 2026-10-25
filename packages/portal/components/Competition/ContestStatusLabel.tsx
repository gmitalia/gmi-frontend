import { getContestStatus, type ContestStatus } from "../../src/contestStatus";

const STATUS_CONFIG: Record<
  ContestStatus,
  { label: string; accent: string }
> = {
  open: {
    label: "In corso",
    accent: "border-l-success",
  },
  judging: {
    label: "In giudizio",
    accent: "border-l-warning",
  },
  complete: {
    label: "Conclusa",
    accent: "border-l-gray-400",
  },
};

type ContestStatusLabelProps = {
  contest?: Contest;
  status?: ContestStatus;
  className?: string;
};

/** Stato leggibile di una competizione, coerente in tutta la sezione. */
export function ContestStatusLabel({
  contest,
  status,
  className = "",
}: ContestStatusLabelProps) {
  const resolved = status ?? (contest ? getContestStatus(contest) : "complete");
  const config = STATUS_CONFIG[resolved];

  return (
    <span
      className={`inline-flex items-center border border-l-[3px] border-gray-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold uppercase leading-none tracking-[0.18em] text-gray-800 ${config.accent} ${className}`}
    >
      {config.label}
    </span>
  );
}

export default ContestStatusLabel;
