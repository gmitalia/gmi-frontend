import React, { useState, useEffect } from "react";
import multiavatar from '@multiavatar/multiavatar/esm'
import Link from "next/link";

export const UserTile = (props) =>
{
	/**@type {User} */
	const user = props.user;

	return (
		
			<div
			 className="rounded-lg shadow-lg bg-white overflow-hidden relative flex flex-col justify-between cursor-pointer grid grid-cols-[150px_repeat(4,_1fr)] items-center gap-x-4"
			 style={{width: "100%", height: "35px"}}
			>
				<div  style={{width: "80px"}} className="div-image">
					<div
					 style={{height: "100%", aspectRatio: "1/1"}}
					 className="m-auto"
					 dangerouslySetInnerHTML={{ __html: multiavatar("GM_USER_"+user.id) }}
					/>
				</div>

				<div style={{width: "50%"}}>
					{user.name}
				</div>
				

				<div style={{width: "20%"}}>
					{user.game_count}
				</div>
				
				<div style={{width: "20%"}}>
					{user.top_game_count}
				</div>

				<div style={{width: "20%"}}>
					{user.judge_count}
				</div>
			</div>
	);
};
