import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import GMIApi from "../../src/api/GMIApi";
import { GameTile } from "./GameTile";
import Spinner from "../commons/Spinner";
import StyledButton from "../commons/StyledButton";
import { createPortal } from "react-dom";
import Link from "next/link";

export default function GamesList(props)
{
	const { contest } = props;
	const router = useRouter();
	/**@type {[Game[], (data: Game[])=> any]} */
	const [games, setGames] = useState();
	/**@type {[JudgeData[], (data: JudgeData[])=> any]} */
	const [judges, setJudges] = useState(undefined);
	const [error, setError] = useState();
	const [showVotes, setShowVotes] = useState(false);


	useEffect(()=>
	{
		GMIApi.getInstance().getGames(contest, (data) =>
		{
			setGames(data.games);
			setShowVotes(data.public_results);
		});

		//cleanup on unmount
		return ()=>{
			setGames(null);
			setJudges(undefined); // reset judges when contest changes
		};
	},
	[contest]); 

	useEffect(()=>
	{
		GMIApi.getInstance().getParticipants(contest, false, (data) =>
		{
			if(!data.success)
				setError(data.error || "invalid participants");
			else 
				setJudges(data?.participants
					.filter(part => part.kind == "1")
					.map(part => ({id: part.id, name: part.user_name, votes_count: 0})));
		});
	},
	[contest]);

	const isLoading = games == undefined;
	const areJudgesLoad = judges == undefined;
	const showTrophy = props.contestEnded;

	/**@type {(data: JudgeData)=> any} */
	const judgeTile = (judge)=>
	(
		<li key={judge.id}>
			<Link href={`/user?user=${judge.id}`}>
				<a><span className="text-blue-500 hover:underline cursor-pointer">{judge.name}</span></a>
			</Link>
		</li>
	)

	const elements = games?.map((game, i)=>
	(
		<GameTile
		 key={game.id}
		 contest={contest}
		 position={i + 1}
		 game={game}
		 showVotes={showVotes}
		 showTrophy={showTrophy}
		/>
	))

	const actions = showVotes && 
	(
		createPortal(
		(
			<StyledButton
			 onClick={()=> router.push("/results?contest=" + contest)}
			>
				Classifica Dettagliata
			</StyledButton>
		), document.querySelector("#results-portal"))
		
	)

	return (
		<div className="w-full h-full flex flex-col ">
			{areJudgesLoad?
			(
				<div className="flex flex-row">
					<b>Giudici:</b> 
				</div>
			)
			:
			(
				<div className="flex flex-row">
					<b>Giudici:</b> 
					<ul className="author">
						{judges.map(o=> judgeTile(o))}
					</ul>
				</div>
			)}

			{actions}
			
			<div className="flex-grow-v">
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:gap-8 my-3">
				{isLoading ? <Spinner /> : elements}
			</div>
			</div>
		</div>
	);
}
