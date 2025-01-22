import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import GMIApi from "../../src/api/GMIApi";
import { GameTile } from "./GameTile";
import Spinner from "../commons/Spinner";
import StyledButton from "../commons/StyledButton";


export default function GamesList(props)
{
	const { contest } = props;
	const router = useRouter();
	const [games, setGames] = useState();
	const [error, setError] = useState();
	const [showVotes, setShowVotes] = useState(false);
	const [judges, setJudges] = useState([]);


	useEffect(()=>
	{
		GMIApi.getInstance().getGames(contest, (data) =>
		{
			setGames(data.games);
			setShowVotes(data.public_results);
		});

		//cleanup on unmount
		return ()=> setGames(null);
	},
	[contest]); 

	useEffect(()=>
	{
		GMIApi.getInstance().getResults(contest, (results_data) =>
		{
			if(!results_data.success)
				setError(results_data.error || "invalid results");
			else 
				setJudges(results_data?.judges_data);
		});
	},
	[contest]);

	const isLoading = games == undefined;
	const areJudgesLoad = judges == undefined;
	const showTrophy = props.contestEnded;

	const formatJudges = (array)=>
	{
		const names = array.map((item)=> item.name);

		if(names.length === 0) return "";
		if(names.length === 1) return names[0];

		const allExceptLast = names.slice(0, -1).join(", ");
		const last = names[names.length - 1];

		return `${allExceptLast} e ${last}`;
	};

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
		<StyledButton
		 className="my-4"
		 onClick={()=> router.push("/results?contest=" + contest)}
		>
			Classifica Dettagliata
		</StyledButton>
	)

	return (
		<div>
			{areJudgesLoad?
			(
				<Spinner />
			)
			:
			(
				<p>
					<b>Giudici:</b> {formatJudges(judges)}
				</p>
			)}

			{actions}
			
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:gap-8 my-3 overflow-y-scroll">
				{isLoading ? <Spinner /> : elements}
			</div>
		</div>
	);
}
