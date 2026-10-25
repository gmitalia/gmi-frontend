import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../src/store";
import { basePath, competitionsPath } from "../src/paths";
import { competitionsBreadcrumb, homeBreadcrumb } from "../src/breadcrumbs";
import GMIApi from "../src/api/GMIApi";
import { ParticipantType } from "../src/Constants";
import { getQuery } from "../src/Utils";
import ContestGamesSection from "./Contest/ContestGamesSection";
import ContestHeroSection from "./Contest/ContestHeroSection";
import ContestHeroSkeleton from "./Contest/ContestHeroSkeleton";
import ContestJudgesSection from "./Contest/ContestJudgesSection";
import ContestJudgingProgressSection from "./Contest/ContestJudgingProgressSection";
import { Button } from "./commons/Button";
import { SectionLayout } from "./WebsiteLayout/SectionLayout";
import ContestPrizesSection from "./Contest/ContestPrizesSection";
import ContestVideosSection from "./Contest/ContestVideosSection";
import ConfirmationModal from "./commons/ConfirmationModal";

export default function PageContest(props) {
  let router = useRouter();
  let query = getQuery(router);
  let userInfo = useSelector((root: RootState) => root.auth.userInfo);
  const myUserId = userInfo?.user?.user_id;

  /**@type {[Participant, (obj: Participant)=> any]} */
  let [participant, setParticipant] = useState<Participant | null>(null);
  /**@type {[Contest, (obj: Contest)=> any]} */
  let [contest, setContest] = useState<Contest>();
  let [judges, setJudges] = useState<any[]>([]);
  let [error, setError] = useState<string>();
  let [timeLeft, setTimeLeft] = useState<string | null>(null);
  let [judgingProgress, setJudgingProgress] = useState<Results | null>(null);
  let [resultsPublic, setResultsPublic] = useState<boolean | null>(null);
  let [showPublishModal, setShowPublishModal] = useState(false);
  let [publishError, setPublishError] = useState<{
    message: string;
    votes_confirmed?: number;
    votes_required?: number;
  } | null>(null);

  const isHost = participant?.kind == String(ParticipantType.judge) &&
    (participant?.host == "1" || participant?.host === true);

  useEffect(() => {
    setParticipant(null);

    //fetch contest
    GMIApi.getInstance().getContest(query.contest, (data) => {
      if (data.success)
        setContest(data.contests[0]);
      else
        setError(data.error || "invalid contest");
    });

    //fetch all participants to find judges and merge with user info for avatars
    GMIApi.getInstance().getParticipants(query.contest, false, (partData) => {
      if (partData.success) {
        const judgeParticipants = partData.participants.filter(p => p.kind == ParticipantType.judge);

        if (myUserId) {
          const me = partData.participants.find(p => p.id == myUserId);
          if (me) setParticipant(me);
        }

        // To get avatars, we fetch all users and match them
        GMIApi.getInstance().getUsers((userData) => {
          if (userData.success) {
            const enrichedJudges = judgeParticipants.map(judge => {
              const user = userData.users.find(u => u.id == judge.id);
              return {
                ...judge,
                avatar: user?.avatar || user?.user_avatar || judge.avatar || judge.user_avatar
              };
            });
            setJudges(enrichedJudges);
          } else {
            setJudges(judgeParticipants);
          }
        });
      }
    });
  },
    [query.contest, myUserId]);

  useEffect(() => {
    if (!contest) return;

    const timer = setInterval(() => {
      const targetDate = contest.can_submit ? new Date(contest.end_at) : new Date(contest.completed_at);
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Scaduto");
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${days}g ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [contest]);

  // Fetch judging progress when contest is in judging phase, or for hosts
  // after the judging deadline (publish gate needs global counters).
  useEffect(() => {
    if (!contest) return;

    const isComplete = Date.now() > new Date(Date.parse(contest.completed_at)).getTime();
    const canSubmitGames = !!contest.can_submit;
    const isJudging = !isComplete && !canSubmitGames;
    const shouldFetch = isJudging || (isComplete && isHost);

    if (!shouldFetch) return;

    GMIApi.getInstance().getResults(query.contest, (data) => {
      if (data.success) {
        setJudgingProgress(data);
        if (data.public !== undefined)
          setResultsPublic(data.public === true || data.public === "1");
      } else {
        console.error("[PageContest] getResults failed:", data.error);
      }
    });
  }, [contest, query.contest, isHost]);

  const detailBreadcrumbs = [
    homeBreadcrumb,
    competitionsBreadcrumb,
    { label: contest?.name || "Competizione" },
  ];

  if (query.contest === "0") {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <img className="max-w-md w-full animate-pulse" src={basePath + "/img/gmicomp.png"} />
      </div>
    )
  }


  if (error)
    return (
      <SectionLayout
        title="Competizione"
        description="Non riusciamo a caricare questa competizione."
        breadcrumbs={detailBreadcrumbs}
      >
        <div className="bg-error/10 border border-error/20 p-8 text-center">
          <h2 className="text-xl font-bold text-error">Errore</h2>
          <p className="text-content-muted mt-2">{error}</p>
          <Button variant="ghost" onClick={() => router.push("/competizioni/")} className="mt-4">Torna alla Home</Button>
        </div>
      </SectionLayout>
    );

  if (!contest)
    return (
      <SectionLayout
        breadcrumbs={detailBreadcrumbs}
        hero={<ContestHeroSkeleton />}
      >
        <div className="w-full flex flex-col gap-8 pb-12 animate-pulse">
          {/* Games skeleton */}
          <section className="ds-card-section">
            <div className="h-8 w-24 bg-surface-solid rounded mb-4" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-72 bg-surface-solid" />
              ))}
            </div>
          </section>

          {/* Judges skeleton */}
          <section className="ds-card-section">
            <div className="h-8 w-20 bg-surface-solid rounded mb-4" />
            <div className="flex flex-wrap gap-6 justify-center">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex flex-col items-center gap-3 w-24 shrink-0">
                  <div className="w-24 h-24 bg-surface-solid" />
                  <div className="h-4 w-20 bg-surface-solid rounded" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </SectionLayout>
    );

  const complete_date = new Date(Date.parse(contest.completed_at));
  const end_date = new Date(Date.parse(contest.end_at));

  const isComplete = Date.now() > complete_date.getTime();
  const canSubmitGames = !!contest.can_submit;
  const isJudging = !isComplete && !canSubmitGames;

  const isJudge = !!participant && participant.kind == String(ParticipantType.judge);
  const isCompetitor = !!participant && participant.kind == String(ParticipantType.competitor);

  const votesConfirmed = Number(judgingProgress?.votes_confirmed ?? 0);
  const votesRequired = Number(judgingProgress?.votes_required ?? 0);
  const missingVotes = Math.max(0, votesRequired - votesConfirmed);
  const publishReady = !!judgingProgress?.all_votes_confirmed;
  const hasPublishProgress = !!judgingProgress && votesRequired > 0;

  const actions = [];
  const canVote = isJudge && !isComplete && !canSubmitGames;

  const canNew = canSubmitGames && !canVote && !isCompetitor && !isJudge;
  const canEdit = canSubmitGames && !canVote && isCompetitor;

  actions.push(
    <Button
      key="regolamento"
      variant="outlineLight"
      onClick={() => router.push(`/competizioni/rules/?contest=${contest.id}`)}
    >
      Regolamento
    </Button>
  );

  if (canVote) {
    actions.push(
      <Button
        key="vota"
        onClick={() => router.push("/competizioni/editvotes/?contest=" + contest.id)}
        variant="light"
      >
        Vota
      </Button>
    );
  }
  if (canNew) {
    actions.push(
      <Button
        key="invia"
        onClick={() => router.push("/competizioni/participation/?contest=" + contest.id)}
        variant="light"
      >
        Partecipa
      </Button>
    );
  }
  if (canEdit) {
    actions.push(
      <Button
        key="modifica"
        onClick={() => router.push("/competizioni/participation/?contest=" + contest.id)}
        variant="light"
      >
        Aggiorna Gioco
      </Button>
    );
  }

  // Host preview button when complete but not published
  if (isComplete && isHost && resultsPublic === false) {
    actions.push(
      <Button
        key="anteprima"
        onClick={() => router.push("/competizioni/results/?contest=" + contest.id)}
        variant="light"
      >
        Anteprima Risultati
      </Button>
    );

    actions.push(
      <span key="publish-progress" className="text-xs font-medium text-gray-300">
        {hasPublishProgress
          ? `${votesConfirmed}/${votesRequired} voti confermati${missingVotes > 0 ? ` · ${missingVotes === 1 ? "manca 1 voto" : `mancano ${missingVotes} voti`}` : ""}`
          : "Verifica voti confermati..."}
      </span>
    );

    actions.push(
      <Button
        key="pubblica"
        onClick={() => setShowPublishModal(true)}
        variant="light"
        disabled={!publishReady}
        title={
          publishReady
            ? "Tutti i voti sono confermati"
            : hasPublishProgress
              ? missingVotes === 1
                ? "Manca 1 voto da confermare"
                : `Mancano ${missingVotes} voti da confermare`
              : "Verifica lo stato dei voti prima di pubblicare"
        }
      >
        Pubblica Risultati
      </Button>
    );
  }

  return (
    <SectionLayout
      breadcrumbs={detailBreadcrumbs}
      hero={
        <ContestHeroSection
          contest={contest}
          actions={actions}
          isComplete={isComplete}
          isJudging={isJudging}
          canSubmitGames={canSubmitGames}
          timeLeft={timeLeft}
        />
      }
    >
      <div className="w-full flex flex-col gap-8 pb-12">
        {publishError && (
          <div role="alert" className="border border-error/20 bg-error/10 p-4 text-sm text-error">
            <p className="font-bold">Impossibile pubblicare i risultati</p>
            <p className="mt-1">{publishError.message}</p>
            {publishError.votes_required !== undefined && (
              <p className="mt-1 font-mono text-xs">
                Voti confermati: {publishError.votes_confirmed ?? 0}/{publishError.votes_required}
                {" · "}
                mancano {Math.max(0, publishError.votes_required - (publishError.votes_confirmed ?? 0))}
              </p>
            )}
          </div>
        )}

        <ContestGamesSection
          contest={contest.id}
          contestEnded={isComplete}
          onPublicResults={setResultsPublic}
        />

        <ContestJudgesSection judges={judges} />

        {isJudging && <ContestJudgingProgressSection judgingProgress={judgingProgress} judges={judges} />}

        <ContestVideosSection contestId={contest.id} />

        <ContestPrizesSection contestId={contest.id} />
      </div>
      <ConfirmationModal
        isOpen={showPublishModal}
        title="Pubblica Risultati"
        message="Vuoi davvero pubblicare i risultati della competizione? Questo calcolerà i piazzamenti in base ai voti e renderà i risultati visibili a tutti."
        confirmText="Pubblica"
        cancelText="Annulla"
        variant="primary"
        onConfirm={() => {
          setShowPublishModal(false);
          setPublishError(null);
          GMIApi.getInstance().publishResults(contest.id, (data) => {
            if (data.success) {
              alert("Risultati pubblicati con successo!");
              setResultsPublic(true);
              setJudgingProgress(current => current
                ? {
                    ...current,
                    public: true,
                    all_votes_confirmed: true,
                    votes_confirmed: current.votes_required ?? current.votes_confirmed,
                  }
                : current);
              return;
            }

            if (data.code === "VOTES_NOT_CONFIRMED" && data.votes_required !== undefined) {
              setJudgingProgress(current => current
                ? {
                    ...current,
                    votes_confirmed: data.votes_confirmed ?? current.votes_confirmed,
                    votes_required: data.votes_required,
                    all_votes_confirmed: false,
                  }
                : current);
            }

            setPublishError({
              message: data.error || "Errore sconosciuto durante la pubblicazione.",
              votes_confirmed: data.votes_confirmed,
              votes_required: data.votes_required,
            });
          });
        }}
        onCancel={() => setShowPublishModal(false)}
      />
    </SectionLayout>
  );
}