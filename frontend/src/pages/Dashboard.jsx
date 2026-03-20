import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    submitPrompt,
    fetchHistory,
    fetchRequestDetail,
    deleteRequest,
    clearCurrent,
    setSelectedId,
} from "../store/slices/requestSlice";
import { logoutUser } from "../store/slices/authSlice";

// ─── AI Loader ────────────────────────────────────────────────────────────────
function AILoader() {
    const steps = [
        "Analyzing your event description…",
        "Identifying key requirements…",
        "Searching optimal venues…",
        "Estimating costs & logistics…",
        "Crafting your proposal…",
    ];
    const [step, setStep] = useState(0);

    useEffect(() => {
        const t = setInterval(
            () => setStep((s) => (s + 1) % steps.length),
            1800,
        );
        return () => clearInterval(t);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center flex-1 gap-8 py-20">
            {/* Orbital loader */}
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border border-white/6" />
                <div
                    className="absolute inset-0 rounded-full border-t border-r border-[#e8a045]/80 animate-spin"
                    style={{ animationDuration: "1.2s" }}
                />
                <div
                    className="absolute inset-[5px] rounded-full border-b border-[#e8a045]/30 animate-spin"
                    style={{
                        animationDuration: "2s",
                        animationDirection: "reverse",
                    }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#e8a045]/60 animate-pulse" />
                </div>
            </div>
            <div className="flex flex-col items-center gap-2">
                <p className="text-[9px] font-semibold tracking-[0.4em] text-[#e8a045] uppercase">
                    ◈ Louder AI
                </p>
                <p
                    className="text-[15px] text-white/40 font-light transition-all duration-500"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                    {steps[step]}
                </p>
            </div>
            <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                    <span
                        key={i}
                        className="w-[5px] h-[5px] rounded-full bg-[#e8a045]/40 animate-bounce"
                        style={{ animationDelay: `${i * 0.18}s` }}
                    />
                ))}
            </div>
        </div>
    );
}

// ─── Venue Card ───────────────────────────────────────────────────────────────
function VenueCard({ prompt, response, onDismiss }) {
    return (
        <div className="animate-[fadeUp_0.5s_cubic-bezier(0.16,1,0.3,1)] w-full">
            {/* Label row */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-px h-4 bg-[#e8a045]" />
                    <span
                        className="text-[9px] font-semibold tracking-[0.35em] text-[#e8a045] uppercase"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                        AI Proposal
                    </span>
                </div>
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="text-[10px] tracking-[0.2em] uppercase text-white/20 hover:text-white/50 transition-colors border border-white/[0.07] hover:border-white/15 px-2.5 py-1 rounded"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                        Dismiss
                    </button>
                )}
            </div>

            {/* Venue name — big editorial */}
            <h2
                className="text-[clamp(32px,5vw,52px)] text-white leading-[0.92] mb-2"
                style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    letterSpacing: "0.03em",
                }}
            >
                {response.venue_name}
            </h2>
            {prompt && (
                <p
                    className="text-[12px] text-white/22 italic mb-8 font-light break-words"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                    "{prompt}"
                </p>
            )}

            {/* Horizontal rule */}
            <div className="h-px bg-white/[0.06] mb-8" />

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <InfoBlock label="Location" value={response.location} />
                <InfoBlock
                    label="Estimated Cost"
                    value={response.estimated_cost}
                    accent
                />
            </div>

            {/* Justification */}
            {response.justification && (
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-5">
                    <p
                        className="text-[9px] font-semibold tracking-[0.32em] text-white/22 uppercase mb-3"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                        Why this venue
                    </p>
                    <p
                        className="text-[14px] text-white/45 leading-[1.85] font-light"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                        {response.justification}
                    </p>
                </div>
            )}
        </div>
    );
}

function InfoBlock({ label, value, accent }) {
    return (
        <div className="border border-white/[0.06] rounded-lg p-5 bg-white/[0.018]">
            <p
                className="text-[9px] font-semibold tracking-[0.32em] text-white/22 uppercase mb-2"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
                {label}
            </p>
            <p
                className={`text-[17px] font-medium leading-snug ${accent ? "text-[#e8a045]" : "text-white/80"}`}
                style={{
                    fontFamily: accent
                        ? "'Bebas Neue', sans-serif"
                        : "'DM Sans', sans-serif",
                    letterSpacing: accent ? "0.04em" : "normal",
                    fontSize: accent ? "22px" : "15px",
                }}
            >
                {value}
            </p>
        </div>
    );
}

// ─── Empty / Welcome state ────────────────────────────────────────────────────
function EmptyState({ onExample }) {
    const examples = [
        "A trek in India with ₹50,000 budget",
        "Outdoor wedding for 150 guests in Goa",
        "Tech conference for 200 people in Bangalore",
    ];

    return (
        <div className="flex flex-col justify-center flex-1 py-12">
            {/* Big faint wordmark */}
            <p
                className="text-[clamp(48px,10vw,96px)] text-white/[0.03] leading-none select-none mb-12 -ml-1"
                style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    letterSpacing: "0.02em",
                }}
            >
                LOUDER
            </p>

            <div className="max-w-lg">
                <p
                    className="text-[9px] font-semibold tracking-[0.35em] text-[#e8a045] uppercase mb-4"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                    Get started
                </p>
                <p
                    className="text-[15px] text-white/30 leading-[1.8] font-light mb-8"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                    Describe your event above — budget, location, headcount,
                    vibe. The AI will find the ideal venue and explain every
                    choice.
                </p>

                <p
                    className="text-[9px] font-semibold tracking-[0.28em] text-white/18 uppercase mb-3"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                    Try an example
                </p>
                <div className="flex flex-col gap-2">
                    {examples.map((ex, i) => (
                        <button
                            key={ex}
                            onClick={() => onExample(ex)}
                            className="group flex items-center gap-4 text-left border border-white/[0.055] hover:border-[#e8a045]/25 bg-white/[0.018] hover:bg-[#e8a045]/[0.025] rounded-lg px-4 py-3.5 transition-all duration-150"
                        >
                            <span
                                className="text-[10px] text-white/15 group-hover:text-[#e8a045]/50 tabular-nums shrink-0 font-medium transition-colors"
                                style={{
                                    fontFamily: "'Bebas Neue', sans-serif",
                                    letterSpacing: "0.06em",
                                }}
                            >
                                0{i + 1}
                            </span>
                            <span
                                className="text-[13px] text-white/35 group-hover:text-white/60 transition-colors font-light"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                                {ex}
                            </span>
                            <span className="ml-auto text-white/12 group-hover:text-[#e8a045]/40 transition-colors text-sm">
                                →
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── History Panel ────────────────────────────────────────────────────────────
function HistoryPanel({
    history,
    historyLoading,
    selectedId,
    detailLoadingId,
    detailCache,
    detailError,
    onSelect,
    onDelete,
}) {
    return (
        <div className="flex flex-col h-full">
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.06] shrink-0">
                <p
                    className="text-[11px] font-semibold tracking-[0.28em] text-white/50 uppercase"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                    History
                </p>
                <span
                    className="text-[13px] text-white/30 tabular-nums"
                    style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        letterSpacing: "0.08em",
                    }}
                >
                    {history.length}
                </span>
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto scrollbar-hide px-3 py-4">
                {historyLoading && (
                    <div className="flex flex-col gap-2 px-1">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-[72px] rounded-lg"
                                style={{
                                    background:
                                        "linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.038) 50%, rgba(255,255,255,0.02) 75%)",
                                    backgroundSize: "200% 100%",
                                    animation: "shimmer 1.6s infinite",
                                    animationDelay: `${i * 0.1}s`,
                                }}
                            />
                        ))}
                    </div>
                )}

                {!historyLoading && history.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-48 gap-3">
                        <span
                            className="text-[32px] text-white/8"
                            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                        >
                            ◇
                        </span>
                        <p
                            className="text-[13px] text-white/25 text-center font-light"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            No history yet
                        </p>
                    </div>
                )}

                {!historyLoading && history.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                        {history.map((item) => (
                            <HistoryRow
                                key={item.id}
                                item={item}
                                isSelected={selectedId === item.id}
                                isLoadingDetail={detailLoadingId === item.id}
                                detail={detailCache[item.id] || null}
                                detailError={
                                    selectedId === item.id ? detailError : null
                                }
                                onSelect={onSelect}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function HistoryRow({
    item,
    isSelected,
    isLoadingDetail,
    detail,
    detailError,
    onSelect,
    onDelete,
}) {
    return (
        <div
            className={`rounded-lg overflow-hidden transition-all duration-200 ${
                isSelected
                    ? "bg-[#e8a045]/[0.06] border border-[#e8a045]/15"
                    : "border border-transparent hover:border-white/[0.06] hover:bg-white/[0.025]"
            }`}
        >
            <button
                className="w-full flex items-start gap-3 px-4 py-4 text-left"
                onClick={() => onSelect(item.id)}
            >
                {/* Indicator dot */}
                <span
                    className={`w-1.5 h-1.5 rounded-full mt-[7px] shrink-0 transition-colors ${isSelected ? "bg-[#e8a045]" : "bg-white/20"}`}
                />
                <div className="flex-1 min-w-0">
                    <p
                        className="text-[14px] font-medium text-white/75 break-words whitespace-normal leading-snug"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                        {item.prompt}
                    </p>
                    <p
                        className="text-[12px] text-white/30 mt-1.5 font-light"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                        {new Date(item.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                        })}
                    </p>
                </div>
                {isLoadingDetail ? (
                    <span className="w-3 h-3 border border-[#e8a045]/30 border-t-[#e8a045] rounded-full animate-spin mt-1.5 shrink-0" />
                ) : (
                    <span
                        className={`text-white/20 text-sm mt-1 shrink-0 transition-transform duration-200 ${isSelected ? "rotate-90" : ""}`}
                    >
                        ›
                    </span>
                )}
            </button>

            {/* Expanded detail */}
            {isSelected && (
                <div className="border-t border-white/[0.05] px-4 pt-4 pb-4">
                    {isLoadingDetail && (
                        <p
                            className="text-[13px] text-white/30 font-light py-2"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            Loading…
                        </p>
                    )}
                    {!isLoadingDetail && detailError && (
                        <p
                            className="text-[13px] text-red-400/60 py-2"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            ⚠ {detailError}
                        </p>
                    )}
                    {!isLoadingDetail && detail && (
                        <div className="flex flex-col gap-3">
                            <div>
                                <p
                                    className="text-[10px] tracking-[0.25em] text-white/28 uppercase mb-1.5"
                                    style={{
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}
                                >
                                    Venue
                                </p>
                                <p
                                    className="text-[18px] text-white/80 font-semibold leading-tight"
                                    style={{
                                        fontFamily: "'Bebas Neue', sans-serif",
                                        letterSpacing: "0.04em",
                                    }}
                                >
                                    {detail.response?.venue_name}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-white/[0.03] rounded-lg p-3">
                                    <p
                                        className="text-[9px] tracking-widest text-white/28 uppercase mb-1.5"
                                        style={{
                                            fontFamily: "'DM Sans', sans-serif",
                                        }}
                                    >
                                        Location
                                    </p>
                                    <p
                                        className="text-[13px] text-white/65 leading-snug"
                                        style={{
                                            fontFamily: "'DM Sans', sans-serif",
                                        }}
                                    >
                                        {detail.response?.location}
                                    </p>
                                </div>
                                <div className="bg-white/[0.03] rounded-lg p-3">
                                    <p
                                        className="text-[9px] tracking-widest text-white/28 uppercase mb-1.5"
                                        style={{
                                            fontFamily: "'DM Sans', sans-serif",
                                        }}
                                    >
                                        Cost
                                    </p>
                                    <p
                                        className="text-[15px] text-[#e8a045] font-semibold"
                                        style={{
                                            fontFamily:
                                                "'Bebas Neue', sans-serif",
                                            letterSpacing: "0.04em",
                                        }}
                                    >
                                        {detail.response?.estimated_cost}
                                    </p>
                                </div>
                            </div>
                            {detail.response?.justification && (
                                <p
                                    className="text-[13px] text-white/40 leading-[1.7] font-light"
                                    style={{
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}
                                >
                                    {detail.response.justification}
                                </p>
                            )}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(item.id);
                                }}
                                className="self-start text-[10px] tracking-[0.18em] uppercase text-red-400/40 hover:text-red-400/80 border border-red-900/25 hover:border-red-900/50 px-3 py-1.5 rounded transition-all"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((s) => s.auth);
    const {
        current,
        history,
        loading,
        historyLoading,
        detailCache,
        selectedId,
        detailLoadingId,
        detailError,
        error,
    } = useSelector((s) => s.requests);

    const [prompt, setPrompt] = useState("");
    const [historyOpen, setHistoryOpen] = useState(false); // mobile toggle

    useEffect(() => {
        dispatch(fetchHistory());
    }, [dispatch]);
    useEffect(() => {
        console.log(current);
    }, [current]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!prompt.trim() || loading) return;
        dispatch(submitPrompt(prompt.trim()));
        setPrompt("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleSelectHistory = (id) => {
        dispatch(setSelectedId(id));
        if (!detailCache[id] && detailLoadingId !== id)
            dispatch(fetchRequestDetail(id));
    };

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/login", { replace: true });
    };

    const handleExample = (ex) => setPrompt(ex);

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap"
                rel="stylesheet"
            />

            {/* ── Full-height app shell ── */}
            <div className="h-screen bg-[#0a0a0b] flex overflow-hidden">
                {/* ════════════════════════════════
                    LEFT SIDEBAR
                ════════════════════════════════ */}
                <aside className="hidden md:flex flex-col w-[64px] lg:w-[200px] shrink-0 border-r border-white/[0.055] bg-[#0a0a0b] z-20">
                    {/* Logo */}
                    <div className="flex items-center gap-3 px-4 lg:px-5 py-5 border-b border-white/[0.055]">
                        <span
                            className="text-[#e8a045] shrink-0"
                            style={{
                                fontFamily: "'Bebas Neue', sans-serif",
                                fontSize: "18px",
                                letterSpacing: "0.06em",
                            }}
                        >
                            ◈
                        </span>
                        <span
                            className="hidden lg:block text-white text-[11px] font-medium tracking-[0.22em] uppercase"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            Louder
                        </span>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 px-2 lg:px-3 py-4 flex flex-col gap-1">
                        {/* Active: Planner */}
                        <div className="flex items-center gap-3 px-2 lg:px-3 py-2.5 rounded-lg bg-[#e8a045]/[0.07] border border-[#e8a045]/10 cursor-default">
                            <svg
                                className="w-4 h-4 text-[#e8a045] shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                                />
                            </svg>
                            <span
                                className="hidden lg:block text-[11px] font-medium text-[#e8a045] tracking-[0.12em] uppercase"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                                Planner
                            </span>
                        </div>
                    </nav>

                    {/* User + Logout */}
                    <div className="border-t border-white/[0.055] px-2 lg:px-3 py-4 flex flex-col gap-2">
                        <div className="flex items-center gap-3 px-2 py-2">
                            <div className="w-7 h-7 rounded-md bg-[#e8a045]/12 border border-[#e8a045]/18 flex items-center justify-center text-[11px] font-semibold text-[#e8a045] shrink-0">
                                {user?.name?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div className="hidden lg:block min-w-0">
                                <p
                                    className="text-[11px] font-medium text-white/60 truncate"
                                    style={{
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}
                                >
                                    {user?.name}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/[0.03] transition-colors group"
                        >
                            <svg
                                className="w-4 h-4 text-white/20 group-hover:text-red-400/60 shrink-0 transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                                />
                            </svg>
                            <span
                                className="hidden lg:block text-[10px] tracking-[0.15em] uppercase text-white/20 group-hover:text-red-400/60 transition-colors"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                                Sign out
                            </span>
                        </button>
                    </div>
                </aside>

                {/* ════════════════════════════════
                    CENTER: WORKSPACE
                ════════════════════════════════ */}
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {/* Mobile header */}
                    <header className="md:hidden flex items-center justify-between px-4 py-4 border-b border-white/[0.055] shrink-0">
                        <div className="flex items-center gap-2">
                            <span
                                className="text-[#e8a045]"
                                style={{
                                    fontFamily: "'Bebas Neue', sans-serif",
                                    fontSize: "16px",
                                }}
                            >
                                ◈
                            </span>
                            <span
                                className="text-white text-[10px] font-medium tracking-[0.22em] uppercase"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                                Louder
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setHistoryOpen((v) => !v)}
                                className={`text-[10px] tracking-[0.2em] uppercase border px-3 py-1.5 rounded transition-all ${historyOpen ? "border-[#e8a045]/20 text-[#e8a045]/70 bg-[#e8a045]/[0.05]" : "border-white/[0.07] text-white/30"}`}
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                                History
                            </button>
                            <button
                                onClick={handleLogout}
                                className="text-[10px] tracking-[0.2em] uppercase text-white/20 hover:text-red-400/60 transition-colors"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                                Out
                            </button>
                        </div>
                    </header>

                    {/* Workspace content */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-10 py-8 lg:py-10 flex flex-col min-h-full">
                            {/* Top label */}
                            <div className="mb-8 lg:mb-10">
                                <p
                                    className="text-[9px] font-semibold tracking-[0.38em] text-[#e8a045] uppercase mb-1"
                                    style={{
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}
                                >
                                    Event Planner
                                </p>
                                <h1
                                    className="text-[28px] sm:text-[36px] text-white leading-none"
                                    style={{
                                        fontFamily: "'Bebas Neue', sans-serif",
                                        letterSpacing: "0.035em",
                                    }}
                                >
                                    What are you planning?
                                </h1>
                            </div>

                            {/* ── Prompt input ── */}
                            <form
                                onSubmit={handleSubmit}
                                className="mb-8 lg:mb-10"
                            >
                                <div className="relative border border-white/[0.07] rounded-xl bg-white/[0.025] focus-within:border-[#e8a045]/30 focus-within:bg-[#e8a045]/[0.018] transition-all duration-200 overflow-hidden">
                                    {/* Top amber accent */}
                                    <div className="h-px bg-gradient-to-r from-[#e8a045]/0 via-[#e8a045]/0 to-transparent transition-all duration-300 focus-within:from-[#e8a045]/40" />

                                    <textarea
                                        className="w-full bg-transparent outline-none text-[15px] text-white/75 placeholder-white/15 resize-none leading-relaxed font-light px-5 pt-5 pb-4"
                                        style={{
                                            fontFamily: "'DM Sans', sans-serif",
                                            minHeight: "100px",
                                        }}
                                        placeholder="Describe your event — budget, location, headcount, vibe…"
                                        value={prompt}
                                        onChange={(e) =>
                                            setPrompt(e.target.value)
                                        }
                                        onKeyDown={handleKeyDown}
                                        rows={3}
                                        disabled={loading}
                                    />

                                    {/* Bottom bar */}
                                    <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.05]">
                                        <p
                                            className="text-[10px] text-white/12 font-light"
                                            style={{
                                                fontFamily:
                                                    "'DM Sans', sans-serif",
                                            }}
                                        >
                                            Enter to submit · Shift+Enter for
                                            new line
                                        </p>
                                        <button
                                            type="submit"
                                            disabled={!prompt.trim() || loading}
                                            className="flex items-center gap-2.5 px-4 py-2 bg-[#e8a045] hover:bg-[#d4913c] disabled:opacity-25 disabled:cursor-not-allowed rounded-lg text-[10px] font-semibold tracking-[0.15em] uppercase text-[#0a0a0b] transition-all duration-150 hover:-translate-y-px active:translate-y-0"
                                            style={{
                                                fontFamily:
                                                    "'DM Sans', sans-serif",
                                            }}
                                        >
                                            {loading ? (
                                                <span className="w-3 h-3 border border-black/20 border-t-black/60 rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    Plan{" "}
                                                    <span className="opacity-60">
                                                        →
                                                    </span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* ── Error ── */}
                            {error && !loading && (
                                <div
                                    className="flex items-center gap-3 border border-red-900/35 bg-red-950/15 rounded-lg px-4 py-3 mb-8 text-[13px] text-red-300/60 font-light"
                                    style={{
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}
                                >
                                    <span className="text-red-500/60 text-[10px] font-semibold tracking-widest uppercase shrink-0">
                                        Err
                                    </span>
                                    {error}
                                </div>
                            )}

                            {/* ── AI Loading / Result / Empty ── */}
                            <div className="flex flex-col flex-1">
                                {loading && <AILoader />}

                                {!loading && current && (
                                    <VenueCard
                                        prompt={current.prompt}
                                        response={current.response}
                                        onDismiss={() =>
                                            dispatch(clearCurrent())
                                        }
                                    />
                                )}

                                {!loading && !current && (
                                    <EmptyState onExample={handleExample} />
                                )}
                            </div>
                        </div>
                    </div>
                </main>

                {/* ════════════════════════════════
                    RIGHT: HISTORY PANEL
                    — always visible on lg+
                    — slide-over on mobile (toggle)
                ════════════════════════════════ */}

                {/* Desktop history sidebar */}
                <aside className="hidden lg:flex flex-col w-[320px] xl:w-[360px] shrink-0 border-l border-white/[0.055] bg-[#0a0a0b]">
                    <HistoryPanel
                        history={history}
                        historyLoading={historyLoading}
                        selectedId={selectedId}
                        detailLoadingId={detailLoadingId}
                        detailCache={detailCache}
                        detailError={detailError}
                        onSelect={handleSelectHistory}
                        onDelete={(id) => dispatch(deleteRequest(id))}
                    />
                </aside>

                {/* Mobile history drawer (overlay) */}
                {historyOpen && (
                    <div className="lg:hidden fixed inset-0 z-40 flex">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setHistoryOpen(false)}
                        />
                        {/* Drawer */}
                        <div className="relative ml-auto w-[82%] max-w-[320px] h-full bg-[#0f0f11] border-l border-white/[0.06] flex flex-col animate-[slideIn_0.25s_cubic-bezier(0.16,1,0.3,1)]">
                            <HistoryPanel
                                history={history}
                                historyLoading={historyLoading}
                                selectedId={selectedId}
                                detailLoadingId={detailLoadingId}
                                detailCache={detailCache}
                                detailError={detailError}
                                onSelect={(id) => {
                                    handleSelectHistory(id);
                                }}
                                onDelete={(id) => dispatch(deleteRequest(id))}
                            />
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        * { box-sizing: border-box; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          to { background-position: -200% 0; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
      `}</style>
        </>
    );
}
