import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getQuery } from "../src/Utils";
import { Button } from "./commons/Button";
import GMIApi from "../src/api/GMIApi";
import { SectionLayout } from "./WebsiteLayout/SectionLayout";
import { basePath, competitionsPath } from "../src/paths";
import { competitionsBreadcrumb, homeBreadcrumb } from "../src/breadcrumbs";
import UserInventory from "./User/UserInventory";
import UserStats from "./User/UserStats";
import UserGames from "./User/UserGames";
import moment from "moment";
import UserVotes from "./User/UserVotes";
import ContestHeroBackground from "./Contest/ContestHeroBackground";

const UserHeroSkeleton = () => (
  <section
    aria-busy="true"
    className="contest-hero relative mb-8 overflow-hidden text-gray-100"
  >
    <ContestHeroBackground />

    <div className="relative mx-auto w-full max-w-7xl px-5 py-10 md:py-12">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="h-24 w-24 shrink-0 animate-pulse rounded-full bg-white/10 md:h-32 md:w-32" />
          <div className="w-full max-w-md space-y-4">
            <div className="h-9 w-56 animate-pulse bg-white/10 md:h-12" />
            <div className="flex gap-2">
              <div className="h-6 w-24 animate-pulse bg-white/10" />
              <div className="h-6 w-28 animate-pulse bg-white/10" />
            </div>
          </div>
        </div>

        <div className="min-w-0 shrink-0">
          <div className="h-3 w-24 animate-pulse bg-white/10" />
          <div className="mt-3 flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex h-11 w-11 items-center justify-center"
              >
                <div className="h-10 w-10 animate-pulse bg-white/10" />
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-baseline gap-x-5 gap-y-2 sm:gap-x-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-baseline gap-1.5">
                <div className="h-4 w-6 animate-pulse bg-white/10" />
                <div className="h-3 w-16 animate-pulse bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default function PageUser(props) {
  let router = useRouter();
  let query = getQuery(router);

  let userInfo = useSelector((root: import("../src/store").RootState) => root.auth.userInfo);

  /**@type {[UserInfo, (obj: UserInfo)=> any]} */
  let [user, setUser] = useState<UserInfo | null>(null);
  let [error, setError] = useState<string>();
  let [isHistorical, setIsHistorical] = useState(false);
  let [contests, setContests] = useState([]);

  let [editName, setEditName] = useState(false);
  let [name, setName] = useState("");

  const isOwnProfile = userInfo?.user?.user_id == user?.user_id;

  const handleSaveName = () => {
    if (name.trim() === "") return;
    if (name !== user.user_name) {
      GMIApi.getInstance().setUserValues(user.user_id, name, data => {
        if (data.success) {
          setUser({ ...user, user_name: name });
          setEditName(false);
        }
      });
    } else {
      setEditName(false);
    }
  }

  const handleCancelEdit = () => {
    setName(user.user_name);
    setEditName(false);
  }

  useEffect(() => {
    // 1. Fetch User Info
    GMIApi.getInstance().getUserInfo(query.user, (data) => {
      if (data.success) {
        let rawUser = data.users[0];
        let user = { ...rawUser };
        if (rawUser.games) {
          user.games = JSON.parse(rawUser.games).filter(o => o.contest_id != null)
        }
        if (rawUser.votes)
          user.votes = JSON.parse(rawUser.votes)
        setUser(user);
        setName(user.user_name);

        // 2. Fetch All Contests (Centralized)
        GMIApi.getInstance().getContests(contestData => {
          if (contestData.success && contestData.contests) {
            setContests(contestData.contests);

            // Seniority check using the centralized contests
            const contestDates = {};
            contestData.contests.forEach(c => {
              contestDates[c.id] = c.completed_at;
            });

            const hasOldGame = (user.games || []).some(game => {
              const date = contestDates[game.contest_id];
              return date && moment().diff(moment(date), 'years') >= 10;
            });

            const hasOldJudgeVote = (user.votes || []).some(vote => {
              const contestId = vote.contest_id;
              if (!contestId) return false;
              const date = contestDates[contestId];
              return date && moment().diff(moment(date), 'years') >= 10;
            });

            if (hasOldGame || hasOldJudgeVote) {
              setIsHistorical(true);
            } else {
              // Fallback: check medals if no old games found
              GMIApi.getInstance().getUserMedals(user.user_id, medalData => {
                if (medalData.success && medalData.medals) {
                  const allMedals = [
                    ...(medalData.medals.gold_trophy || []),
                    ...(medalData.medals.silver_trophy || []),
                    ...(medalData.medals.bronze_trophy || [])
                  ];
                  const hasOldMedal = allMedals.some(medal => {
                    if (!medal.completed_at) return false;
                    return moment().diff(moment(medal.completed_at), 'years') >= 10;
                  });
                  if (hasOldMedal) setIsHistorical(true);
                }
              });
            }
          }
        });
      } else {
        setError(data.error || "Utente non trovato");
      }
    });
  }, [query.user]);

  if (error) {
    return (
      <SectionLayout>
        <div className="pt-8">
          <div className="border border-error/20 bg-error/10 p-8 text-center text-error">
            <p className="text-xl font-bold mb-2">Ops!</p>
            <p>{error}</p>
          </div>
        </div>
      </SectionLayout>
    );
  }

  if (!user) {
    return (
      <SectionLayout hero={<UserHeroSkeleton />}>
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-thick border-secondary/30 border-t-secondary" />
          <p className="animate-pulse font-medium text-content-muted">Caricamento profilo...</p>
        </div>
      </SectionLayout>
    );
  }

  return (
    <SectionLayout
      hero={
        <section className="contest-hero relative mb-8 overflow-hidden text-gray-100">
          <ContestHeroBackground />

          <div className="relative mx-auto w-full max-w-7xl px-5 py-10 md:py-12">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex gap-6 flex-row sm:items-center">
                <img
                  className="h-24 w-24 shrink-0 rounded-full border border-white/20 object-cover md:h-32 md:w-32"
                  src={user.user_avatar ?? basePath + "/img/profile.png"}
                  alt={user.user_name}
                />

                <div className="min-w-0">
                  {editName ? (
                    <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
                      <input
                        type="text"
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveName();
                          if (e.key === "Escape") handleCancelEdit();
                        }}
                        className="w-full border border-white/20 bg-white/10 px-3 py-2 text-lg font-semibold text-white outline-none transition-colors placeholder:text-gray-500 focus:border-white/50"
                      />
                      <div className="flex shrink-0 gap-2">
                        <Button variant="light" size="sm" onClick={handleSaveName}>Salva</Button>
                        <Button variant="outlineLight" size="sm" onClick={handleCancelEdit}>Annulla</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                        {user.user_name}
                      </h1>
                      {isOwnProfile && (
                        <Button variant="outlineLight" size="sm" onClick={() => setEditName(true)}>
                          Modifica
                        </Button>
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {!isHistorical &&(<span className="border border-white/15 bg-white/[0.04] px-2.5 py-1.5 text-[10px] font-semibold uppercase leading-none tracking-[0.18em] text-gray-300">
                      Utente GMI
                    </span>
                    )}
                    {isHistorical && (
                      <span className="border border-white/15 border-l-[3px] border-l-[#FBC147] bg-white/[0.04] px-2.5 py-1.5 text-[10px] font-semibold uppercase leading-none tracking-[0.18em] text-gray-300">
                        Membro storico
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="min-w-0 shrink-0">
                <UserInventory user={query.user} variant="hero" />
                <UserStats userInfo={user} variant="hero" />
              </div>
            </div>
          </div>
        </section>
      }
      breadcrumbs={[
        homeBreadcrumb,
        competitionsBreadcrumb,
        { label: "Partecipanti", href: competitionsPath("/users/") },
        { label: user.user_name },
      ]}
    >
      <div className="flex w-full flex-col gap-8 pb-12">
        <UserGames userInfo={user} contests={contests} />
        <UserVotes userInfo={user} contests={contests} />
      </div>
    </SectionLayout>
  );
}
