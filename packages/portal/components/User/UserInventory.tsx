import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import GMIApi from "../../src/api/GMIApi";
import { MedalsInfo } from "../../src/Medals";
import "moment/locale/it";
import { Button } from "../commons/Button";
import { CloseIcon } from "../commons/Icons";

const HERO_MEDALS_LIMIT = 5;

export default function UserInventory(props) {
  /**@type {number} */
  const userId = props.user;
  const isHero = props.variant === "hero";

  const medalButtonClasses = isHero
    ? "group relative flex h-11 w-11 items-center justify-center transition-transform duration-200 hover:scale-110"
    : "group relative flex items-center justify-center p-2 bg-surface border border-default hover:border-content/30 transition-colors";
  const medalImageClasses = isHero
    ? "h-10 w-10 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
    : "h-10 w-10 md:h-12 md:w-12 object-contain";

  /**@type {[UserMedals, (obj: UserMedals)=> any]} */
  let [medals, setMedals] = useState<UserMedals | null>(null);
  let [error, setError] = useState<string>();
  let [showMedal, setShowMedal] = useState(null);
  /**@type {[any, (obj: any)=> any]} */
  let [selectedMedal, setSelectedMedal] = useState(null);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    //fetch contest
    console.debug("fetching user medals", userId);
    GMIApi.getInstance().getUserMedals(userId, (data) => {
      if (data.success) {
        let medals = data.medals;
        setMedals(medals);
      } else setError(data.error || "invalid contest");
    });
  }, [userId]);

  const medalEntries = [];
  if (medals) {
    Object.entries(medals).forEach(([name, value]) => {
      const info = MedalsInfo[name];

      if (Array.isArray(value)) {
        value.forEach((item, subindex) => {
          medalEntries.push({
            id: name + "_" + subindex,
            info,
            contestName: item.contest_name ?? null,
          });
        });
      } else if (value === true) {
        medalEntries.push({ id: name, info, contestName: null });
      }
    });
  }

  const renderMedal = function (medal, enableTooltip = !isHero) {
    const isHovered = showMedal === medal.id;

    return (
      <div key={medal.id} className="relative">
        <button
          className={medalButtonClasses}
          title={[medal.contestName, medal.info.name].filter(Boolean).join(" · ")}
          onMouseOver={() => setShowMedal(medal.id)}
          onMouseLeave={() => setShowMedal(null)}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedMedal({
              info: medal.info,
              contestName: medal.contestName,
            });
          }}
        >
          <img
            className={medalImageClasses}
            src={medal.info.image}
            alt={medal.info.name}
          />

          {/* Desktop Tooltip */}
          {enableTooltip && isHovered && (
            <div className="hidden md:block absolute top-full left-1/2 -translate-x-1/2 mt-3 z-[100] pointer-events-none">
              <div className="w-[280px] bg-surface border border-default p-5">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-16 h-16 flex items-center justify-center p-2 border border-default">
                    <img
                      className="w-full h-full object-contain"
                      src={medal.info.image}
                      alt=""
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-content text-lg leading-tight">
                      {medal.contestName ?? medal.info.name}
                    </h4>
                    {medal.contestName && (
                      <p className="text-xs font-semibold text-content-muted uppercase tracking-widest">
                        {medal.info.name}
                      </p>
                    )}
                  </div>
                  <div className="h-px w-full bg-default" />
                  <p className="text-sm text-content/80 leading-relaxed">
                    "{medal.info.desc}"
                  </p>
                </div>
              </div>
            </div>
          )}
        </button>
      </div>
    );
  };

  const renderInventory = function (limit?: number) {
    if (error)
      return isHero ? null : <div>ERROR: {error}</div>;

    if (!medals)
      return isHero ? (
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex h-11 w-11 items-center justify-center"
            >
              <div className="h-10 w-10 animate-pulse bg-white/10" />
            </div>
          ))}
        </div>
      ) : (
        <div>Loading</div>
      );

    if (medalEntries.length === 0) {
      return isHero ? null : (
        <div className="w-full flex flex-col items-center justify-center py-12 text-content-muted">
          <p className="text-sm font-medium">Non ci sono achievements</p>
        </div>
      );
    }

    const visibleMedals =
      typeof limit === "number" ? medalEntries.slice(0, limit) : medalEntries;

    return visibleMedals.map((medal) => renderMedal(medal));
  };

  const medalModal = mounted && selectedMedal && createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedMedal(null)} />
      <div className="relative w-full max-w-[320px] bg-surface border border-default p-8">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-24 h-24 flex items-center justify-center p-4 border border-default">
            <img className="w-full h-full object-contain" src={selectedMedal.info.image} alt="" />
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-content text-2xl leading-tight">
              {selectedMedal.contestName ?? selectedMedal.info.name}
            </h4>
            {selectedMedal.contestName && (
              <p className="text-xs font-semibold text-content-muted uppercase tracking-[0.2em]">
                {selectedMedal.info.name}
              </p>
            )}
          </div>
          <div className="h-px w-full bg-default" />
          <p className="text-content/80 leading-relaxed text-lg">"{selectedMedal.info.desc}"</p>

          <Button
            variant="secondary"
            onClick={() => setSelectedMedal(null)}
            className="!mt-4 !w-full"
          >
            OK
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );

  const allAchievementsModal =
    mounted &&
    showAllAchievements &&
    medalEntries.length > 0 &&
    createPortal(
      <div className="fixed inset-0 z-[998] flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/60"
          onClick={() => setShowAllAchievements(false)}
        />
        <div className="relative flex max-h-[80vh] w-full max-w-lg flex-col border border-default bg-surface">
          <div className="flex items-center justify-between gap-4 border-b border-default px-6 py-4">
            <h3 className="text-lg font-bold text-content">
              Achievements
              <span className="ml-2 text-sm font-semibold text-content-muted">
                ({medalEntries.length})
              </span>
            </h3>
            <button
              type="button"
              aria-label="Chiudi"
              className="-mr-2 flex h-9 w-9 items-center justify-center text-content-muted transition-colors hover:text-content"
              onClick={() => setShowAllAchievements(false)}
            >
              <CloseIcon />
            </button>
          </div>

          <div className="overflow-y-auto p-6">
            <div className="grid grid-cols-4 gap-4 sm:grid-cols-5">
              {medalEntries.map((medal) => renderMedal(medal, false))}
            </div>
          </div>
        </div>
      </div>,
      document.body
    );

  if (isHero) {
    if (error) return null;
    if (medals && medalEntries.length === 0) return null;

    const hasMore = medalEntries.length > HERO_MEDALS_LIMIT;

    return (
      <>
        <div>
          <p className="inline-flex items-center gap-2 text-[0.875rem] font-semibold uppercase tracking-[0.22em] text-gray-400">
            Achievements
            {hasMore && (
              <span className="text-gray-500">({medalEntries.length})</span>
            )}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {renderInventory(HERO_MEDALS_LIMIT)}
            {hasMore && (
              <button
                type="button"
                aria-label={`Vedi altri ${medalEntries.length - HERO_MEDALS_LIMIT} achievements`}
                title={`Vedi altri ${medalEntries.length - HERO_MEDALS_LIMIT} achievements`}
                onClick={() => setShowAllAchievements(true)}
                className="flex h-8 w-8 shrink-0 items-center justify-center border border-white/40 bg-transparent text-xs font-medium text-gray-400 transition-colors hover:border-white/60 hover:bg-white/[0.1] hover:text-gray-200"
              >
                +{medalEntries.length - HERO_MEDALS_LIMIT}
              </button>
            )}
          </div>
        </div>
        {allAchievementsModal}
        {medalModal}
      </>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-content uppercase tracking-wider">Achievements</h2>
      </div>

      <div className="bg-surface border border-default p-6">
        <div className="flex flex-row flex-wrap justify-center gap-4">{renderInventory()}</div>
      </div>

      {/* Global Mobile Popover via Portal */}
      {medalModal}
    </div>
  );
}
