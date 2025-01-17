import React, { useState, useEffect } from "react";
import GMIApi from "../../src/api/GMIApi";
import IconBtn from "../commons/IconBtn";
import Votes from "../PopupVotes";
import Link from "next/link";

export const GameTile = (props) =>
{
	const game = props.game;

	let img_url = GMIApi.getInstance().imageURL + "/thumbnail.png";
	if(game.image_url)
	{
		if(game.image_url.indexOf("http") >= 0)
			img_url = game.image_url;
		else
			img_url = GMIApi.getInstance().imageURL + game.image_url + "?" + Date.now().toString();
	}

	let authors = "";
	try
	{
		authors = Buffer.from(game.authors, "base64").toString("ascii");
		authors = JSON.parse(authors);
		authors = authors.map((author)=> 
		(
			<Link key={author.id} href={`/user?user=${author.id}`}>
				{author.name}
			</Link>
		));
	} catch(e)
	{
		console.error(game.authors, e);
	}

	let download = "";
	if(game.download_url && game.download_url != 0)
	{
		download = 
		(
			<IconBtn
			 disabled={false}
			 url={game?.download_url}
			 title={`Download ${game?.name}`}
			>
				<svg
				 xmlns="http://www.w3.org/2000/svg"
				 className="h-6 w-6"
				 fill="none"
				 viewBox="0 0 24 24"
				 stroke="currentColor"
				 strokeWidth={2}
				>
					<path
					 strokeLinecap="round"
					 strokeLinejoin="round"
					 d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
					/>
				</svg>
			</IconBtn>
		);
	}
	else
	{
		download = 
		(
			<IconBtn disabled={true} title="Download non disponibile">
				<svg
				 xmlns="http://www.w3.org/2000/svg"
				 className="h-6 w-6"
				 fill="none"
				 viewBox="0 0 24 24"
				 stroke="currentColor"
				 strokeWidth={2}
				>
					<path
					 strokeLinecap="round"
					 strokeLinejoin="round"
					 d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
					/>
				</svg>
			</IconBtn>
		);
	}

	let votes = props.showVotes?
	(
		<Votes
		 contest={props.contest}
		 game={game?.id}
		 gamename={game?.name}
		/>
	)
	:
	(
		""
	);

	return (
		<div
		 className="rounded-lg shadow-lg bg-white overflow-hidden relative flex flex-col justify-between"
		 data-position={props?.position}
		>
			<div className="div-image">
				{img_url && 
				(
					<img
					 className="image-centered object-cover w-full md:h-52"
					 alt="thumbnail"
					 src={img_url}
					 layout={"fill"}
					 objectfit={"cover"}
					/>
				)}
			</div>
			<div className="p-6 flex flex-col flex-1 justify-start relative">
				{(props?.position <= 3 && props.showTrophy) &&
				(
					<div className="flex justify-center">
						<i
						 className=
						 {
							"fa fa-trophy p-2 -m-4 rounded-full text-2xl bg-white absolute top-0 " +
							(props.position === 1 ? "text-amber-300" : "") +
							(props.position === 2 ? "text-neutral-400" : "") +
							(props.position === 3 ? "text-red-400" : "")
						 }
						/>
					</div>
				)}

				<div className="h-24 overflow-hidden">
					<div className="text-2xl font-bold text-gray-900 text-center z-10">
						{game.name}
					</div>
					<div className="author text-sm text-gray-700 text-center">
						{" "}
						di {authors}
					</div>
				</div>
				<div className="text-gray-700 text-base mb-4">
					{game.short_description}
				</div>
			</div>
			<div className="p-6 flex justify-between items-center">
				{votes}
				{download}
			</div>
		</div>
	);
};
