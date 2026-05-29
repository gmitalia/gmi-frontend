import React from "react";
import "moment/locale/it";
import { GamepadIcon, TrophyIcon, MedalIcon, HandshakeIcon, ScaleIcon } from "../commons/Icons";
import { parseAuthors } from "../../src/Utils";

export default function UserStats(props) {
  const userInfo = props.userInfo;
  if (!userInfo) return null;

  const statistics = [
    {
      icon: GamepadIcon,
      name: "Partecipazioni",
      value: userInfo.games.length,
      borderColor: "border-info/30",
      bgColor: "bg-info/10",
      shadowColor: "shadow-info/10"
    },
    {
      icon: TrophyIcon,
      name: "Vittorie",
      value: userInfo.games.filter(o => o.placement == 1).length,
      borderColor: "border-accent-warm/30",
      bgColor: "bg-accent-warm/10",
      shadowColor: "shadow-accent-warm/10"
    },
    {
      icon: MedalIcon,
      name: "Podi",
      value: userInfo.games.filter(o => o.placement < 4 && o.placement != 0).length,
      borderColor: "border-content-muted/30",
      bgColor: "bg-content-muted/10",
      shadowColor: "shadow-content-muted/10"
    },
    {
      icon: HandshakeIcon,
      name: "Collaborazioni",
      value: userInfo.games.filter(o => parseAuthors(o.authors).length > 1).length,
      borderColor: "border-accent/30",
      bgColor: "bg-accent/10",
      shadowColor: "shadow-accent/10"
    },
    {
      icon: ScaleIcon,
      name: "Giudizi",
      value: userInfo.votes?.length ?? 0,
      borderColor: "border-success/30",
      bgColor: "bg-success/10",
      shadowColor: "shadow-success/10"
    }
  ];

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-content uppercase tracking-wider">Statistiche</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statistics.map((stat, index) => (
          <div key={index} className="border border-default ds-rounded-card p-4 flex flex-col items-center justify-center gap-2 bg-surface">
            <div className={`w-12 h-12 ds-rounded-cta ${stat.bgColor} border ${stat.borderColor} flex items-center justify-center ${stat.shadowColor} ds-shadow-lg transition-all `}>
              <stat.icon size={22} className="text-content-muted" />
            </div>
            <span className="text-[10px] font-black text-content-muted uppercase tracking-widest mt-1">{stat.name}</span>
            <span className="text-2xl font-black text-content">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
