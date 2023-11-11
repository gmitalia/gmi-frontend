import React from 'react'
import { Game } from '../../../typings'
import { urlFor } from '../../../sanity';

interface ShowcaseCardProps {
  game: Game;
}

const ShowcaseCard = ({game}: ShowcaseCardProps) => {
  return (
    <div className="showcaseCard__wrapper">
      <a className="showcaseCard" style={{backgroundImage: `url(${urlFor(game.banner)?.url()!}`}} title={game.title} href={game.url}>
        <div className="showcaseCard__text-wrapper">
          <p>{game.title}</p>
          <p>di {game.author}</p>
        </div>
      </a>
    </div>
  )
}

export default ShowcaseCard