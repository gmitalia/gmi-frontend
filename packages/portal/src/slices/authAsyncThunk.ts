import { createAsyncThunk } from "@reduxjs/toolkit";
import GMIApi from "./../api/GMIApi";

const getMe = createAsyncThunk("getme", async () =>
{
  const response = await GMIApi.getInstance().getMe();
  return response;
})

const login = createAsyncThunk("login", async () =>
{
  // login() fa un redirect del browser, la promise non si completa
  GMIApi.getInstance().login()
})

const logout = createAsyncThunk("logout", async () =>
{
  const response = await GMIApi.getInstance().logout()
  return response;
})

const exchangeCode = createAsyncThunk("exchangeCode", async (code) =>
{
  const response = await GMIApi.getInstance().exchangeCode(code)
  return response;
})

const authAsyncThunk = {
  getMe,
  login,
  logout,
  exchangeCode,
}

export { authAsyncThunk }
