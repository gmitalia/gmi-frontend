import React from "react";
import { Game } from "../../../typings";
import { urlFor } from "../../../sanity";

interface ShowcaseCardProps {
  game: Game;
}

const ShowcaseCard = ({ game }: ShowcaseCardProps) => {
  return (
    <div className="showcaseCard__wrapper">
      <a
        className="showcaseCard"
        style={{
          backgroundImage: game.banner ? `url(${urlFor(game.banner)?.url()})` : undefined,
        }}
        title={game.title}
        href={game.url}
        target="_blank"
      >
        <div className="showcaseCard__text-wrapper">
          <p>{game.title}</p>
          <p>di {game.author}</p>
        </div>
      </a>

      {/* Sui dispositivi touch non c'è hover: il titolo resta visibile sotto la card. */}
      <a
        className="showcaseCard__caption"
        href={game.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <p>{game.title}</p>
        <p>di {game.author}</p>
      </a>
    </div>
  );
};

export default ShowcaseCard;
