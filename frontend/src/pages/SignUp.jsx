import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, clearError } from "../store/slices/authSlice";

export default function SignupPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((s) => s.auth);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirm: "",
    });
    const [localError, setLocalError] = useState("");

    useEffect(() => {
        if (isAuthenticated) navigate("/dashboard", { replace: true });
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleChange = (e) => {
        setLocalError("");
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.password !== form.confirm) {
            setLocalError("Passwords do not match.");
            return;
        }
        dispatch(
            signupUser({
                name: form.name,
                email: form.email,
                password: form.password,
            }),
        );
        if (!error) {
            navigate("/login", { replace: true });
        }
    };

    const getStrength = (pwd) => {
        if (!pwd) return 0;
        let s = 0;
        if (pwd.length >= 6) s++;
        if (pwd.length >= 10) s++;
        if (/[A-Z]/.test(pwd)) s++;
        if (/[0-9]/.test(pwd)) s++;
        if (/[^A-Za-z0-9]/.test(pwd)) s++;
        return s;
    };

    const strength = getStrength(form.password);
    const strengthMeta = [
        null,
        { label: "Weak", color: "bg-red-500" },
        { label: "Fair", color: "bg-orange-400" },
        { label: "Good", color: "bg-yellow-400" },
        { label: "Strong", color: "bg-green-400" },
        { label: "Very strong", color: "bg-emerald-500" },
    ];

    const displayError = localError || error;

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
                        Start for free
                    </p>
                    <h1 className="font-serif text-5xl font-bold leading-[1.1] text-slate-100 tracking-tight mb-8">
                        Your AI event
                        <br />
                        planner
                        <br />
                        <span className="text-indigo-400 italic">
                            awaits you
                        </span>
                    </h1>
                    <ul className="flex flex-col gap-3.5">
                        {[
                            "Instant venue recommendations",
                            "AI-powered cost estimation",
                            "Full planning history",
                            "Structured event proposals",
                        ].map((f) => (
                            <li
                                key={f}
                                className="flex items-center gap-3 text-sm text-white/45"
                            >
                                <span className="w-5 h-5 rounded-md bg-indigo-500/15 text-indigo-400 flex items-center justify-center text-[11px] font-bold shrink-0">
                                    ✓
                                </span>
                                {f}
                            </li>
                        ))}
                    </ul>
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
                                Create account
                            </h2>
                            <p className="text-sm text-white/40 mt-1.5">
                                Join and start planning intelligently
                            </p>
                        </div>

                        {displayError && (
                            <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/25 rounded-xl px-3.5 py-3 mb-5">
                                <span className="w-4.5 h-4.5 rounded-full bg-red-500/25 text-red-400 flex items-center justify-center text-[11px] font-bold shrink-0">
                                    !
                                </span>
                                <span className="text-sm text-red-300">
                                    {displayError}
                                </span>
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4 mb-6"
                        >
                            <div className="flex flex-col gap-2">
                                <label className="text-[12.5px] font-medium text-white/55">
                                    Full name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Alex Johnson"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    autoComplete="name"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-sm text-slate-100 placeholder-white/20 outline-none focus:border-indigo-400 focus:bg-indigo-500/6 transition-colors"
                                />
                            </div>

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
                                <label className="text-[12.5px] font-medium text-white/55">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Min. 6 characters"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="new-password"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-sm text-slate-100 placeholder-white/20 outline-none focus:border-indigo-400 focus:bg-indigo-500/6 transition-colors"
                                />
                                {/* Password strength */}
                                {form.password && (
                                    <div className="flex items-center gap-2.5 mt-1">
                                        <div className="flex gap-1 flex-1">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                                        i <= strength
                                                            ? strengthMeta[
                                                                  strength
                                                              ]?.color
                                                            : "bg-white/10"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span
                                            className={`text-[11px] font-medium min-w-16 text-right ${
                                                strength <= 1
                                                    ? "text-red-400"
                                                    : strength === 2
                                                      ? "text-orange-400"
                                                      : strength === 3
                                                        ? "text-yellow-400"
                                                        : "text-green-400"
                                            }`}
                                        >
                                            {strengthMeta[strength]?.label}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[12.5px] font-medium text-white/55">
                                    Confirm password
                                </label>
                                <input
                                    type="password"
                                    name="confirm"
                                    placeholder="Repeat your password"
                                    value={form.confirm}
                                    onChange={handleChange}
                                    required
                                    autoComplete="new-password"
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
                                        Creating account…
                                    </span>
                                ) : (
                                    "Create account →"
                                )}
                            </button>
                        </form>

                        <p className="text-[13px] text-white/30 text-center">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-indigo-400 font-medium hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
