const BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const request = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");

    const config = {
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ message: "Something went wrong" }));
        throw new Error(
            error.message || `HTTP error! status: ${response.status}`,
        );
    }

    return response.json();
};

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authAPI = {
    login: (credentials) =>
        request("/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials),
        }),

    signup: (userData) =>
        request("/auth/signup", {
            method: "POST",
            body: JSON.stringify(userData),
        }),

    logout: () => request("/auth/logout", { method: "POST" }),

    fetchUser: (token) =>
        request("/auth/me", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        }),
};

// ─── Requests ─────────────────────────────────────────────────────────────────

export const requestsAPI = {
    // POST /requests — send a new event planning prompt
    createRequest: (prompt) =>
        request("/requests/ai-search", {
            method: "POST",
            body: JSON.stringify({ prompt }),
        }),

    // GET /requests — fetch history for authenticated user
    getHistory: () => request("/requests/history"),

    // GET /requests/:id — fetch a single request
    getRequest: (id) => request(`/requests/${id}`),

    // DELETE /requests/:id — delete a request from history
    deleteRequest: (id) => request(`/requests/${id}`, { method: "DELETE" }),
};
