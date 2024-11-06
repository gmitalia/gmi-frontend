import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import { authReducer } from "./slices/authSlice";
import { mainReducer } from "./slices/mainSlice";
import { createWrapper } from "next-redux-wrapper";

// initial states here
const initalState = {};
// creating store
export const store = configureStore({
    reducer: {
        auth: authReducer,
        main: mainReducer
    },
    middleware: getDefaultMiddlerware => getDefaultMiddlerware({serializableCheck: true}).concat(createLogger())
})

// assigning store to next wrapper
const makeStore = () => store;

export const wrapper = createWrapper(makeStore);