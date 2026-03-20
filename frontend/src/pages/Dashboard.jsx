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
        <div className="flex flex-col items-center justify-center py-14 gap-5">
            <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-400 border-b-indigo-400 animate-spin" />
                <div className="absolute inset-2.25 rounded-full border-2 border-transparent border-l-violet-500 border-r-violet-500 animate-spin [animation-duration:1.4s] [animation-direction:reverse]" />
                <div className="absolute inset-4.5 rounded-full bg-indigo-400/20 animate-pulse" />
            </div>
            <div className="flex flex-col items-center gap-1.5">
                <p className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">
                    ◈ Eventis AI
                </p>
                <p className="text-sm text-white/50">{steps[step]}</p>
            </div>
            <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                    <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                    />
                ))}
            </div>
        </div>
    );
}

// ─── Venue Response Card ──────────────────────────────────────────────────────
// Renders the AI response: { venue_name, location, estimated_cost, justification }
function VenueCard({ prompt, response, onDismiss, timestamp }) {
    return (
        <div className="border border-indigo-500/25 bg-indigo-500/6 rounded-2xl overflow-hidden mb-8 animate-[fadeUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
            {/* Card header */}
            <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-5">
                <div className="flex-1 min-w-0">
                    <span className="inline-block text-[10px] font-bold tracking-[0.15em] text-indigo-400 bg-indigo-500/15 px-2.5 py-1 rounded-full mb-3 uppercase">
                        ✦ AI Proposal
                    </span>
                    <h3 className="font-serif text-xl font-bold text-slate-100 tracking-tight leading-snug">
                        {response.venue_name}
                    </h3>
                    {prompt && (
                        <p className="text-xs text-white/30 italic mt-1.5 truncate">
                            "{prompt}"
                        </p>
                    )}
                </div>
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="text-white/20 hover:text-white/60 transition-colors text-base shrink-0 mt-1"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Location + Cost */}
            <div className="grid grid-cols-2 gap-3 px-6 pb-5">
                <div className="bg-white/4 border border-white/[0.07] rounded-xl p-4">
                    <p className="text-[10.5px] text-white/35 font-medium tracking-wide mb-1.5">
                        📍 LOCATION
                    </p>
                    <p className="text-sm font-semibold text-slate-100 leading-snug">
                        {response.location}
                    </p>
                </div>
                <div className="bg-white/4 border border-white/[0.07] rounded-xl p-4">
                    <p className="text-[10.5px] text-white/35 font-medium tracking-wide mb-1.5">
                        💰 ESTIMATED COST
                    </p>
                    <p className="text-base font-bold text-green-400">
                        {response.estimated_cost}
                    </p>
                </div>
            </div>

            {/* Justification */}
            {response.justification && (
                <div className="mx-6 mb-5 bg-white/3 border border-white/6 rounded-xl p-4">
                    <p className="text-[10.5px] text-white/35 font-medium tracking-wide mb-2">
                        🤖 AI JUSTIFICATION
                    </p>
                    <p className="text-sm text-white/60 leading-[1.75]">
                        {response.justification}
                    </p>
                </div>
            )}

            {/* Footer */}
            {timestamp && (
                <div className="px-6 pb-4 border-t border-white/5 pt-3.5">
                    <p className="text-[11px] text-white/20">
                        {new Date(timestamp).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                        })}
                    </p>
                </div>
            )}
        </div>
    );
}

// ─── History Item ─────────────────────────────────────────────────────────────
// Lightweight row. On click → fetches full detail and expands.
function HistoryItem({
    item,
    isSelected,
    isLoadingDetail,
    detail,
    detailError,
    onSelect,
    onDelete,
}) {
    // item = { id, prompt, createdAt }
    // detail = full object from cache (may be null if not fetched yet)

    return (
        <div
            className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                isSelected
                    ? "border-indigo-500/30 bg-indigo-500/4"
                    : "border-white/[0.07] bg-white/2.5 hover:border-white/13 hover:bg-white/4"
            }`}
        >
            {/* Row header — always visible */}
            <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                onClick={() => onSelect(item.id)}
            >
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">
                        {item.prompt}
                    </p>
                    <p className="text-[11px] text-white/25 mt-0.5">
                        {new Date(item.createdAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                        })}
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    {isLoadingDetail && (
                        <span className="w-3.5 h-3.5 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
                    )}
                    <span
                        className={`text-white/25 text-lg transition-transform duration-200 ${isSelected ? "rotate-90" : ""}`}
                    >
                        ›
                    </span>
                </div>
            </div>

            {/* Expanded detail panel */}
            {isSelected && (
                <div className="border-t border-white/6">
                    {/* Loading state */}
                    {isLoadingDetail && (
                        <div className="flex items-center gap-3 px-5 py-5 text-sm text-white/40">
                            <span className="w-4 h-4 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin shrink-0" />
                            Fetching full details…
                        </div>
                    )}

                    {/* Error state */}
                    {!isLoadingDetail && detailError && (
                        <div className="px-5 py-4 text-sm text-red-400 flex items-center gap-2">
                            <span>⚠</span> {detailError}
                        </div>
                    )}

                    {/* Detail loaded */}
                    {!isLoadingDetail && detail && (
                        <div className="px-5 pt-5 pb-4">
                            {/* Venue name */}
                            <div className="mb-4">
                                <p className="text-[10.5px] text-white/30 font-medium tracking-wide mb-1">
                                    🏔 VENUE
                                </p>
                                <p className="text-base font-bold text-slate-100 font-serif">
                                    {detail.response?.venue_name}
                                </p>
                            </div>

                            {/* Location + Cost */}
                            <div className="grid grid-cols-2 gap-2.5 mb-4">
                                <div className="bg-white/4 border border-white/[0.07] rounded-xl p-3.5">
                                    <p className="text-[10px] text-white/30 font-medium mb-1">
                                        📍 LOCATION
                                    </p>
                                    <p className="text-sm font-semibold text-slate-100 leading-snug">
                                        {detail.response?.location}
                                    </p>
                                </div>
                                <div className="bg-white/4 border border-white/[0.07] rounded-xl p-3.5">
                                    <p className="text-[10px] text-white/30 font-medium mb-1">
                                        💰 COST
                                    </p>
                                    <p className="text-sm font-bold text-green-400">
                                        {detail.response?.estimated_cost}
                                    </p>
                                </div>
                            </div>

                            {/* Justification */}
                            {detail.response?.justification && (
                                <div className="bg-white/3 border border-white/5 rounded-xl p-4 mb-4">
                                    <p className="text-[10px] text-white/30 font-medium mb-2">
                                        🤖 JUSTIFICATION
                                    </p>
                                    <p className="text-sm text-white/55 leading-[1.75]">
                                        {detail.response.justification}
                                    </p>
                                </div>
                            )}

                            {/* Delete */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(item.id);
                                }}
                                className="text-xs bg-red-500/10 border border-red-500/20 text-red-400 px-3.5 py-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
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
        // Only fetch if not already cached and not currently loading
        if (!detailCache[id] && detailLoadingId !== id) {
            dispatch(fetchRequestDetail(id));
        }
    };

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/login", { replace: true });
    };

    const examples = [
        "A trek in India with ₹50,000 budget",
        "Outdoor wedding for 150 guests in Goa",
        "Tech conference for 200 people in Bangalore",
    ];

    return (
        <div className="min-h-screen bg-[#080b12] text-slate-200">
            {/* ── Header ── */}
            <header className="flex items-center justify-between px-6 lg:px-12 py-5 border-b border-white/6 bg-white/2">
                {/* Logo */}
                <div className="flex items-center gap-2 font-bold text-white">
                    <span className="text-indigo-400 text-lg">◈</span>
                    <span>Louder</span>
                </div>

                {/* User */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
                            {user?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-xs font-semibold text-slate-200">
                                {user?.name}
                            </p>
                            <p className="text-[10px] text-white/30">
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="text-xs text-white/40 hover:text-red-400 transition-colors"
                    >
                        Sign out
                    </button>
                </div>
            </header>
            {/* ── Main ── */}
            <main className="px-6 lg:px-16 xl:px-24 py-10 w-full">
                {/* Header */}
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h1 className="font-serif text-3xl font-bold text-slate-100 tracking-tight">
                            Event Planner
                        </h1>
                        <p className="text-sm text-white/35 mt-1">
                            Describe your event, let AI handle the rest
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-3.5 py-1.5 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80] animate-pulse" />
                        <span className="text-xs text-green-400 font-medium">
                            AI Ready
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {/* ── Prompt Input ── */}
                        <section className="mb-8">
                            <form onSubmit={handleSubmit}>
                                <div className="flex items-start bg-white/5 border border-white/12 rounded-2xl px-5 py-4 focus-within:border-indigo-400/70 focus-within:bg-indigo-500/3 transition-colors duration-200">
                                    <span className="text-indigo-400 text-lg mt-0.5 shrink-0 mr-3">
                                        ◈
                                    </span>
                                    <textarea
                                        className="flex-1 bg-transparent outline-none text-[15px] text-slate-100 placeholder-white/25 resize-none leading-relaxed min-h-15"
                                        placeholder="Describe your event… e.g. 'A trek in India with ₹50,000 budget'"
                                        value={prompt}
                                        onChange={(e) =>
                                            setPrompt(e.target.value)
                                        }
                                        onKeyDown={handleKeyDown}
                                        rows={3}
                                        disabled={loading}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!prompt.trim() || loading}
                                        className="ml-3 self-end px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px active:translate-y-0 shrink-0"
                                    >
                                        {loading ? (
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin block" />
                                        ) : (
                                            "Plan →"
                                        )}
                                    </button>
                                </div>
                                <p className="text-[11px] text-white/20 mt-2 pl-1">
                                    Enter to submit · Shift+Enter for new line
                                </p>
                            </form>

                            {/* Example chips */}
                            {!loading && !current && history.length === 0 && (
                                <div className="mt-5">
                                    <p className="text-[11px] text-white/25 mb-2.5">
                                        Try an example
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {examples.map((ex) => (
                                            <button
                                                key={ex}
                                                onClick={() => setPrompt(ex)}
                                                className="text-xs bg-white/4 border border-white/8 text-white/40 hover:border-indigo-400/50 hover:text-indigo-400 hover:bg-indigo-500/[0.07] px-3.5 py-1.5 rounded-full transition-all duration-150"
                                            >
                                                {ex}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* ── Submit Error ── */}
                        {error && !loading && (
                            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6 text-sm text-red-300">
                                <span>⚠</span> {error}
                            </div>
                        )}

                        {/* ── AI Loading ── */}
                        {loading && <AILoader />}

                        {/* ── Current Result ── */}
                        {current && !loading && (
                            <VenueCard
                                prompt={current.prompt}
                                response={current.response}
                                onDismiss={() => dispatch(clearCurrent())}
                            />
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        {/* ── History ── */}
                        <section className="sticky top-24">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-semibold text-slate-100">
                                    Planning History
                                </h2>
                                <span className="text-xs text-white/30 bg-white/5 px-3 py-1 rounded-full">
                                    {history.length}{" "}
                                    {history.length === 1
                                        ? "request"
                                        : "requests"}
                                </span>
                            </div>

                            {/* History loading skeletons */}
                            {historyLoading && (
                                <div className="flex flex-col gap-2.5">
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className="h-16.5 rounded-xl"
                                            style={{
                                                background:
                                                    "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 75%)",
                                                backgroundSize: "200% 100%",
                                                animation:
                                                    "shimmer 1.5s infinite",
                                            }}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Empty state */}
                            {!historyLoading && history.length === 0 && (
                                <div className="flex flex-col items-center py-14 gap-3 border border-dashed border-white/8 rounded-2xl">
                                    <span className="text-4xl text-white/10">
                                        ◇
                                    </span>
                                    <p className="text-sm font-semibold text-white/30">
                                        No events planned yet
                                    </p>
                                    <p className="text-xs text-white/20">
                                        Your planning history will appear here
                                    </p>
                                </div>
                            )}

                            {/* History list */}
                            {!historyLoading && history.length > 0 && (
                                <div className="flex flex-col gap-2">
                                    {history.map((item) => (
                                        <HistoryItem
                                            key={item.id}
                                            item={item}
                                            isSelected={selectedId === item.id}
                                            isLoadingDetail={
                                                detailLoadingId === item.id
                                            }
                                            detail={
                                                detailCache[item.id] || null
                                            }
                                            detailError={
                                                selectedId === item.id
                                                    ? detailError
                                                    : null
                                            }
                                            onSelect={handleSelectHistory}
                                            onDelete={(id) =>
                                                dispatch(deleteRequest(id))
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </main>

            <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          to { background-position: -200% 0; }
        }
      `}</style>
        </div>
    );
}
