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
	const [search, setSearch] = useState("");
	const [sorting, setSort] = useState({sortingId: null, sort:{}});
	const [userList, setUserList] = useState([]);


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

	/**@type {(a: User, b: User)=> number} */
	const sortingFunction = (a, b)=>
	{
		if(sorting.sortingId == 0)
		{
			if(sorting.sort[0])
				return a.name.localeCompare(b.name)
			else
			 return b.name.localeCompare(a.name)
		}
		if(sorting.sortingId == 1)
		{
			if(sorting.sort[1])
				return parseInt(a.game_count) - parseInt(b.game_count)
			else
				return parseInt(b.game_count) - parseInt(a.game_count)
		}
		if(sorting.sortingId == 2)
		{
			if(sorting.sort[2])
				return parseInt(a.top_game_count) - parseInt(b.top_game_count)
			else
				return parseInt(b.top_game_count) - parseInt(a.top_game_count)
		}
		if(sorting.sortingId == 3)
		{
			if(sorting.sort[2])
				return parseInt(a.judge_count) - parseInt(b.judge_count)
			else
				return parseInt(b.judge_count) - parseInt(a.judge_count)
		}

		if(sorting.sortingId == null)
			return parseInt(a.id) - parseInt(b.id)
	}

	useEffect(()=>
	{
		if(users)
		{
			let elements = users.slice();

			if(search != "")
				elements = elements.filter(o=> o.name.toLowerCase().includes(search.toLowerCase()))

			if(sorting.sortingId != null)
				elements = elements.sort(sortingFunction)

			elements = elements.map((user, i)=>
			(
				<UserTile
				 key={i}
				 user={user}
				 position={i + 1}
				/>
			))

			setUserList(elements)
		}
	}, [users, sorting,  search])


	const updateSort = function(index)
	{
		sorting.sort[index] = !sorting.sort[index]
		setSort({sortingId: index, sort: sorting.sort})
	}

	return (
		<div>
			<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
			<input
				type="text"
				value={search}
				onChange={e=> setSearch(e.target.value)}
				placeholder="Cerca..."
				style={
				{
					width: "100%",
					padding: "8px",
					border: "1px solid #ccc",
					borderRadius: "4px",
					outline: "none",
					fontSize: "16px",
				}}
			/>
		</div>
		
		<div className="grid gap-y-2 my-3">
			<div className="grid grid-cols-[45px_1fr_50px_50px_50px] lg:grid-cols-[45px_repeat(4,_1fr)] items-center gap-x-4">
				<div className="font-bold"></div>
				<div className="font-bold cursor-pointer lg:text-full text-truncate" onClick={()=> updateSort(0)}>Username</div>
				<div className="font-bold cursor-pointer lg:text-full text-truncate" onClick={()=> updateSort(1)}>Partecipazioni</div>
				<div className="font-bold cursor-pointer lg:text-full text-truncate" onClick={()=> updateSort(2)}>Vittorie</div>
				<div className="font-bold cursor-pointer lg:text-full text-truncate" onClick={()=> updateSort(3)}>Giudizi</div>
			</div>
				{isLoading ? <Spinner /> : userList}
			</div>
		</div>
	);
}
