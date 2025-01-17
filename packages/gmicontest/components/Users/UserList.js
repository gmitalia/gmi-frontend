import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import GMIApi from "../../src/api/GMIApi";
import Spinner from "../commons/Spinner";
import { UserTile } from "./UserTile";


export default function UserList(props)
{
	const router = useRouter();

	/**@type {[User[], (User)=> any]} */
	const [users, setUsers] = useState();
	const [error, setError] = useState();


	useEffect(()=>
	{
		GMIApi.getInstance().getUsers((data) =>
		{
			if(!data.success)
				setError(data.error || "invalid results");
			else 
				setUsers(data.users);
		});
	}, []);


	const isLoading = users == undefined;


	const elements = users?.map((user, i)=>
	(
		<UserTile
		 key={i}
		 user={user}
		 position={i + 1}
		/>
	))


	return (
		<div>
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5 2xl:gap-8 my-3">
				{isLoading ? <Spinner /> : elements}
			</div>
		</div>
	);
}
