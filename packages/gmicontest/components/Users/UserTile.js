import React, { useState, useEffect } from "react";
import multiavatar from '@multiavatar/multiavatar/esm'
import Link from "next/link";

export const UserTile = (props) =>
{
	/**@type {User} */
	const user = props.user;
	const position = props.position;

	return (
		<Link href={`/user?user=${user.id}`}>
			<div
			 className="rounded-lg shadow-lg bg-white overflow-hidden relative flex flex-col justify-between cursor-pointer"
			 data-position={props?.position}
			>
				<div className="div-image">
					<div
					 style={{width: "85%"}}
					 className="m-auto"
					 dangerouslySetInnerHTML={{ __html: multiavatar("GM_USER_"+user.id) }}
					/>
				</div>

				<div className="p-6 flex flex-col flex-1 justify-start relative">
				
					<div className="overflow-hidden">
						<div className="text-2xl font-bold text-gray-900 text-center z-10">
							{user.name}
						</div>
					
					</div>
				</div>
			</div>
		</Link>
	);
};
