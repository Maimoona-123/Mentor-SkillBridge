'use client'
import { useState } from "react";
import {
    CalendarIcon,
    StarIcon,
    UsersIcon,
    CheckIcon,
    XIcon,
    ClockIcon,
} from "lucide-react";
import MentorSidebar from "../components/MentorSidebar";

const requests = [
    {
        student: "Danish Raza",
        topic: "Stuck on React useEffect cleanup",
        date: "9 Sep, 5:00 PM",
        initials: "DR",
        color: "bg-sky-600",
    },
    {
        student: "Fatima Noor",
        topic: "Need help debugging a Firebase query",
        date: "11 Sep, 3:00 PM",
        initials: "FN",
        color: "bg-rose-600",
    },
];

const upcomingSessions = [
    {
        student: "Maria Usman",
        topic: "React state management",
        date: "8 Sep, 4:00 PM",
        initials: "MU",
        color: "bg-emerald-600",
    },
];

export default function MentorDashboard() {
    const [pendingRequests, setPendingRequests] = useState(requests);

    const handleAccept = (student: string) => {
        setPendingRequests((prev) => prev.filter((r) => r.student !== student));
    };

    const handleDecline = (student: string) => {
        setPendingRequests((prev) => prev.filter((r) => r.student !== student));
    };

    return (
        <div className="min-h-screen bg-black text-slate-300 pt-24 flex">
            <MentorSidebar />

            <main className="flex-1 md:ml-64 px-6 md:px-10 py-8 relative overflow-hidden">
                <div className="absolute top-0 -z-10 left-1/3 size-96 bg-pink-600/20 blur-[150px] rounded-full" />

                <div className="max-w-4xl">
                    <h1 className="text-2xl font-semibold text-white">Welcome back, Ayesha 👋</h1>
                    <p className="text-slate-400 mt-1 text-sm">Here's what's happening with your mentees.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                        <div className="border border-slate-800 rounded-xl p-5 bg-slate-950/60">
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <UsersIcon className="size-4" />
                                Students helped
                            </div>
                            <p className="text-3xl font-semibold text-white mt-2">32</p>
                        </div>
                        <div className="border border-slate-800 rounded-xl p-5 bg-slate-950/60">
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <StarIcon className="size-4" />
                                Average rating
                            </div>
                            <p className="text-3xl font-semibold text-white mt-2">4.9</p>
                        </div>
                        <div className="border border-slate-800 rounded-xl p-5 bg-slate-950/60">
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <ClockIcon className="size-4" />
                                Pending requests
                            </div>
                            <p className="text-3xl font-semibold text-white mt-2">{pendingRequests.length}</p>
                        </div>
                    </div>

                    <div className="mt-10">
                        <h2 className="text-lg font-semibold text-white">Booking requests</h2>
                        <p className="text-slate-500 text-sm mt-1">Students waiting for you to accept or decline.</p>

                        <div className="mt-5 space-y-3">
                            {pendingRequests.length === 0 && (
                                <p className="text-slate-500 text-sm py-8 text-center border border-slate-800 rounded-xl bg-slate-950/40">
                                    No pending requests right now.
                                </p>
                            )}
                            {pendingRequests.map((req) => (
                                <div
                                    key={req.student}
                                    className="flex items-center justify-between border border-slate-800 rounded-xl p-4 bg-slate-950/60"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`size-10 rounded-full ${req.color} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
                                            {req.initials}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-sm">{req.student}</p>
                                            <p className="text-slate-500 text-xs">{req.topic}</p>
                                            <p className="text-slate-600 text-xs mt-0.5">{req.date}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleDecline(req.student)}
                                            className="size-8 rounded-lg border border-slate-700 hover:bg-slate-800 flex items-center justify-center transition"
                                        >
                                            <XIcon className="size-4 text-slate-400" />
                                        </button>
                                        <button
                                            onClick={() => handleAccept(req.student)}
                                            className="size-8 rounded-lg bg-pink-600 hover:bg-pink-700 flex items-center justify-center transition"
                                        >
                                            <CheckIcon className="size-4 text-white" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-10">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white">Upcoming sessions</h2>
                            <button className="flex items-center gap-1.5 text-sm text-pink-500 hover:text-pink-400">
                                <CalendarIcon className="size-4" />
                                Manage availability
                            </button>
                        </div>

                        <div className="mt-5 space-y-3">
                            {upcomingSessions.map((session, index) => (
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
                                            <p className="text-slate-500 text-xs">with {session.student} · {session.date}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs px-2.5 py-1 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                                        Confirmed
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}