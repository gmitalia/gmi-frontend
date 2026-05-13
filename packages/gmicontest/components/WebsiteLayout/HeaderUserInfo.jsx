import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { authAsyncThunk } from "../../src/slices/authAsyncThunk";
import GMIApi from "../../src/api/GMIApi";
import { basePath } from "../../next.config";
import { LogOutIcon } from "../commons/Icons";
import { Button } from "../commons/Button";
import Link from "next/link";

export const HeaderUserInfo = ()=>
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
		let avatar_url = GMIApi.getInstance().getAvatarUrl(user.discord_info) || basePath + "/img/profile.png";

		let forum_link = "";
		if(user.forum_id)
			forum_link = <span>(<a href={GMIApi.getInstance().forumProfileURL + user.forum_id}>forum</a>)</span>;

		const displayName = user.user_name || user.discord_info?.username || "Utente";

		return (
			<div className="flex flex-row items-center gap-4">
				<Link href={`/user?user=${user.user_id}`} >
					<a className="group flex items-center gap-2.5 bg-content/5 hover:bg-content/10 border-default rounded-full pl-1 pr-4 py-1 transition-all">
						<div className="relative flex-shrink-0">
							<img
								src={avatar_url}
								className="w-8 h-8 rounded-full object-cover border-default group-hover:border-secondary/50 transition-all shadow-md"
								alt={displayName}
							/>
						</div>

						<span className="text-sm font-bold text-content-muted group-hover:text-content transition-colors truncate max-w-[120px]">
							{displayName}
						</span>
					</a>
				</Link>

				<Button variant="ghost" size="icon" onClick={logoutOnClick} title="Logout" className="hidden sm:inline-flex !rounded-lg !text-content-muted hover:!text-error hover:!bg-error/10">
					<LogOutIcon size={18} />
				</Button>
			</div>
		)
	}
	else
	{
		return (
			<div>
				<Button variant="secondary" size="md" onClick={loginOnClick}>Login</Button>
			</div>
		);
	}
}