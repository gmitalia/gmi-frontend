import React from "react";
import Link from "next/link";
import { basePath } from "../../next.config";

const JudgeCard = ({ judge, isHost }) => {
  const ringStyle = isHost
    ? "bg-accent-warm from-accent-warm to-accent-warm shadow-md shadow-warning/20"
    : "bg-surface group-hover:bg-surface-elevated";

  return (
    <div className="flex flex-col items-center text-center group">
      <Link href={`/user?user=${judge.id}`}>
        <a className="relative mb-4 cursor-pointer block">
          <div className={`relative p-1 rounded-full ${ringStyle} group-hover:scale-105 transition-transform duration-300`}>
            <img
              src={judge.avatar || judge.user_avatar || (basePath + "/img/profile.png")}
              className={`w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-thick border-primary`}
              alt={judge.user_name}
              onError={(e) => { e.target.src = basePath + "/img/profile.png"; }}
            />
          </div>
        </a>
      </Link>
      <Link href={`/user?user=${judge.id}`}>
        <a className={`text-content font-bold transition-colors text-lg ${isHost ? "hover:text-accent-warm" : "hover:text-secondary"}`}>
          {judge.user_name}
        </a>
      </Link>
      <p className={`text-xs font-medium ${isHost ? "text-accent-warm" : "text-content-muted"}`}>
        {isHost ? "Organizzatore" : "Giudice"}
      </p>
    </div>
  );
};

const ContestJudgesSection = ({ judges }) => {
  return (
    <section className="ds-card-section">
      <h2 className="text-2xl font-bold text-content mb-8 flex items-center gap-3">
        Giuria
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {judges.filter(j => j.host == "1" || j.host === true).map(judge => (
          <JudgeCard key={judge.id} judge={judge} isHost />
        ))}

        {judges.filter(j => j.host != "1" && j.host !== true).map(judge => (
          <JudgeCard key={judge.id} judge={judge} isHost={false} />
        ))}
      </div>

      {judges.length === 0 && (
        <div className="py-12 flex flex-col items-center justify-center text-content-muted italic">
          <p>Nessun giudice assegnato ancora per questa edizione.</p>
        </div>
      )}
    </section>
  );
};

export default ContestJudgesSection;
