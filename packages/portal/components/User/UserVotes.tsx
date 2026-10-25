import ContestCard from "../Competition/ContestCard";
import { EmptyState } from "../commons/EmptyState";

export default function UserVotes(props) {
  /**@type {UserInfo} */
  const userInfo = props.userInfo;
  const contests = props.contests || [];

  // Map contest ID to contest object for quick lookup
  const contestMap = {};
  contests.forEach((contest) => {
    contestMap[contest.id] = contest;
  });

  if (userInfo.votes == undefined || userInfo.votes.length == 0) return null;

  const judgedContests = userInfo.votes
    .map((vote) => Number(vote.contest_id))
    .filter((id, index, ids) => !Number.isNaN(id) && ids.indexOf(id) === index)
    .map((contestId) => contestMap[contestId])
    .filter(Boolean)
    .sort((a, b) => Number(b.id) - Number(a.id));

  return (
    <section className="ds-card-section">
      <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-content">
        Giudizi
        {judgedContests.length > 0 && (
          <span className="text-lg text-content-muted">
            ({judgedContests.length})
          </span>
        )}
      </h2>

      {contests.length === 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
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
      ) : judgedContests.length === 0 ? (
        <EmptyState>Non ci sono giudizi pubblici.</EmptyState>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {judgedContests.map((contest) => (
            <ContestCard key={contest.id} contest={contest} />
          ))}
        </div>
      )}
    </section>
  );
}
