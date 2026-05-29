import React, { useState, useEffect } from "react";
import GMIApi from "../../src/api/GMIApi";
import { GameTile } from "../Contest/GameTile";
import "moment/locale/it";
import Link from "next/link";
import { StarIcon } from "../commons/Icons";

export default function UserVotes(props) {
  /**@type {UserInfo} */
  const userInfo = props.userInfo;
  const contests = props.contests || [];

  // Map contest ID to contest object for quick lookup
  const contestMap = {};
  contests.forEach(c => {
    contestMap[c.id] = c;
  });

  if (userInfo.votes == undefined || userInfo.votes.length == 0)
    return <div></div>;

  if (contests.length === 0 && userInfo.votes?.length > 0)
    return <div>Loading</div>;


  userInfo.votes.sort((a, b) => a.contest_id - b.contest_id)

  const elements = userInfo.votes?.map((vote, i) => {
    let contest = contestMap[vote.contest_id]

    return (
      <Link key={vote.contest_id} href={`/contest?contest=${contest?.id}`}>
        <a className="group bg-surface-muted border border-default hover:border-secondary/30 ds-rounded-card p-6 transition-all hover:scale-[1.02] active:scale-[0.98]">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 ds-rounded-cta  from-accent/20 to-accent/20 flex items-center justify-center text-accent group-hover:from-accent group-hover:text-content transition-all ds-shadow-lg border border-accent/20">
              <StarIcon size={24} />
            </div>
            <div>
              <h3 className="font-bold text-content group-hover:text-secondary transition-colors line-clamp-1">
                {contest?.name ?? "Caricamento..."}
              </h3>
              <p className="text-xs font-black text-content-muted uppercase tracking-widest mt-1">
                {(vote.host == "1" || vote.host === true || contest?.judges?.find(j => j.id == userInfo.user_id)?.host == "1") ? "Organizzatore" : "Giudice"}
              </p>
            </div>
          </div>
        </a>
      </Link>
    )
  })


  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-content uppercase tracking-wider">Giudizi</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {elements}
      </div>
    </div>
  );
}
