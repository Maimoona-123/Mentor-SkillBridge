'use client'
import { useState, useEffect } from "react";
import {
    CalendarIcon,
    StarIcon,
    UsersIcon,
    CheckIcon,
    XIcon,
    ClockIcon,
    VideoIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";
import MentorSidebar from "../../components/MentorSidebar";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";

const avatarColors = ["bg-sky-600", "bg-rose-600", "bg-amber-600", "bg-violet-600", "bg-emerald-600"];

const getInitials = (name: string) =>
    name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

interface Booking {
    id: string;
    studentName: string;
    topic: string;
    day: string;
    time: string;
    status: string;
}

export default function MentorDashboard() {
    const { currentUser } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [avgRating, setAvgRating] = useState<number | null>(null);

    const firstName = currentUser?.name?.split(" ")[0] || "there";

    useEffect(() => {
        if (!currentUser) return;
        const loadRating = async () => {
            const snap = await getDoc(doc(db, "users", currentUser.uid));
            if (snap.exists()) {
                const data = snap.data();
                if (data.ratingCount > 0) {
                    setAvgRating(data.ratingSum / data.ratingCount);
                }
            }
        };
        loadRating();
    }, [currentUser]);

    useEffect(() => {
        if (!currentUser) return;
        const q = query(collection(db, "bookings"), where("mentorId", "==", currentUser.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const results: Booking[] = snapshot.docs.map((d) => ({
                id: d.id,
                studentName: d.data().studentName || "Unknown student",
                topic: d.data().topic || "",
                day: d.data().day || "",
                time: d.data().time || "",
                status: d.data().status || "pending",
            }));
            setBookings(results);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [currentUser]);

    const pendingRequests = bookings.filter((b) => b.status === "pending");
    const confirmedSessions = bookings.filter((b) => b.status === "confirmed");
    const studentsHelped = new Set(bookings.filter((b) => b.status === "completed").map((b) => b.studentName)).size;

    const handleAccept = async (id: string) => {
        setProcessingId(id);
        await updateDoc(doc(db, "bookings", id), { status: "confirmed" });
        setProcessingId(null);
    };

    const handleDecline = async (id: string) => {
        setProcessingId(id);
        await updateDoc(doc(db, "bookings", id), { status: "declined" });
        setProcessingId(null);
    };

    const handleComplete = async (id: string) => {
        setProcessingId(id);
        await updateDoc(doc(db, "bookings", id), { status: "completed" });
        setProcessingId(null);
    };

    return (
        <div className="min-h-screen bg-black text-slate-300 pt-24 flex">
            <MentorSidebar />

            <main className="flex-1 md:ml-64 px-6 md:px-10 py-8 relative overflow-hidden">
                <div className="absolute top-0 -z-10 left-1/3 size-96 bg-pink-600/20 blur-[150px] rounded-full" />

                <div className="max-w-4xl">
                    <h1 className="text-2xl font-semibold text-white">Welcome back, {firstName} 👋</h1>
                    <p className="text-slate-400 mt-1 text-sm">Here's what's happening with your mentees.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                        <div className="border border-slate-800 rounded-xl p-5 bg-slate-950/60">
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <UsersIcon className="size-4" />
                                Students helped
                            </div>
                            <p className="text-3xl font-semibold text-white mt-2">{studentsHelped}</p>
                        </div>
                        <div className="border border-slate-800 rounded-xl p-5 bg-slate-950/60">
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <StarIcon className="size-4" />
                                Average rating
                            </div>
                            <p className="text-3xl font-semibold text-white mt-2">{avgRating ? avgRating.toFixed(1) : "New"}</p>
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
                            {loading && <p className="text-slate-500 text-sm">Loading...</p>}
                            {!loading && pendingRequests.length === 0 && (
                                <p className="text-slate-500 text-sm py-8 text-center border border-slate-800 rounded-xl bg-slate-950/40">
                                    No pending requests right now.
                                </p>
                            )}
                            {pendingRequests.map((req, index) => (
                                <div
                                    key={req.id}
                                    className="flex items-center justify-between border border-slate-800 rounded-xl p-4 bg-slate-950/60"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`size-10 rounded-full ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
                                            {getInitials(req.studentName)}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-sm">{req.studentName}</p>
                                            <p className="text-slate-500 text-xs">{req.topic}</p>
                                            <p className="text-slate-600 text-xs mt-0.5">{req.day} · {req.time}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleDecline(req.id)}
                                            disabled={processingId === req.id}
                                            className="size-8 rounded-lg border border-slate-700 hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center transition"
                                        >
                                            <XIcon className="size-4 text-slate-400" />
                                        </button>
                                        <button
                                            onClick={() => handleAccept(req.id)}
                                            disabled={processingId === req.id}
                                            className="size-8 rounded-lg bg-pink-600 hover:bg-pink-700 disabled:opacity-50 flex items-center justify-center transition"
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
                        </div>

                        <div className="mt-5 space-y-3">
                            {!loading && confirmedSessions.length === 0 && (
                                <p className="text-slate-500 text-sm py-8 text-center border border-slate-800 rounded-xl bg-slate-950/40">
                                    No confirmed sessions yet.
                                </p>
                            )}
                            {confirmedSessions.map((session, index) => (
                                <div
                                    key={session.id}
                                    className="flex items-center justify-between border border-slate-800 rounded-xl p-4 bg-slate-950/60"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`size-10 rounded-full ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
                                            {getInitials(session.studentName)}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-sm">{session.topic}</p>
                                            <p className="text-slate-500 text-xs">with {session.studentName} · {session.day} · {session.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs px-2.5 py-1 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                                            Confirmed
                                        </span>
                                        <Link
                                            to={`/call/${session.id}`}
                                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-700 text-white transition"
                                        >
                                            <VideoIcon className="size-3.5" />
                                            Join
                                        </Link>
                                        <button
                                            onClick={() => handleComplete(session.id)}
                                            disabled={processingId === session.id}
                                            className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 disabled:opacity-50 transition"
                                        >
                                            Mark as completed
                                        </button>
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