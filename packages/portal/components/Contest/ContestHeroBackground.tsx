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
      className="absolute inset-0 bg-gradient-to-r from-night-900/95 via-night-800/80 to-night-800/55"
    />
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-gradient-to-t from-night-900 via-transparent to-transparent"
    />
    <div
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-success via-success-light to-transparent"
    />
  </>
);

export default ContestHeroBackground;
