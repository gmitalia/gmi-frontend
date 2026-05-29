import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import GMIApi from "../../src/api/GMIApi";
import { MedalsInfo } from "../../src/Medals";
import "moment/locale/it"
import { Button } from "../commons/Button";

export default function UserInventory(props) {
  /**@type {number} */
  const userId = props.user;

  /**@type {[UserMedals, (obj: UserMedals)=> any]} */
  let [medals, setMedals] = useState();
  let [error, setError] = useState();
  let [showMedal, setShowMedal] = useState(null);
  /**@type {[any, (obj: any)=> any]} */
  let [selectedMedal, setSelectedMedal] = useState(null);
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

  /**@param {[string, boolean | MedalGame[]]} medal */
  const renderMedal = function (medal, index) {
    let name = medal[0];
    let value = medal[1];

    if (Array.isArray(value)) {
      return value.map((item, subindex) => {
        let info = MedalsInfo[name];
        const medalId = index + "_" + subindex;
        const isHovered = showMedal === medalId;

        return (
          <div key={medalId} className="relative">
            <button
              className="group relative flex items-center justify-center p-2 ds-rounded-card bg-content/5 hover:bg-content/10 border border-default hover:border-secondary/30 transition-all hover:scale-110 active:scale-95"
              onMouseOver={() => setShowMedal(medalId)}
              onMouseLeave={() => setShowMedal(null)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedMedal({ info, contestName: item.contest_name });
              }}
            >
              <img className="w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-lg transition-transform group-hover:scale-110" src={info.image} alt={info.name} />

              {/* Desktop Tooltip */}
              {isHovered && (
                <div className="hidden md:block absolute top-full left-1/2 -translate-x-1/2 mt-3 z-[100] pointer-events-none">
                  <div className="w-[280px] bg-surface-muted backdrop-blur-xl border border-default ds-rounded-card p-5 ds-shadow-lg animate-in fade-in zoom-in duration-200">
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="w-16 h-16 ds-rounded-cta  from-secondary/20 to-accent/20 flex items-center justify-center p-2 border border-default">
                        <img className="w-full h-full object-contain" src={info.image} alt="" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-content text-lg leading-tight">{item.contest_name}</h4>
                        <p className="text-xs font-black text-secondary uppercase tracking-widest">{info.name}</p>
                      </div>
                      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      <p className="text-sm text-content/80 leading-relaxed italic">"{info.desc}"</p>
                    </div>
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-surface-solid rotate-45 border-t border-l border-default" />
                  </div>
                </div>
              )}
            </button>
          </div>
        );
      });
    } else if (value == true) {
      let info = MedalsInfo[name];
      const isHovered = showMedal === index;

      return (
        <div key={index} className="relative">
          <button
            className="group relative flex items-center justify-center p-2 ds-rounded-card bg-content/5 hover:bg-content/10 border border-default hover:border-secondary/30 transition-all hover:scale-110 active:scale-95"
            onMouseOver={() => setShowMedal(index)}
            onMouseLeave={() => setShowMedal(null)}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMedal({ info, contestName: null });
            }}
          >
            <img className="w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-lg transition-transform group-hover:scale-110" src={info.image} alt={info.name} />

            {/* Desktop Tooltip */}
            {isHovered && (
              <div className="hidden md:block absolute top-full left-1/2 -translate-x-1/2 mt-3 z-[100] pointer-events-none">
                <div className="w-[280px] bg-surface backdrop-blur-xl border border-default ds-rounded-card p-5 ds-shadow-lg animate-in fade-in zoom-in duration-200">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-16 h-16 ds-rounded-cta  from-secondary/20 to-accent/20 flex items-center justify-center p-2 border border-default">
                      <img className="w-full h-full object-contain" src={info.image} alt="" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-content text-lg leading-tight">{info.name}</h4>
                    </div>
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <p className="text-sm text-content/80 leading-relaxed italic">"{info.desc}"</p>
                  </div>
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-surface-solid rotate-45 border-t border-l border-default" />
                </div>
              </div>
            )}
          </button>
        </div>
      );
    }
  };

  const renderInventory = function () {
    if (error) return <div>ERROR: {error}</div>;

    if (!medals) return <div>Loading</div>;

    const hasMedals = Object.entries(medals).some(([_, value]) => {
        if (Array.isArray(value)) return value.length > 0;
        return value === true;
      });

      if (!hasMedals) {
        return (
          <div className="w-full flex flex-col items-center justify-center py-12 text-content-muted">
            <p className="text-sm font-medium">Non ci sono achievements</p>
          </div>
        );
      }

      return Object.entries(medals).map(renderMedal);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-content uppercase tracking-wider">Achievements</h2>
      </div>

      <div className="bg-surface border border-default ds-rounded-card p-6">
        <div className="flex flex-row flex-wrap justify-center gap-4">{renderInventory()}</div>
      </div>

      {/* Global Mobile Popover via Portal */}
      {mounted && selectedMedal && createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-surface-muted backdrop-blur-sm" onClick={() => setSelectedMedal(null)} />
          <div className="relative w-full max-w-[320px] bg-surface-solid border border-default rounded-md-card p-8 ds-shadow-lg animate-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-24 h-24 ds-rounded-lg  from-secondary/20 to-accent/20 flex items-center justify-center p-4 border border-default shadow-inner">
                <img className="w-full h-full object-contain drop-shadow-2xl" src={selectedMedal.info.image} alt="" />
              </div>
              <div className="space-y-2">
                <h4 className="font-black text-content text-2xl leading-tight">
                  {selectedMedal.contestName ?? selectedMedal.info.name}
                </h4>
                {selectedMedal.contestName && (
                  <p className="text-xs font-black text-secondary uppercase tracking-[0.2em]">
                    {selectedMedal.info.name}
                  </p>
                )}
              </div>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <p className="text-content/80 leading-relaxed italic text-lg">"{selectedMedal.info.desc}"</p>

              <Button
                variant="gradient"
                onClick={() => setSelectedMedal(null)}
                className="!mt-4 !w-full !py-4 !font-black !uppercase !tracking-widest active:!scale-95"
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
