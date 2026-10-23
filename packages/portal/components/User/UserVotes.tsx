import React, { useState, useEffect } from "react";
import GMIApi from "../../src/api/GMIApi";
import { GameTile } from "../Contest/GameTile";
import "moment/locale/it";
import Link from "next/link";

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
      <Link key={vote.contest_id} href={`/competizioni/contest?contest=${contest?.id}`} className="bg-surface border border-default hover:border-content/30 p-6 transition-colors">
        
          <div className="flex flex-col items-center gap-3 text-center">
            <div>
              <h3 className="font-bold text-content line-clamp-1">
                {contest?.name ?? "Caricamento..."}
              </h3>
              <p className="text-xs font-semibold text-content-muted uppercase tracking-widest mt-1">
                {(vote.host == "1" || vote.host === true || contest?.judges?.find(j => j.id == userInfo.user_id)?.host == "1") ? "Organizzatore" : "Giudice"}
              </p>
            </div>
          </div>
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
