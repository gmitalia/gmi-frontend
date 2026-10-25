import React, { useState, useEffect } from "react";
import GMIApi from "../../src/api/GMIApi";
import PopupVotes from "../PopupVotes";
import Link from "next/link";
import { useRouter } from "next/router";
import GameBadge from "../commons/GameBadge";
import ImageModal from "../commons/ImageModal";
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
      border: "border-gold",
      title: "text-gold",
    },
    2: {
      border: "border-silver",
      title: "text-silver",
    },
    3: {
      border: "border-bronze",
      title: "text-bronze",
    }
  }[position] || {};

  return (
    <div
      id={`game-${game.id}`}
      className="group relative w-full h-full overflow-hidden"
      data-position={position}
      onClick={href ? () => router.push(href) : undefined}
      onKeyDown={href ? (e) => { if (e.key === 'Enter') router.push(href); } : undefined}
      role={href ? "button" : undefined}
      tabIndex={href ? 0 : undefined}
    >
      {/* Card content */}
      <div className={`
        relative border overflow-hidden
        flex flex-col h-full
        ${isTop3 ? `${podiumStyles.border} bg-surface` : 'bg-surface border-default'}`}
      >
        {/* Image Section */}
        <div
          className="relative h-48 overflow-hidden cursor-zoom-in"
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
                <Link href={`/competizioni/user/?user=${author.id}`} onClick={(e) => e.stopPropagation()} className="text-secondary hover:text-secondary/80 hover:underline transition-colors">
                  
                    {author.name}
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
            <div className="mt-auto border-t border-default pt-4">
              <div className="flex flex-col justify-center gap-2 min-[360px]:flex-row">
                {(game.votes_count !== undefined ? game.votes_count > 0 : showVotes) ? (
                  <PopupVotes
                    contest={contest}
                    game={game?.id}
                    gamename={game?.name}
                    authors={game.authors}
                    className="w-full min-[360px]:max-w-[130px]"
                  />
                ) : null}

                {/* Download Button or Status */}
                {game.download_url ? (
                  <span className="contents" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="primary"
                      size="sm"
                      href={game.download_url}
                      title={`Scarica ${game.name}`}
                      className="w-full min-[360px]:max-w-[130px]"
                    >
                      Scarica
                    </Button>
                  </span>
                ) : showTrophy ? (
                  <span className="flex w-full items-center justify-center border border-default bg-surface-muted px-3 py-2 text-center text-[10px] font-semibold uppercase leading-tight tracking-[0.14em] text-content-muted min-[360px]:max-w-[130px]">
                    Download non disponibile
                  </span>
                ) : null}
              </div>
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
