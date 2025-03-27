import React, { useState, useEffect } from "react";
import GMIApi from "../../src/api/GMIApi";
import { GameTile } from "../Contest/GameTile";
import "moment/locale/it";
import Link from "next/link";


//@todo remove "visualizza voti" if not ended
export default function UserVotes(props)
{
	/**@type {UserInfo} */
	const userInfo = props.userInfo

	/**@type {[{[game_id: number]: Contest}, (obj: {[game_id: number]: Contest})=> any]} */
	let [contestInfo, setContestInfo] = useState();

	if(userInfo.votes == undefined || userInfo.votes.length == 0)
		return <div></div>

	if(contestInfo == undefined)
	{
		let len = userInfo.votes.length;
		let contestInfo = {}
		
		userInfo.votes?.forEach((vote, i)=>
		{
			GMIApi.getInstance().getContest(vote.contest_id, data=>
			{
				if(data.success)
					contestInfo[vote.contest_id] = data.contests[0]

				if(Object.keys(contestInfo).length == len)
					setContestInfo(contestInfo)
			})
		})
	}

	if(!contestInfo) 
		return <div>Loading</div>;


	userInfo.votes.sort((a,b)=> a.contest_id - b.contest_id)

	const elements = userInfo.votes?.map((vote, i)=>
	{
		let contest = contestInfo[vote.contest_id]

		return(
			<div
			 key={i}
			 className="w-full h-full rounded-lg shadow-lg bg-white overflow-hidden relative flex flex-col px-3 py-6 justify-between"
			>
				<div className="flex flex-col items-center">

					<Link href={`/contest?contest=${contest?.id}`}>
					<a>	<div className="font-bold text-black-500 hover:underline cursor-pointer">
							{contest?.name ?? "."}
						</div></a>
					</Link>

				</div>
			</div>
		)
	})


	return (
		<fieldset className="w-full p-5 border-2 border-gray">
		<legend className="px-4 text-2xl">Giudizi</legend>
			<div className="flex grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:gap-8 my-3 p-3 overflow-y-hidden">
				{elements}
			</div>
		</fieldset>
	);
}
