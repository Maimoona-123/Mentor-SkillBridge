'use client'
import { useState } from "react";
import { VideoIcon, CalendarIcon } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../../components/DashboardSidebar";

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
    {
        mentor: "Maria Usman",
        topic: "Portfolio walkthrough",
        date: "20 Aug, 5:00 PM",
        status: "Completed",
        initials: "MU",
        color: "bg-sky-600",
    },
];

const statusStyles: Record<string, string> = {
    Confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    Pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    Completed: "bg-slate-500/10 text-slate-400 border-slate-500/30",
};

const tabs = ["All", "Upcoming", "Pending", "Completed"] as const;
type Tab = (typeof tabs)[number];

export default function StudentSessions() {
    const [activeTab, setActiveTab] = useState<Tab>("All");

    const filtered = sessions.filter((s) => {
        if (activeTab === "All") return true;
        if (activeTab === "Upcoming") return s.status === "Confirmed";
        return s.status === activeTab;
    });

    return (
        <div className="min-h-screen bg-black text-slate-300 pt-24 flex">
            <DashboardSidebar />

            <main className="flex-1 md:ml-64 px-6 md:px-10 py-8 relative overflow-hidden">
                <div className="absolute top-0 -z-10 left-1/3 size-96 bg-pink-600/20 blur-[150px] rounded-full" />

                <div className="max-w-3xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-white">My sessions</h1>
                            <p className="text-slate-400 mt-1 text-sm">All your mentor sessions, past and upcoming.</p>
                        </div>
                        <Link
                            to="/mentors"
                            className="hidden sm:block px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-medium transition"
                        >
                            + Book new session
                        </Link>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mt-6 border-b border-slate-800">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
                                    activeTab === tab
                                        ? "border-pink-600 text-white"
                                        : "border-transparent text-slate-500 hover:text-slate-300"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Session list */}
                    <div className="mt-6 space-y-3">
                        {filtered.length === 0 && (
                            <p className="text-slate-500 text-sm py-10 text-center border border-slate-800 rounded-xl bg-slate-950/40">
                                No sessions here.
                            </p>
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
                                        <p className="text-slate-500 text-xs">with {session.mentor}</p>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                                            <CalendarIcon className="size-3.5" />
                                            {session.date}
                                        </div>
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
            </main>
        </div>
    );
}