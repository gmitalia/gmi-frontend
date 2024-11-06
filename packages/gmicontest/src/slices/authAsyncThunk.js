import { createAsyncThunk } from "@reduxjs/toolkit";
import GMIApi from "./../api/GMIApi";

const getMe = createAsyncThunk("getme", async () => {
    const response = await GMIApi.getInstance().getMe();
    return response;
})

const login = createAsyncThunk("login", async () => {
    const response = await GMIApi.getInstance().login()

    return response;
})

const logout = createAsyncThunk("logout", async () => {
    const response = await GMIApi.getInstance().logout()

    return response;
})

const authAsyncThunk = {
    getMe,
    login,
    logout
}

export { authAsyncThunk }