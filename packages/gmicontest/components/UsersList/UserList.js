import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import GMIApi from "../../src/api/GMIApi";
import Spinner from "../commons/Spinner";
import { UserTile } from "./UserTile";

const sortingId = 
{
	"default": 0,
	"name": 1,
	"game_count": 2,
	"top_game_count": 3,
	"judge_count": 4,
}
export default function UserList(props)
{
	const router = useRouter();

	/**@type {[User[], (User)=> any]} */
	const [users, setUsers] = useState();
	const [error, setError] = useState();
	const [search, setSearch] = useState("");
	const [sorting, setSort] = useState({sortingId: sortingId.default, sort:{[sortingId.default]: true}});
	const [userList, setUserList] = useState([]);


	useEffect(()=>
	{
		GMIApi.getInstance().getUsers((data) =>
		{
			if(!data.success)
				setError(data.error || "invalid results");
			else 
			{
				for(let i=data.users.length-1; i>-1; i--)
				{
					let user = data.users[i]

					if(user.game_count == "0" && user.judge_count == "0")
						data.users.splice(i, 1)
				}
				setUsers(data.users);
			}
		});
	}, []);


	const isLoading = users == undefined;

	/**@type {(a: User, b: User)=> number} */
	const sortingFunction = (a, b)=>
	{
		if(sorting.sortingId == sortingId.default)
		{
			let aGame = parseInt(a.game_count)*1;
			let aTop = parseInt(a.top_game_count)* 3;
			let aJudge = parseInt(a.judge_count)*1;

			let bGame = parseInt(b.game_count)*1;
			let bTop = parseInt(b.top_game_count)*3;
			let bJudge = parseInt(b.judge_count)*1;

			if(sorting.sort[sorting.sortingId])
				return  (bGame + bTop + bJudge) - (aGame + aTop + aJudge)
			else
				return (aGame + aTop + aJudge) - (bGame + bTop + bJudge)
		}
		if(sorting.sortingId == sortingId.name)
		{
			if(sorting.sort[sorting.sortingId])
				return a.name.localeCompare(b.name)
			else
			 	return b.name.localeCompare(a.name)
		}
		if(sorting.sortingId == sortingId.game_count)
		{
			if(sorting.sort[sorting.sortingId])
				return parseInt(a.game_count) - parseInt(b.game_count)
			else
				return parseInt(b.game_count) - parseInt(a.game_count)
		}
		if(sorting.sortingId == sortingId.top_game_count)
		{
			if(sorting.sort[sorting.sortingId])
				return parseInt(a.top_game_count) - parseInt(b.top_game_count)
			else
				return parseInt(b.top_game_count) - parseInt(a.top_game_count)
		}
		if(sorting.sortingId == sortingId.judge_count)
		{
			if(sorting.sort[sorting.sortingId])
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
			else
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
		<div className="h-full flex flex-col">
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
		
		<div className="grid gap-y-2 my-1">
			<div style={{height: "35px"}} className="grid grid-cols-[45px_1fr_50px_50px_50px] lg:grid-cols-[45px_repeat(4,_1fr)] items-center gap-x-4">

				<div className="font-bold cursor-pointer flex flex-col items-center" onClick={()=> updateSort(sortingId.default)}>
				<i className={"fas "+(sorting.sort[sortingId.default]? "fa-caret-up" : "fa-caret-down")}></i>
				</div>

				<div className="font-bold cursor-pointer lg:text-full text-truncate flex gap-2 items-center" onClick={()=> updateSort(sortingId.name)}>
					Username
					<i className={"fas "+(sorting.sort[sortingId.name]? "fa-caret-up" : "fa-caret-down")}></i>
				</div>

				<div className="font-bold cursor-pointer lg:text-full text-truncate flex gap-2 items-center" onClick={()=> updateSort(sortingId.game_count)}>
					Partecipazioni
					<i className={"fas "+(sorting.sort[sortingId.game_count]? "fa-caret-up" : "fa-caret-down")}></i>
				</div>

				<div className="font-bold cursor-pointer lg:text-full text-truncate flex gap-2 items-center" onClick={()=> updateSort(sortingId.top_game_count)}>
					Vittorie
					<i className={"fas "+(sorting.sort[sortingId.top_game_count]? "fa-caret-up" : "fa-caret-down")}></i>
				</div>

				<div className="font-bold cursor-pointer lg:text-full text-truncate flex gap-2 items-center" onClick={()=> updateSort(sortingId.judge_count)}>
					Giudizi
					<i className={"fas "+(sorting.sort[sortingId.judge_count]? "fa-caret-up" : "fa-caret-down")}></i>
				</div>
			</div>
		</div>
		<div className="grid gap-y-2 my-3 overflow-y-scroll">
				{isLoading ? <Spinner /> : userList}
			</div>
		</div>
	);
}
