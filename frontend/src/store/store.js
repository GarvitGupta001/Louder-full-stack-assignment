import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import requestsReducer from "./slices/requestSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        requests: requestsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types for non-serializable checks
                ignoredActions: [
                    "auth/login/fulfilled",
                    "auth/signup/fulfilled",
                ],
            },
        }),
});

export default store;
