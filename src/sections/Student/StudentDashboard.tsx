'use client'
import { useState, useEffect } from "react";
import { VideoIcon, ClockIcon, CheckCircle2Icon, UserIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import DashboardSidebar from "../../components/DashboardSidebar";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";

const avatarColors = ["bg-pink-600", "bg-violet-600", "bg-emerald-600", "bg-amber-600", "bg-sky-600"];

const getInitials = (name: string) =>
    name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

interface Booking {
    id: string;
    mentorName: string;
    topic: string;
    day: string;
    date: string;
    time: string;
    status: string;
}

const statusStyles: Record<string, string> = {
    confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    completed: "bg-slate-500/10 text-slate-400 border-slate-500/30",
    declined: "bg-red-500/10 text-red-400 border-red-500/30",
};

export default function StudentDashboard() {
    const { currentUser } = useAuth();
    const [sessionFilter, setSessionFilter] = useState<"upcoming" | "past">("upcoming");
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    const firstName = currentUser?.name?.split(" ")[0] || "there";

    useEffect(() => {
        if (!currentUser) return;
        const q = query(collection(db, "bookings"), where("studentId", "==", currentUser.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const results: Booking[] = snapshot.docs.map((d) => ({
                id: d.id,
                mentorName: d.data().mentorName || "Unknown mentor",
                topic: d.data().topic || "",
                day: d.data().day || "",
                date: d.data().date || "",
                time: d.data().time || "",
                status: d.data().status || "pending",
            }));
            setBookings(results);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [currentUser]);

    const upcomingCount = bookings.filter((b) => b.status === "confirmed").length;
    const completedCount = bookings.filter((b) => b.status === "completed").length;
    const mentorsMetCount = new Set(bookings.map((b) => b.mentorName)).size;

    const filtered = bookings.filter((b) =>
        sessionFilter === "upcoming" ? b.status === "pending" || b.status === "confirmed" : b.status === "completed"
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
                            <p className="text-3xl font-semibold text-white mt-2">{upcomingCount}</p>
                        </div>
                        <div className="border border-slate-800 rounded-xl p-5 bg-slate-950/60">
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <CheckCircle2Icon className="size-4" />
                                Sessions completed
                            </div>
                            <p className="text-3xl font-semibold text-white mt-2">{completedCount}</p>
                        </div>
                        <div className="border border-slate-800 rounded-xl p-5 bg-slate-950/60">
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <UserIcon className="size-4" />
                                Mentors met
                            </div>
                            <p className="text-3xl font-semibold text-white mt-2">{mentorsMetCount}</p>
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
                            {loading && <p className="text-slate-500 text-sm py-6">Loading sessions...</p>}
                            {!loading && filtered.length === 0 && (
                                <p className="text-slate-500 text-sm py-10 text-center">No sessions here yet.</p>
                            )}
                            {filtered.map((session, index) => (
                                <div
                                    key={session.id}
                                    className="flex items-center justify-between border border-slate-800 rounded-xl p-4 bg-slate-950/60"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`size-10 rounded-full ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
                                            {getInitials(session.mentorName)}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-sm">{session.topic}</p>
                                            <p className="text-slate-500 text-xs">with {session.mentorName} · {session.day}, {session.date} · {session.time}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${statusStyles[session.status]}`}>
                                            {session.status}
                                        </span>
                                        {session.status === "confirmed" && (
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