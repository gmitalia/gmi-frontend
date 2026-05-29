import React, { useState, useEffect } from "react";
import GMIApi from "../../src/api/GMIApi";
import PopupVotes from "../PopupVotes";
import Link from "next/link";
import { useRouter } from "next/router";
import GameBadge from "../commons/GameBadge";
import ImageModal from "../commons/ImageModal";
import { DownloadIcon } from "../commons/Icons";
import { Button } from "../commons/Button";
import { parseAuthors } from "../../src/Utils";

export const GameTile = (props) => {
  const { game, position, showTrophy, showVotes, contest, resultsPublic, href } = props;
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Image URL handling
  let img_url = GMIApi.getInstance().imageURL + "/thumbnail.png";
  if (game.image_url) {
    if (game.image_url.indexOf("http") >= 0)
      img_url = game.image_url;
    else
      img_url = GMIApi.getInstance().imageURL + game.image_url;
  }

  const authors = parseAuthors(game.authors);

  // Check if it's top 3
  const isTop3 = resultsPublic && position <= 3 && showTrophy;

  // Podium specific styles
  const podiumStyles = {
    1: {
      glow: "bg-gold/10",
      border: "border-gold",
      title: "text-gold",
      gradient: "bg-gradient-to-br from-surface-elevated to-gold/10"
    },
    2: {
      glow: "bg-silver/10",
      border: "border-silver",
      title: "text-silver",
      gradient: "bg-gradient-to-br from-surface-elevated to-silver/10"
    },
    3: {
      glow: "bg-bronze/10",
      border: "border-bronze",
      title: "text-bronze",
      gradient: "bg-gradient-to-br from-surface-elevated to-bronze/10"
    }
  }[position] || {};

  return (
    <div
      id={`game-${game.id}`}
      className="group relative w-full h-full ds-rounded-card overflow-hidden transition-all duration-300"
      data-position={position}
      onClick={href ? () => router.push(href) : undefined}
      onKeyDown={href ? (e) => { if (e.key === 'Enter') router.push(href); } : undefined}
      role={href ? "button" : undefined}
      tabIndex={href ? 0 : undefined}
    >
      {/* Glow effect behind card */}
      <div className={`
        absolute -inset-0.5 ds-rounded-card transition-all duration-500 
        ${isTop3 ? `opacity-100 blur-md ${podiumStyles.glow}` : 'opacity-0'}`} />

      {/* Card content */}
      <div className={`
        relative border ds-rounded-card overflow-hidden
        flex flex-col h-full transition-all duration-300
        ${isTop3 ? `${podiumStyles.gradient} ${podiumStyles.border}` : 'bg-surface-elevated border-default'}`}
      >
        {/* Image Section */}
        <div
          className="relative h-48 overflow-hidden cursor-zoom-in hover:scale-105 transition-transform duration-500"
          onClick={(e) => { e.stopPropagation(); setShowFullscreen(true); }}
        >
          <img
            className="w-full h-full object-cover"
            alt={game.name}
            src={img_url}
            loading="lazy"
          />

          {/* Position badge */}
          {showTrophy && resultsPublic && position && (
            <div className="absolute top-3 left-3 z-10">
              <GameBadge placement={position} />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-1">
          {/* Title */}
          <h3 className={`text-lg font-bold text-center mb-2 line-clamp-2 transition-colors duration-200 ${isTop3 ? podiumStyles.title : 'text-content'}`}>
            {game.name}
          </h3>

          {/* Authors */}
          <div className="flex flex-wrap items-center justify-center gap-1 text-sm text-content-muted mb-3">
            <span>di</span>
            {authors.map((author, index) => (
              <React.Fragment key={author.id}>
                <Link href={`/user?user=${author.id}`}>
                  <a onClick={(e) => e.stopPropagation()} className="text-secondary hover:text-secondary/80 hover:underline transition-colors">
                    {author.name}
                  </a>
                </Link>
                {index < authors.length - 1 && (
                  <span>{index === authors.length - 2 ? " e " : ", "}</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Description */}
          <p className="text-sm text-content-muted text-center line-clamp-2 mb-4 flex-1">
            {game.short_description}
          </p>

          {/* Actions - Only show if there are votes, a download, or a status to show */}
          {((game.votes_count !== undefined ? game.votes_count > 0 : showVotes) || game.download_url || (showTrophy && !game.download_url)) && (
            <div className="flex items-center justify-between gap-x-2 sm:gap-x-4 pt-4 border-t border-default w-full min-w-0">
              {(game.votes_count !== undefined ? game.votes_count > 0 : showVotes) ? (
                <PopupVotes contest={contest} game={game?.id} gamename={game?.name} authors={game.authors} />
              ) : (
                <div /> // Spacer to keep download on the right
              )}

              {/* Download Button or Status */}
              {game.download_url ? (
                <span onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    href={game.download_url}
                    icon={<DownloadIcon />}
                    title={`Scarica ${game.name}`}
                  >
                    Scarica
                  </Button>
                </span>
              ) : showTrophy ? (
                <span className="text-[11px] font-medium text-content-muted italic text-right">
                  Download non disponibile
                </span>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Image Viewer */}
      {mounted && showFullscreen && (
        <ImageModal
          src={img_url}
          alt={game.name}
          onClose={() => setShowFullscreen(false)}
        />
      )}
    </div>
  );
};
