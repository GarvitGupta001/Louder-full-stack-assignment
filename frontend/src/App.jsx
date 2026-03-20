import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./store/slices/authSlice";
import LoginPage from "./pages/LogIn";
import SignupPage from "./pages/SignUp";
import DashboardPage from "./pages/Dashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useEffect } from "react";

export default function App() {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCurrentUser());
        }
    }, [dispatch, isAuthenticated]);

    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}
