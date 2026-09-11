'use client'
import { useState } from "react";
import { CheckIcon, XIcon } from "lucide-react";
import MentorSidebar from "../../components/MentorSidebar";

const initialRequests = [
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
    {
        student: "Zain Malik",
        topic: "Portfolio review before applying to jobs",
        date: "13 Sep, 6:00 PM",
        initials: "ZM",
        color: "bg-amber-600",
    },
];

export default function MentorRequests() {
    const [requests, setRequests] = useState(initialRequests);

    const handleAccept = (student: string) => {
        setRequests((prev) => prev.filter((r) => r.student !== student));
    };

    const handleDecline = (student: string) => {
        setRequests((prev) => prev.filter((r) => r.student !== student));
    };

    return (
        <div className="min-h-screen bg-black text-slate-300 pt-24 flex">
            <MentorSidebar />

            <main className="flex-1 md:ml-64 px-6 md:px-10 py-8 relative overflow-hidden">
                <div className="absolute top-0 -z-10 left-1/3 size-96 bg-pink-600/20 blur-[150px] rounded-full" />

                <div className="max-w-3xl">
                    <h1 className="text-2xl font-semibold text-white">Booking requests</h1>
                    <p className="text-slate-400 mt-1 text-sm">Students waiting for you to accept or decline a session.</p>

                    <div className="mt-8 space-y-3">
                        {requests.length === 0 && (
                            <p className="text-slate-500 text-sm py-10 text-center border border-slate-800 rounded-xl bg-slate-950/40">
                                No pending requests right now.
                            </p>
                        )}
                        {requests.map((req) => (
                            <div
                                key={req.student}
                                className="flex items-center justify-between border border-slate-800 rounded-xl p-5 bg-slate-950/60"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`size-11 rounded-full ${req.color} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
                                        {req.initials}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium text-sm">{req.student}</p>
                                        <p className="text-slate-500 text-sm mt-0.5">{req.topic}</p>
                                        <p className="text-slate-600 text-xs mt-1">{req.date}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleDecline(req.student)}
                                        className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 transition"
                                    >
                                        <XIcon className="size-4" />
                                        Decline
                                    </button>
                                    <button
                                        onClick={() => handleAccept(req.student)}
                                        className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white transition"
                                    >
                                        <CheckIcon className="size-4" />
                                        Accept
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}