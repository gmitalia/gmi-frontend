import React, { useState } from "react";
import GMIApi from "../../src/api/GMIApi";

/**
 * AwardBadge - Shows the award image when available, otherwise a plain text badge.
 */
export const AwardBadge = ({ award, contestId }) => {
  const name = award.name || award.text || "";
  const [imgFailed, setImgFailed] = useState(false);

  const imageUrl = award.url
    ? `${GMIApi.getInstance().awardsURL}${contestId}/${award.url}`
    : null;

  // Render award image replacing entire badge
  if (imageUrl && !imgFailed) {
    return (
      <div className="relative overflow-hidden" title={name}>
        <img
          src={imageUrl}
          alt={name}
          className="w-[280px] h-auto object-cover"
          onError={() => setImgFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className="flex items-center px-4 py-2 w-[280px] border border-default bg-surface"
      title={award.desc || name}
    >
      <span className="text-xs font-semibold uppercase tracking-wider text-content whitespace-normal break-words leading-tight">
        {name}
      </span>
    </div>
  );
};
