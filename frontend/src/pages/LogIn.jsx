import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../store/slices/authSlice";

export default function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((s) => s.auth);
    const [form, setForm] = useState({ email: "", password: "" });

    useEffect(() => {
        if (isAuthenticated) navigate("/dashboard", { replace: true });
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleChange = (e) =>
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(form));
    };

    return (
        <div className="min-h-screen bg-[#080b12] flex overflow-hidden relative">
            {/* Background orbs */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute w-125 h-125 rounded-full bg-blue-600 opacity-[0.15] blur-[120px] -top-36 -left-24 animate-pulse" />
                <div className="absolute w-87.5 h-87.5 rounded-full bg-violet-600 opacity-[0.15] blur-[100px] -bottom-24 right-1/3" />
                <div className="absolute w-70 h-70 rounded-full bg-blue-700 opacity-[0.15] blur-[90px] top-1/2 -right-16" />
                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage:
                            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />
            </div>

            {/* Left panel */}
            <div className="relative z-10 hidden lg:flex flex-[1.1] flex-col px-16 py-12 border-r border-white/5">
                <div className="flex items-center gap-2 font-bold text-lg text-white">
                    <span className="text-indigo-400 text-xl">◈</span>
                    <span>Eventis</span>
                </div>
                <div className="mt-auto pb-14">
                    <p className="text-[10.5px] font-semibold tracking-[0.22em] text-indigo-400 uppercase mb-5">
                        AI-Powered Event Planning
                    </p>
                    <h1 className="font-serif text-5xl font-bold leading-[1.1] text-slate-100 tracking-tight mb-6">
                        Plan perfect
                        <br />
                        events with
                        <br />
                        <span className="text-indigo-400 italic">
                            intelligence
                        </span>
                    </h1>
                    <p className="text-sm leading-relaxed text-white/40 max-w-sm mb-10">
                        Describe your event in plain language. Our AI finds the
                        ideal venue, estimates costs, and justifies every
                        choice.
                    </p>
                    <div className="flex items-center gap-8">
                        <div>
                            <p className="text-2xl font-bold text-slate-100 tracking-tight">
                                2.4k+
                            </p>
                            <p className="text-[11px] text-white/30 mt-1">
                                Events planned
                            </p>
                        </div>
                        <div className="w-px h-9 bg-white/10" />
                        <div>
                            <p className="text-2xl font-bold text-slate-100 tracking-tight">
                                98%
                            </p>
                            <p className="text-[11px] text-white/30 mt-1">
                                Accuracy rate
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right panel */}
            <div className="relative z-10 flex flex-1 lg:flex-[0.9] items-center justify-center px-6 lg:px-16 py-12">
                <div className="w-full max-w-sm">
                    {/* Mobile brand */}
                    <div className="flex items-center gap-2 font-bold text-lg text-white mb-8 lg:hidden">
                        <span className="text-indigo-400 text-xl">◈</span>
                        <span>Eventis</span>
                    </div>

                    <div className="bg-white/4 border border-white/9 rounded-2xl p-8 backdrop-blur-xl">
                        <div className="mb-7">
                            <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
                                Welcome back
                            </h2>
                            <p className="text-sm text-white/40 mt-1.5">
                                Sign in to your workspace
                            </p>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/25 rounded-xl px-3.5 py-3 mb-5">
                                <span className="w-4.5 h-4.5 rounded-full bg-red-500/25 text-red-400 flex items-center justify-center text-[11px] font-bold shrink-0">
                                    !
                                </span>
                                <span className="text-sm text-red-300">
                                    {error}
                                </span>
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4 mb-6"
                        >
                            <div className="flex flex-col gap-2">
                                <label className="text-[12.5px] font-medium text-white/55">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-sm text-slate-100 placeholder-white/20 outline-none focus:border-indigo-400 focus:bg-indigo-500/6 transition-colors"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[12.5px] font-medium text-white/55">
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        className="text-xs text-indigo-400 hover:opacity-70 transition-opacity"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="current-password"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-sm text-slate-100 placeholder-white/20 outline-none focus:border-indigo-400 focus:bg-indigo-500/6 transition-colors"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-semibold text-white tracking-wide transition-all duration-200 hover:-translate-y-px active:translate-y-0"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2.5">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Signing in…
                                    </span>
                                ) : (
                                    "Sign in →"
                                )}
                            </button>
                        </form>

                        <p className="text-[13px] text-white/30 text-center">
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="text-indigo-400 font-medium hover:underline"
                            >
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
