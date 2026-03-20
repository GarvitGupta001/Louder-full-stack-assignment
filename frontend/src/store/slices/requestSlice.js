import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { requestsAPI } from "../../services/api";

// ─── Thunks ───────────────────────────────────────────────────────────────────

// Submit a new prompt → returns the AI response object directly
// { venue_name, location, estimated_cost, justification }
export const submitPrompt = createAsyncThunk(
    "requests/submit",
    async (prompt, { rejectWithValue }) => {
        try {
            const data = await requestsAPI.createRequest(prompt);
            return { prompt, response: data.data.response }; // store prompt alongside AI response
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

// Fetch lightweight history list
// [{ id, prompt, createdAt }, ...]
export const fetchHistory = createAsyncThunk(
    "requests/fetchHistory",
    async (_, { rejectWithValue }) => {
        try {
            return await requestsAPI.getHistory();
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

// Fetch full detail for a single history item by id
// Returns full object with response: { venue_name, location, estimated_cost, justification }
export const fetchRequestDetail = createAsyncThunk(
    "requests/fetchDetail",
    async (id, { rejectWithValue }) => {
        try {
            return await requestsAPI.getRequest(id);
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

// Delete a request by id
export const deleteRequest = createAsyncThunk(
    "requests/delete",
    async (id, { rejectWithValue }) => {
        try {
            await requestsAPI.deleteRequest(id);
            return id;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const requestsSlice = createSlice({
    name: "requests",
    initialState: {
        // Current AI response after a fresh submit
        current: null, // { prompt, response: { venue_name, location, estimated_cost, justification } }

        // Lightweight history list from GET /requests
        history: [], // [{ id, prompt, createdAt }]

        // Full detail fetched on-demand when a history item is clicked
        // Keyed by id so multiple can be cached: { [id]: { ...fullDetail } }
        detailCache: {},

        // Which history item is currently "expanded" / selected
        selectedId: null,

        loading: false, // submit loading
        historyLoading: false,
        detailLoadingId: null, // id of the item currently being fetched
        error: null,
        detailError: null,
    },
    reducers: {
        clearCurrent: (state) => {
            state.current = null;
        },
        clearError: (state) => {
            state.error = null;
            state.detailError = null;
        },
        setSelectedId: (state, action) => {
            // Toggle off if clicking the same item
            state.selectedId =
                state.selectedId === action.payload ? null : action.payload;
            state.detailError = null;
        },
    },
    extraReducers: (builder) => {
        // ── Submit ──
        builder
            .addCase(submitPrompt.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.current = null;
            })
            .addCase(submitPrompt.fulfilled, (state, action) => {
                state.loading = false;

                const result = action.payload;
                result.id = crypto.randomUUID(); // temporary id until we fetch real history

                state.current = result;

                state.history.unshift({
                    id: result.id,
                    prompt: result.prompt,
                    createdAt: result.createdAt,
                });

                state.detailCache[result.id] = result;
            })
            .addCase(submitPrompt.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ── Fetch history ──
        builder
            .addCase(fetchHistory.pending, (state) => {
                state.historyLoading = true;
                state.error = null;
            })
            .addCase(fetchHistory.fulfilled, (state, action) => {
                state.historyLoading = false;
                state.history = action.payload.data; // [{ id, prompt, createdAt }]
            })
            .addCase(fetchHistory.rejected, (state, action) => {
                state.historyLoading = false;
                state.error = action.payload;
            });

        // ── Fetch detail ──
        builder
            .addCase(fetchRequestDetail.pending, (state, action) => {
                state.detailLoadingId = action.meta.arg; // the id being fetched
                state.detailError = null;
            })
            .addCase(fetchRequestDetail.fulfilled, (state, action) => {
                state.detailLoadingId = null;
                const detail = action.payload.data;
                state.detailCache[detail.id] = detail;
            })
            .addCase(fetchRequestDetail.rejected, (state, action) => {
                state.detailLoadingId = null;
                state.detailError = action.payload;
            });

        // ── Delete ──
        builder.addCase(deleteRequest.fulfilled, (state, action) => {
            const id = action.payload;
            state.history = state.history.filter((r) => r.id !== id);
            delete state.detailCache[id];
            if (state.selectedId === id) state.selectedId = null;
        });
    },
});

export const { clearCurrent, clearError, setSelectedId } =
    requestsSlice.actions;
export default requestsSlice.reducer;
