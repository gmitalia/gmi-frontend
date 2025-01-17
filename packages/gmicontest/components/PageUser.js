import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getQuery } from "../src/Utils";
import GMIApi from "../src/api/GMIApi";
import { PageLayout } from "./library/Layouts/PageLayout";
import IconBtn from "./commons/IconBtn";
import "moment/locale/it";


//@todo remove "visualizza voti" if not ended
export default function PageUser(props)
{
	let router = useRouter();
	let query = getQuery(router);
	
	/**@type {[User, (obj: User)=> any]} */
	let [user, setUser] = useState();
	let [error, setError] = useState();


	useEffect(()=>
	{
		//fetch contest
		console.debug("fetching user", query.user);
		GMIApi.getInstance().getUserInfo(query.user, (data) =>
		{
			if(data.success)
				setUser(data.users[0]);
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
				<h2 className="text-2xl">{user.name}</h2>
			</div>
		</PageLayout>
	);
}
