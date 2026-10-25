import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import { authReducer } from "./slices/authSlice";
import { mainReducer } from "./slices/mainSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    main: mainReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: true }).concat(
      process.env.NODE_ENV === "development" ? [createLogger()] : []
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
