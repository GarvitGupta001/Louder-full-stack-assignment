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
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (isAuthenticated) navigate("/dashboard", { replace: true });
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        dispatch(clearError());
        requestAnimationFrame(() => setMounted(true));
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
        if (!error) navigate("/login", { replace: true });
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
    const strengthColors = [
        null,
        "#ef4444",
        "#f97316",
        "#eab308",
        "#22c55e",
        "#10b981",
    ];
    const strengthLabels = [
        null,
        "Weak",
        "Fair",
        "Good",
        "Strong",
        "Very strong",
    ];

    const displayError = localError || error;

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap"
                rel="stylesheet"
            />
            <div
                className="min-h-screen bg-[#0a0a0b] flex overflow-hidden"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
                {/* ── Left panel ── */}
                <div className="hidden lg:flex flex-col justify-between w-[52%] px-16 py-14 border-r border-white/[0.055] relative overflow-hidden">
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage:
                                "repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(255,255,255,0.025) 79px, rgba(255,255,255,0.025) 80px)",
                        }}
                    />
                    <div className="absolute top-0 left-0 w-px h-32 bg-gradient-to-b from-[#e8a045]/60 to-transparent" />
                    <div className="absolute top-0 left-0 h-px w-32 bg-gradient-to-r from-[#e8a045]/60 to-transparent" />

                    {/* Logo */}
                    <div className="relative z-10 flex items-center gap-3">
                        <span
                            className="text-[#e8a045] text-sm"
                            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                        >
                            ◈
                        </span>
                        <span className="text-white text-xs font-medium tracking-[0.22em] uppercase">
                            Louder
                        </span>
                    </div>

                    {/* Hero */}
                    <div className="relative z-10">
                        <p className="text-[10px] font-medium tracking-[0.35em] text-[#e8a045] uppercase mb-7">
                            Start for free
                        </p>
                        <h1
                            className="text-[clamp(64px,8.5vw,104px)] leading-[0.9] text-white mb-10"
                            style={{
                                fontFamily: "'Bebas Neue', sans-serif",
                                letterSpacing: "0.025em",
                            }}
                        >
                            Your AI
                            <br />
                            event
                            <br />
                            planner
                            <br />
                            <span className="text-[#e8a045]">awaits.</span>
                        </h1>

                        {/* Feature list */}
                        <div className="flex flex-col gap-3.5">
                            {[
                                "Instant venue recommendations",
                                "AI-powered cost estimation",
                                "Full planning history",
                                "Structured event proposals",
                            ].map((f, i) => (
                                <div
                                    key={f}
                                    className="flex items-center gap-3.5"
                                >
                                    <span className="text-[10px] font-semibold tracking-widest text-[#e8a045]/60 tabular-nums w-4">
                                        0{i + 1}
                                    </span>
                                    <div className="w-5 h-px bg-white/15" />
                                    <span className="text-[13px] text-white/35 font-light">
                                        {f}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="relative z-10">
                        <p className="text-[10px] text-white/18 tracking-[0.2em] uppercase">
                            Trusted by event planners worldwide
                        </p>
                    </div>
                </div>

                {/* ── Right panel: form ── */}
                <div className="flex flex-1 items-center justify-center px-6 sm:px-10 py-14">
                    <div
                        className="w-full max-w-[360px] transition-all duration-600 ease-out"
                        style={{
                            opacity: mounted ? 1 : 0,
                            transform: mounted
                                ? "translateY(0)"
                                : "translateY(22px)",
                        }}
                    >
                        {/* Mobile logo */}
                        <div className="flex items-center gap-2.5 mb-10 lg:hidden">
                            <span className="text-[#e8a045] text-sm">◈</span>
                            <span className="text-white text-xs font-medium tracking-[0.22em] uppercase">
                                Louder
                            </span>
                        </div>

                        <div className="mb-9">
                            <h2
                                className="text-[36px] text-white leading-none mb-2"
                                style={{
                                    fontFamily: "'Bebas Neue', sans-serif",
                                    letterSpacing: "0.04em",
                                }}
                            >
                                Create account
                            </h2>
                            <p className="text-[13px] text-white/30 font-light">
                                Start planning intelligently
                            </p>
                        </div>

                        {displayError && (
                            <div className="flex items-center gap-3 border border-red-900/50 bg-red-950/25 rounded-lg px-4 py-3 mb-6">
                                <span className="text-[10px] font-semibold tracking-widest text-red-500 uppercase shrink-0">
                                    Err
                                </span>
                                <span className="text-[13px] text-red-300/80 font-light">
                                    {displayError}
                                </span>
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-5"
                        >
                            <Field label="Full name">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Alex Johnson"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    autoComplete="name"
                                    className="l-input"
                                />
                            </Field>

                            <Field label="Email">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                    className="l-input"
                                />
                            </Field>

                            <Field label="Password">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Min. 6 characters"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="new-password"
                                    className="l-input"
                                />
                                {form.password && (
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="flex gap-1 flex-1">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <div
                                                    key={i}
                                                    className="h-[2px] flex-1 rounded-full transition-all duration-300"
                                                    style={{
                                                        background:
                                                            i <= strength
                                                                ? strengthColors[
                                                                      strength
                                                                  ]
                                                                : "rgba(255,255,255,0.08)",
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <span
                                            className="text-[10px] font-medium tracking-wide min-w-[52px] text-right"
                                            style={{
                                                color:
                                                    strengthColors[strength] ||
                                                    "rgba(255,255,255,0.3)",
                                            }}
                                        >
                                            {strengthLabels[strength]}
                                        </span>
                                    </div>
                                )}
                            </Field>

                            <Field label="Confirm password">
                                <input
                                    type="password"
                                    name="confirm"
                                    placeholder="Repeat your password"
                                    value={form.confirm}
                                    onChange={handleChange}
                                    required
                                    autoComplete="new-password"
                                    className="l-input"
                                />
                            </Field>

                            <button
                                type="submit"
                                disabled={loading}
                                className="l-btn mt-1"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-3.5 h-3.5 border border-black/20 border-t-black/70 rounded-full animate-spin" />
                                        Creating account…
                                    </span>
                                ) : (
                                    "Create account →"
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-white/[0.06]">
                            <p className="text-[12px] text-white/22">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="text-[#e8a045] hover:text-[#e8a045]/75 transition-colors"
                                >
                                    Sign in →
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .l-input {
          width: 100%;
          background: rgba(255,255,255,0.028);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 7px;
          padding: 13px 15px;
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          color: #e2e8f0;
          outline: none;
          transition: border-color 0.15s, background 0.15s;
        }
        .l-input::placeholder { color: rgba(255,255,255,0.16); }
        .l-input:focus {
          border-color: rgba(232,160,69,0.45);
          background: rgba(232,160,69,0.035);
        }
        .l-btn {
          width: 100%;
          padding: 13.5px;
          background: #e8a045;
          border: none;
          border-radius: 7px;
          font-size: 12px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #0a0a0b;
          cursor: pointer;
          transition: background 0.15s, transform 0.12s;
        }
        .l-btn:hover:not(:disabled) { background: #cf9038; transform: translateY(-1px); }
        .l-btn:active:not(:disabled) { transform: translateY(0); }
        .l-btn:disabled { opacity: 0.38; cursor: not-allowed; }
      `}</style>
        </>
    );
}

function Field({ label, children }) {
    return (
        <div className="flex flex-col gap-2">
            <label
                className="text-[10px] font-medium tracking-[0.28em] text-white/28 uppercase"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
                {label}
            </label>
            {children}
        </div>
    );
}
