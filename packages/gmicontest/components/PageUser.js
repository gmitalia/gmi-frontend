import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getQuery } from "../src/Utils";
import GMIApi from "../src/api/GMIApi";
import { PageLayout } from "./library/Layouts/PageLayout";
import IconBtn from "./commons/IconBtn";
import { basePath } from "../next.config";
import UserInventory from "./User/UserInventory";
import UserStats from "./User/UserStats";
import UserGames from "./User/UserGames";
import "moment/locale/it";


//@todo remove "visualizza voti" if not ended
export default function PageUser(props)
{
	let router = useRouter();
	let query = getQuery(router);

	let userInfo = useSelector(root => root.auth.userInfo);
	
	/**@type {[UserInfo, (obj: UserInfo)=> any]} */
	let [user, setUser] = useState();
	/**@type {[UserMedals, (obj: UserMedals)=> any]} */
	let [medals, setMedals] = useState();
	/**@type {[{[game_id: number]: Contest}, (obj: {[game_id: number]: Contest})=> any]} */
	let [contestInfo, setContestInfo] = useState();
	let [error, setError] = useState();

	
	let [editName, setEditName] = useState(false);
	let [name, setName] = useState("");

	const saveName = function(newName)
	{
		if(newName != user.user_name)
		{
			GMIApi.getInstance().setUserValues(user.user_id, newName, data=>
			{
				if(data.success)
				{
					user.user_name = newName;
				}
			});
		}
		else
		{
			console.log("same name, not updating")
		}
	}


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

				if(user.votes)
					user.votes = JSON.parse(user.votes)

				setUser(user);
				setName(user.user_name)
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
				
				{editName?
				(
					<>
						<input
						type="text"
						value={name}
						onChange={e=> setName(e.target.value)}
						style={
						{
							padding: "8px",
							border: "1px solid #ccc",
							borderRadius: "4px",
							outline: "none",
							fontSize: "16px",
						}}
						/>
						<IconBtn
						 padding="2px"
						 style={{marginTop: "auto"}}
						 onClick={()=>
						 {
							setEditName(false)
							saveName(name)
						 }}
						>
							<svg width="28px" height="28px" viewBox="0 0 24 24" fill="#ffffff">
								<path d="M16.0303 10.0303C16.3232 9.73744 16.3232 9.26256 16.0303 8.96967C15.7374 8.67678 15.2626 8.67678 14.9697 8.96967L10.5 13.4393L9.03033 11.9697C8.73744 11.6768 8.26256 11.6768 7.96967 11.9697C7.67678 12.2626 7.67678 12.7374 7.96967 13.0303L9.96967 15.0303C10.2626 15.3232 10.7374 15.3232 11.0303 15.0303L16.0303 10.0303Z"/>
								<path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12Z"/>
							</svg>
						</IconBtn>
					</>
				)
				:
				(
					<>
						<h2 className="text-2xl">{name}</h2>
					
						{userInfo?.user?.user_id == user.user_id &&
						(
							<IconBtn padding="2px" onClick={()=> setEditName(true)} style={{marginTop: "auto"}}>
								<svg fill="#ffffff" width="28px" height="28px" viewBox="0 0 56 56">
									<path d="M 27.9999 51.9063 C 41.0546 51.9063 51.9063 41.0781 51.9063 28 C 51.9063 14.9453 41.0312 4.0937 27.9765 4.0937 C 14.8983 4.0937 4.0937 14.9453 4.0937 28 C 4.0937 41.0781 14.9218 51.9063 27.9999 51.9063 Z M 27.9999 47.9219 C 16.9374 47.9219 8.1014 39.0625 8.1014 28 C 8.1014 16.9609 16.9140 8.0781 27.9765 8.0781 C 39.0155 8.0781 47.8983 16.9609 47.9219 28 C 47.9454 39.0625 39.0390 47.9219 27.9999 47.9219 Z M 36.9765 21.6250 L 38.6171 19.9609 C 39.3436 19.1875 39.4140 18.3672 38.7109 17.6875 L 38.2187 17.1719 C 37.5390 16.4922 36.6952 16.5625 35.9452 17.2890 L 34.2812 18.9297 Z M 20.6874 37.8437 L 35.6171 22.9609 L 32.9218 20.2890 L 18.0390 35.1484 L 16.7499 38.1719 C 16.5155 38.7344 17.0546 39.2031 17.5468 39.0156 Z"/>
								</svg>
							</IconBtn>
						)}
					</>
				)}



			</div>

			<div className="flex flex-col gap-3 p-5">
				
				<div className="h-full flex flex-col lg:flex-row">
			
				<img
				 className="m-auto"
				 style={{height: "250px"}}
				 src={basePath+"/img/profile.png"}
				/>

				<UserInventory
				 user={query.user}
				/>
				</div>
				
				<UserStats
				 userInfo={user}
				/>

				<UserGames
				 userInfo={user}
				/>
			</div>
		</PageLayout>
	);
}
