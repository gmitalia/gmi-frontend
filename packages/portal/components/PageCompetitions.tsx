import { useEffect, useMemo, useState } from "react";
import GMIApi from "../src/api/GMIApi";
import { competitionTabs } from "../src/competitionSections";
import { getContestStatus } from "../src/contestStatus";
import ContestCard from "./Competition/ContestCard";
import { SectionLayout } from "./WebsiteLayout/SectionLayout";

const CARD_GRID =
  "grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-6 lg:grid-cols-3";

export default function PageCompetitions() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GMIApi.getInstance().getContests((data) => {
      if (data?.success) setContests(data.contests || []);
      setLoading(false);
    });
  }, []);

  const sortedContests = useMemo(
    () => [...contests].sort((a, b) => Number(b.id) - Number(a.id)),
    [contests]
  );

  const activeContests = useMemo(
    () =>
      sortedContests.filter(
        (contest) => getContestStatus(contest) !== "complete"
      ),
    [sortedContests]
  );

  const openContests = activeContests.filter(
    (contest) => getContestStatus(contest) === "open"
  );

  const archive = useMemo(
    () =>
      sortedContests.filter(
        (contest) => getContestStatus(contest) === "complete"
      ),
    [sortedContests]
  );

  return (
    <SectionLayout
      title="Competizioni"
      description="Tutte le competizioni di GameMaker Italia: competizioni annuali, game jam e archivio storico."
      tabs={competitionTabs}
    >
      {loading ? (
        <div className={CARD_GRID}>
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="animate-pulse overflow-hidden border border-gray-200 bg-white"
            >
              <div className="aspect-video bg-gray-200" />
              <div className="space-y-3 p-5">
                <div className="h-3 w-20 bg-gray-200" />
                <div className="h-5 w-2/3 bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      ) : sortedContests.length === 0 ? (
        <div className="border border-gray-200 bg-white p-10 text-center">
          <p className="text-gray-500">
            Non ci sono ancora competizioni pubblicate.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          {activeContests.length > 0 && (
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-medium text-gray-900">In corso</h2>
              </div>
              <div className={CARD_GRID}>
                {activeContests.map((contest) => (
                  <ContestCard
                    key={contest.id}
                    contest={contest}
                    showAction
                  />
                ))}
              </div>
            </section>
          )}

          {archive.length > 0 && (
            <section>
              <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Completate
                  </h2>
                </div>
                <span className="text-xs text-gray-400">
                  {archive.length}{" "}
                  {archive.length === 1 ? "competizione" : "competizioni"}
                </span>
              </div>

              <div className={CARD_GRID}>
                {archive.map((contest) => (
                  <ContestCard key={contest.id} contest={contest} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </SectionLayout>
  );
}
