import React, { useState, useEffect } from "react";
import { basePath } from "../../next.config";

export const UserTile = (props) =>
{
	/**@type {User} */
	const user = props.user;

	return (
	
			<a
			 href={`/user?user=${user.id}`}
			 className="rounded-lg shadow-lg bg-white overflow-hidden relative flex flex-col justify-between cursor-pointer grid grid-cols-[45px_1fr_50px_50px_50px] lg:grid-cols-[45px_repeat(4,_1fr)]  items-center gap-x-4"
			 style={{width: "100%", height: "35px"}}
			>
				<div  style={{height: "35px", aspectRatio: "1/1"}}>
					<img
					 style={{borderRadius: "50px", height: "35px", width: "35px",}}
					 src={user.avatar ?? basePath+"/img/profile.png"}
					/>
				</div>

				<div style={{width: "100%"}}>
					{user.name}
				</div>

				<div style={{width: "100%"}}>
					{user.game_count}
				</div>
				
				<div style={{width: "100%"}}>
					{user.top_game_count}
				</div>

				<div style={{width: "100%%"}}>
					{user.judge_count}
				</div>
			</a>
	);
};
