import React, { useState, useEffect } from "react";
import { basePath } from "../../next.config";
import Link from "next/link";

// Stat Item for mobile - aligned with header emojis
const MobileStat = ({ value, title }) => (
  <div className="flex flex-col items-center justify-center min-w-0" title={title}>
    <span className="text-[11px] font-bold text-content/80 leading-none">{value}</span>
  </div>
);

export const UserTile = (props) =>
{
  /**@type {User} */
  const user = props.user;
  const position = props.position;
  const isEven = props.isEven;
  const avatar = user.avatar ?? basePath + "/img/profile.png";

  return (
    <Link href={`/user?user=${user.id}`}>
      <a className={`group border border-default rounded-md px-3 py-3 hover:bg-surface-elevated hover:border-secondary/30 transition-all min-h-[64px] ${isEven ? 'bg-surface-muted/30' : 'bg-surface-muted'}`}>
        {/* Mobile Layout */}
        <div className="lg:hidden grid grid-cols-[32px_1fr_110px] items-center gap-x-3">
          <div className="text-xs font-bold text-content-muted flex justify-center">
            {position}
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <img
              className="h-8 w-8 rounded-full object-cover border border-default"
              src={avatar}
              onError={(ev)=> {(ev.target).src = basePath + "/img/profile.png";}}
            />
            <div className="text-sm font-semibold text-content truncate">
              {user.name}
            </div>
          </div>
          
          {/* Stats values - aligned with header emojis */}
          <div className="grid grid-cols-3 gap-0">
            <MobileStat value={user.game_count} title="Partecipazioni" />
            <MobileStat value={user.top_game_count} title="Vittorie" />
            <MobileStat value={user.judge_count} title="Giudizi" />
          </div>
        </div>
        
        {/* Desktop Layout */}
        <div className="hidden lg:grid grid-cols-[48px_1fr_100px_80px_80px] items-center gap-x-4">
          <div className="text-sm font-bold text-content-muted flex justify-center">
            {position}
          </div>

          <div className="flex items-center gap-4 min-w-0">
            <img
              className="h-10 w-10 rounded-full object-cover border border-default group-hover:border-secondary/50 transition-colors"
              src={avatar}
              onError={(ev)=> {(ev.target).src = basePath + "/img/profile.png";}}
            />
            <div className="text-sm font-semibold text-content truncate group-hover:text-secondary transition-colors">
              {user.name}
            </div>
          </div>

          <div className="text-sm text-content-muted text-center font-medium">
            {user.game_count}
          </div>
          
          <div className="text-sm text-content-muted text-center font-medium">
            {user.top_game_count}
          </div>

          <div className="text-sm text-content-muted text-center font-medium">
            {user.judge_count}
          </div>
        </div>
      </a>
    </Link>
  );
};
