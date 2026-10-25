import React from "react";
import GMIApi from "../../src/api/GMIApi";
import GameBadge from "../commons/GameBadge";

export const RandomGameThumbnail = ({ game, className = "" }) => {
  const imgUrl = game?.image_url
    ? game.image_url.indexOf("http") >= 0
      ? game.image_url
      : GMIApi.getInstance().imageURL + game.image_url
    : GMIApi.getInstance().imageURL + "/thumbnail.png";

  const placement = game?.placement ? parseInt(game.placement) : null;

  return (
    <div className={`relative overflow-hidden group ${className}`}>
      <img
        src={imgUrl}
        alt={game?.name || "Game thumbnail"}
        className="w-full h-full object-cover transition-transform duration-500"
        onError={(e) => { (e.target as HTMLImageElement).src = GMIApi.getInstance().imageURL + "/thumbnail.png"; }}
      />
      {placement && (
        <div className="absolute top-3 left-3 z-10">
          <GameBadge placement={placement} />
        </div>
      )}
    </div>
  );
};

export default RandomGameThumbnail;
