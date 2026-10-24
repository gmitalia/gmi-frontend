import React from "react";
import Link from "next/link";
import { basePath } from "../../src/paths";
import { EmptyState } from "../commons/EmptyState";

const roleLabelClasses =
  "mt-1 inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold uppercase leading-none tracking-[0.18em]";

const JudgeCard = ({ judge, isHost }) => {
  return (
    <div className="group flex flex-col items-center text-center">
      <Link
        href={`/competizioni/user/?user=${judge.id}`}
        className="relative mb-2 block cursor-pointer"
      >
        <img
          src={judge.avatar || judge.user_avatar || basePath + "/img/profile.png"}
          className={`h-20 w-20 object-cover md:h-24 md:w-24 ${
            isHost ? "border-4 border-accent" : "border-4 border-default"
          }`}
          alt={judge.user_name}
          onError={(e) => { (e.target as HTMLImageElement).src = basePath + "/img/profile.png"; }}
        />
      </Link>
      <Link
        href={`/competizioni/user/?user=${judge.id}`}
        className="text-lg font-bold text-content transition-colors hover:text-secondary"
      >
        {judge.user_name}
      </Link>
      {isHost ? (
        <span className={`${roleLabelClasses} text-accent`}>
          Organizzatore
        </span>
      ) : (
        <span className={`${roleLabelClasses} text-content-muted`}>
          Giudice
        </span>
      )}
    </div>
  );
};

const ContestJudgesSection = ({ judges }) => {
  return (
    <section className="ds-card-section">
      <h2 className="text-2xl font-bold text-content mb-4 flex items-center gap-3">
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
        <EmptyState>
          Ancora nessun giudice per questa competizione.
        </EmptyState>
      )}
    </section>
  );
};

export default ContestJudgesSection;
