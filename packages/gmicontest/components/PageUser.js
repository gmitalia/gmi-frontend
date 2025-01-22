import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getQuery } from "../src/Utils";
import GMIApi from "../src/api/GMIApi";
import { PageLayout } from "./library/Layouts/PageLayout";
import IconBtn from "./commons/IconBtn";
import "moment/locale/it";
import { GameTile } from "./Contest/GameTile";
import Link from "next/link";
import { MedalsInfo } from "../src/Medals";


//@todo remove "visualizza voti" if not ended
export default function PageUser(props)
{
	let router = useRouter();
	let query = getQuery(router);
	
	/**@type {[UserInfo, (obj: UserInfo)=> any]} */
	let [user, setUser] = useState();
	/**@type {[UserMedals, (obj: UserMedals)=> any]} */
	let [medals, setMedals] = useState();
	/**@type {[{[game_id: number]: Contest}, (obj: {[game_id: number]: Contest})=> any]} */
	let [contestInfo, setContestInfo] = useState();
	let [error, setError] = useState();


	useEffect(()=>
	{
		//fetch contest
		console.debug("fetching user", query.user);
		GMIApi.getInstance().getUserInfo(query.user, (data) =>
		{
			console.log(data)
			if(data.success)
			{
				let user = data.users[0];

				if(user.games)
					user.games = JSON.parse(user.games)

				setUser(user);
			}
			else
				setError(data.error || "invalid contest");
		});
	},
	[query.user]); 



	useEffect(()=>
	{
		//fetch contest
		console.debug("fetching user medals", query.user);
		GMIApi.getInstance().getUserMedals(query.user, (data) =>
		{
			if(data.success)
			{
				let medals = data.medals[0];
				
				Object.entries(medals).forEach(o=>
				{
					medals[o[0]] = o[1] == "1"? true : false
				})
				setMedals(medals);
			}
			else
				setError(data.error || "invalid contest");
		});
	},
	[query.user]); 

	if(error)
		return (
			<div>
				<div>ERROR: {error}</div>
			</div>
		);


	if(!user) 
		return <div>Loading</div>;
	if(!medals) 
		return <div>Loading</div>;

	if(contestInfo == undefined)
	{
		let len = user.games.length;
		let contestInfo = {}
		user.games?.forEach((game, i)=>
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

	user.games.sort((a,b)=> a.contest_id - b.contest_id)

	const elements = user.games?.map((game, i)=>
	{
		let contest = contestInfo[game.id]

		return(
			<div key={i} className="flex flex-col items-center">

				<a href={`/contest?contest=${contest.id}`}>
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

	const statistics = 
	[
		{
			icon: "🏆",
			name: "Partecipazioni",
			value: user.games.length,
		},
		
		{
			icon: "🏅",
			name: "Podi",
			value: user.games.filter(o=> o.placement < 4 && o.placement != 0).length,
		},
		
		{
			icon: "🥇",
			name: "Vittorie",
			value: user.games.filter(o=> o.placement == 1).length,
		},
		
		{
			icon: "🤝",
			name: "Collaborazioni",
			value: user.games.filter(o=> JSON.parse(Buffer.from(o.authors, "base64").toString("ascii")).length > 1).length,
		}
	]

	return (
		<PageLayout>
			<div className="flex justify-start gap-4 items-center">
				<IconBtn onClick={() => router.back()}>
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
							d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
						/>
					</svg>
				</IconBtn>
				<h2 className="text-2xl">{user.user_name}</h2>
			</div>

			<div className="flex flex-col gap-3 p-5">
				
				
				<fieldset className="p-5 border-2 border-gray">
				<legend className="px-4 text-2xl">Statistiche</legend>
					
					<div className="flex flex-row justify-evenly gap-20">
						{statistics.map((stat, index)=>
						(
							<div key={index} className="flex flex-col items-center">
								<div className="font-bold text-xl">{stat.icon}</div>
								<div className="font-bold text-xl">{stat.name}</div>
								<div className="text-xl">{stat.value}</div>
							</div>
						))}
					</div>

				</fieldset>

				<fieldset className="p-5 border-2 border-gray">
				<legend className="px-4 text-2xl">Medagliere</legend>
					
					<div className="flex flex-row flex-wrap justify-evenly gap-20">
						{Object.entries(medals).map((medal, index)=>
						(
							medal[1] &&
							(
								<div key={index} className="flex flex-col items-center">
									{console.log(medal, MedalsInfo)}
									<img
									 style={{width: "80px"}}
									 src={MedalsInfo[medal[0]].image}
									 title={MedalsInfo[medal[0]].name}
									/>
								</div>
							)
						))}
					</div>

				</fieldset>

				<fieldset className="p-5 border-2 border-gray">
				<legend className="px-4 text-2xl">Giochi</legend>
					<div className="flex grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:gap-8 my-3 overflow-y-scroll">
						{elements}
					</div>
				</fieldset>
			</div>
		</PageLayout>
	);
}
