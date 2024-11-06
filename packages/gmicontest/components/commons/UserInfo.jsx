import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { authAsyncThunk } from "../../src/slices/authAsyncThunk";
import GMIApi from "../../src/api/GMIApi";
import { ButtonSecondary } from "../library/Buttons/ButtonSecondary";

export const UserInfo = () => {

    let userInfo = useSelector(root => root.auth.userInfo);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(authAsyncThunk.getMe())
    }, [])

    const logoutOnClick = () => {
        dispatch(authAsyncThunk.logout())
    }

    const loginOnClick = () => {
        dispatch(authAsyncThunk.login())
    }

    const user = userInfo && userInfo.success ? userInfo.user : undefined;
    if (user) {
        let avatar_url = GMIApi.getInstance().getAvatarUrl(user.discord_info);

        let forum_link = "";
        if (user.forum_id)
            forum_link = <span>(<a href={GMIApi.getInstance().forumProfileURL + user.forum_id}>forum</a>)</span>;

        return (
            <div className="flex flex-row items-center">
                <img className="w-12 h-12" alt="" src={avatar_url} priority="false" />
                <b className="mx-2">{user.discord_info.username}</b>
                {forum_link}
                <ButtonSecondary title="Logout" onClick={logoutOnClick} />
            </div>
        )
    }
    else {
        return (
            <div>
                <ButtonSecondary title="Login" onClick={loginOnClick} />
            </div>
        );
    }
}