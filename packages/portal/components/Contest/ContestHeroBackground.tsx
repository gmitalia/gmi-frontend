import React from "react";
import ThumbnailWallBanner from "../../public/competizioni/img/thumbnail-wall.webp";

/** Sfondo del banner competizione, condiviso tra hero e skeleton di caricamento. */
export const ContestHeroBackground = () => (
  <>
    <div
      aria-hidden="true"
      className="contest-hero-wall absolute inset-0 opacity-50"
      style={{ backgroundImage: `url(${ThumbnailWallBanner.src})` }}
    />
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-gradient-to-r from-[#070b13]/95 via-[#0b1220]/80 to-[#0b1220]/55"
    />
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-gradient-to-t from-[#070b13] via-transparent to-transparent"
    />
    <div
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#007A69] via-[#00A58E] to-transparent"
    />
  </>
);

export default ContestHeroBackground;
