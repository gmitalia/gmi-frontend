import React, { useState, useEffect } from "react";
import "moment/locale/it";


//@todo remove "visualizza voti" if not ended
export default function UserStats(props)
{
	/**@type {UserInfo} */
	const userInfo = props.userInfo
	
	if(!userInfo)
		return <div></div>


	const statistics = 
	[
		{
			icon: "🏆",
			name: "Partecipazioni",
			value: userInfo.games.length,
		},
		{
			icon: "🥇",
			name: "Vittorie",
			value: userInfo.games.filter(o=> o.placement == 1).length,
		},
		{
			icon: "🏅",
			name: "Podi",
			value: userInfo.games.filter(o=> o.placement < 4 && o.placement != 0).length,
		},
		{
			icon: "🤝",
			name: "Collaborazioni",
			value: userInfo.games.filter(o=> JSON.parse(Buffer.from(o.authors, "base64").toString("ascii")).length > 1).length,
		},
		{
			icon: "⚖️",
			name: "Giudizi",
			value: userInfo.votes?.length ?? 0,
		}
	]

	return (
		<fieldset className="p-5 border-2 border-gray">
		<legend className="px-4 text-2xl">Statistiche</legend>
			
			<div className="flex flex-row flex-wrap justify-evenly gap-10 lg:gap-20">
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
	);
}
