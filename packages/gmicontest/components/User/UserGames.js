import React, { useState, useEffect } from "react";
import GMIApi from "../../src/api/GMIApi";
import { GameTile } from "../Contest/GameTile";
import "moment/locale/it";


//@todo remove "visualizza voti" if not ended
export default function UserGames(props)
{
	/**@type {UserInfo} */
	const userInfo = props.userInfo

	/**@type {[{[game_id: number]: Contest}, (obj: {[game_id: number]: Contest})=> any]} */
	let [contestInfo, setContestInfo] = useState();
	let [error, setError] = useState();


	if(contestInfo == undefined)
	{
		let len = userInfo.games.length;
		let contestInfo = {}
		userInfo.games?.forEach((game, i)=>
		{
			GMIApi.getInstance().getContest(game.contest_id, data=>
			{
				if(data.success)
					contestInfo[game.id] = data.contests[0]

				if(Object.keys(contestInfo).length == len)
					setContestInfo(contestInfo)
			})
		})
	}

	if(!contestInfo) 
		return <div>Loading</div>;

	userInfo.games.sort((a,b)=> a.contest_id - b.contest_id)

	const elements = userInfo.games?.map((game, i)=>
	{
		let contest = contestInfo[game.id]

		return(
			<div key={i} className="flex flex-col items-center">

				<a href={`/contest?contest=${contest?.id}`}>
					<div className="font-bold text-black-500 hover:underline cursor-pointer">
						{contest?.name ?? "."}
					</div>
				</a>

				<GameTile
				 key={game.id}
				 contest={game.contest_id}
				 position={game.placement}
				 game={game}
				 showVotes={true}
				 showTrophy={true}
				/>
			</div>
		)
	})


	return (
		<fieldset className="p-5 border-2 border-gray">
		<legend className="px-4 text-2xl">Giochi</legend>
			<div className="flex grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:gap-8 my-3 p-3 overflow-y-hidden">
				{elements}
			</div>
		</fieldset>
	);
}
