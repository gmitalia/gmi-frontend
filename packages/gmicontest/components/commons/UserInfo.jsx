import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { authAsyncThunk } from "../../src/slices/authAsyncThunk";
import GMIApi from "../../src/api/GMIApi";
import { ButtonSecondary } from "../library/Buttons/ButtonSecondary";

export const UserInfo = ()=>
{
	/**@type {{user: AccountInfo, success: boolean}} */
	let userInfo = useSelector(root => root.auth.userInfo);

	const dispatch = useDispatch();

	useEffect(()=>
	{
		dispatch(authAsyncThunk.getMe())
	}, [])

	const logoutOnClick = ()=>
	{
		dispatch(authAsyncThunk.logout())
	}

	const loginOnClick = ()=>
	{
		dispatch(authAsyncThunk.login())
	}

	const user = userInfo && userInfo.success ? userInfo.user : undefined;

	if(user)
	{
		let avatar_url = GMIApi.getInstance().getAvatarUrl(user.discord_info);

		let forum_link = "";
		if(user.forum_id)
			forum_link = <span>(<a href={GMIApi.getInstance().forumProfileURL + user.forum_id}>forum</a>)</span>;

		return (
			<div className="flex flex-row items-center">

				<a href={`/user?user=${user.user_id}`} className="flex flex-row">
					<img src={avatar_url} className="w-12 h-12" alt="" priority="false" />

					<b className="mx-2 my-auto">
						{user.discord_info.username}
					</b>
				</a>

				{forum_link}
				
				<ButtonSecondary title="Logout" onClick={logoutOnClick} />
			</div>
		)
	}
	else
	{
		return (
			<div>
				<ButtonSecondary title="Login" onClick={loginOnClick} />
			</div>
		);
	}
}