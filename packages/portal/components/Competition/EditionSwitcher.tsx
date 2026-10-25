import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import GMIApi from "../../src/api/GMIApi";

type EditionSwitcherProps = {
  contestId?: string | number;
  className?: string;
};

/**
 * Selettore dell'edizione nelle pagine di dettaglio. Sostituisce la vecchia
 * sidebar: resta sempre a portata di mano senza occupare spazio fisso.
 */
export function EditionSwitcher({ contestId, className = "" }: EditionSwitcherProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [contests, setContests] = useState<Contest[]>([]);

  useEffect(() => {
    setMounted(true);

    GMIApi.getInstance().getContests((data) => {
      if (data?.success) setContests(data.contests || []);
    });
  }, []);

  const options = useMemo(() => {
    return [...contests].sort((a, b) => Number(b.id) - Number(a.id));
  }, [contests]);

  const hasCurrent = options.some(
    (contest) => String(contest.id) === String(contestId)
  );

  // Il primo render deve combaciare tra server e client: le opzioni vengono
  // mostrate solo dopo il mount.
  const selectedValue = mounted && contestId ? String(contestId) : "";

  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
        Competizione
      </span>
      <select
        value={selectedValue}
        onChange={(event) => {
          const value = event.target.value;
          if (!value) return;

          router.push({
            pathname: router.pathname,
            query: { ...router.query, contest: value },
          });
        }}
        className="h-10 min-w-[220px] border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition-colors focus:border-gray-400"
        aria-label="Seleziona competizione"
      >
        <option value="">Seleziona competizione</option>
        {mounted && contestId && !hasCurrent && (
          <option value={String(contestId)}>Competizione corrente</option>
        )}
        {mounted &&
          options.map((contest) => (
            <option key={contest.id} value={contest.id}>
              {contest.name}
            </option>
          ))}
      </select>
    </label>
  );
}

export default EditionSwitcher;
