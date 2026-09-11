'use client'
import { useState } from "react";
import { VideoIcon, ClockIcon, CheckCircle2Icon, UserIcon } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../../components/DashboardSidebar";
import { useAuth } from "../../context/AuthContext";

const sessions = [
    {
        mentor: "Ayesha Zafar",
        topic: "React state management",
        date: "8 Sep, 4:00 PM",
        status: "Confirmed",
        initials: "AZ",
        color: "bg-pink-600",
    },
    {
        mentor: "Hamza Malik",
        topic: "Node.js API design",
        date: "10 Sep, 5:00 PM",
        status: "Pending",
        initials: "HM",
        color: "bg-violet-600",
    },
    {
        mentor: "Sara Khan",
        topic: "Portfolio review",
        date: "2 Sep, 6:00 PM",
        status: "Completed",
        initials: "SK",
        color: "bg-emerald-600",
    },
    {
        mentor: "Bilal Ahmed",
        topic: "ML project debugging",
        date: "28 Aug, 3:00 PM",
        status: "Completed",
        initials: "BA",
        color: "bg-amber-600",
    },
];

const statusStyles: Record<string, string> = {
    Confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    Pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    Completed: "bg-slate-500/10 text-slate-400 border-slate-500/30",
};

export default function StudentDashboard() {
    const { currentUser } = useAuth();
    const [sessionFilter, setSessionFilter] = useState<"upcoming" | "past">("upcoming");

    const firstName = currentUser?.name?.split(" ")[0] || "there";

    const filtered = sessions.filter((s) =>
        sessionFilter === "upcoming" ? s.status !== "Completed" : s.status === "Completed"
    );

    return (
        <div className="min-h-screen bg-black text-slate-300 pt-24 flex">
            <DashboardSidebar />

            <main className="flex-1 md:ml-64 px-6 md:px-10 py-8 relative overflow-hidden">
                <div className="absolute top-0 -z-10 left-1/3 size-96 bg-pink-600/20 blur-[150px] rounded-full" />

                <div className="max-w-4xl">
                    <h1 className="text-2xl font-semibold text-white">Welcome back, {firstName} 👋</h1>
                    <p className="text-slate-400 mt-1 text-sm">Here's what's happening with your mentorship.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                        <div className="border border-slate-800 rounded-xl p-5 bg-slate-950/60">
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <ClockIcon className="size-4" />
                                Upcoming sessions
                            </div>
                            <p className="text-3xl font-semibold text-white mt-2">2</p>
                        </div>
                        <div className="border border-slate-800 rounded-xl p-5 bg-slate-950/60">
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <CheckCircle2Icon className="size-4" />
                                Sessions completed
                            </div>
                            <p className="text-3xl font-semibold text-white mt-2">6</p>
                        </div>
                        <div className="border border-slate-800 rounded-xl p-5 bg-slate-950/60">
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <UserIcon className="size-4" />
                                Mentors met
                            </div>
                            <p className="text-3xl font-semibold text-white mt-2">4</p>
                        </div>
                    </div>

                    <div className="mt-10">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white">Sessions</h2>
                            <Link to="/mentors" className="text-sm text-pink-500 hover:text-pink-400">
                                + Book new session
                            </Link>
                        </div>

                        <div className="flex gap-2 mt-4 border-b border-slate-800">
                            <button
                                onClick={() => setSessionFilter("upcoming")}
                                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
                                    sessionFilter === "upcoming" ? "border-pink-600 text-white" : "border-transparent text-slate-500 hover:text-slate-300"
                                }`}
                            >
                                Upcoming
                            </button>
                            <button
                                onClick={() => setSessionFilter("past")}
                                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
                                    sessionFilter === "past" ? "border-pink-600 text-white" : "border-transparent text-slate-500 hover:text-slate-300"
                                }`}
                            >
                                Past
                            </button>
                        </div>

                        <div className="mt-5 space-y-3">
                            {filtered.length === 0 && (
                                <p className="text-slate-500 text-sm py-10 text-center">No sessions here yet.</p>
                            )}
                            {filtered.map((session, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between border border-slate-800 rounded-xl p-4 bg-slate-950/60"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`size-10 rounded-full ${session.color} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
                                            {session.initials}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-sm">{session.topic}</p>
                                            <p className="text-slate-500 text-xs">with {session.mentor} · {session.date}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs px-2.5 py-1 rounded-full border ${statusStyles[session.status]}`}>
                                            {session.status}
                                        </span>
                                        {session.status === "Confirmed" && (
                                            <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-700 text-white transition">
                                                <VideoIcon className="size-3.5" />
                                                Join
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}