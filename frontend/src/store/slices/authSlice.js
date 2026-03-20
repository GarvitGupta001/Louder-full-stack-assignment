import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "../../services/api";

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await authAPI.login(credentials);
            localStorage.setItem("token", data.token);
            return data; // { token, user: { _id, name, email } }
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

export const signupUser = createAsyncThunk(
    "auth/signup",
    async (userData, { rejectWithValue }) => {
        try {
            const data = await authAPI.signup(userData);
            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await authAPI.logout().catch(() => {}); // Fire-and-forget
            localStorage.removeItem("token");
        } catch (err) {
            localStorage.removeItem("token");
            return rejectWithValue(err.message);
        }
    },
);

export const fetchCurrentUser = createAsyncThunk(
    "auth/fetchCurrentUser",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return rejectWithValue("No token found");
            }
            const data = await authAPI.fetchUser(token);
            return data; // { _id, name, email }
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const token = localStorage.getItem("token");

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: token || null,
        isAuthenticated: !!token,
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.data.user;
                state.token = action.payload.data.token;
                localStorage.setItem("token", action.payload.data.token);
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Signup
        builder
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Logout
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
        });

        // Fetch current user
        builder
            .addCase(fetchCurrentUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.data;
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
