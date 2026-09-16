'use client'
import { useState, useEffect } from "react";
import { VideoIcon, CalendarIcon, StarIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc, increment } from "firebase/firestore";
import DashboardSidebar from "../../components/DashboardSidebar";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";

const avatarColors = ["bg-pink-600", "bg-violet-600", "bg-emerald-600", "bg-amber-600", "bg-sky-600"];

const getInitials = (name: string) =>
    name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

interface Booking {
    id: string;
    mentorId: string;
    mentorName: string;
    topic: string;
    day: string;
    time: string;
    status: string;
    rating?: number;
}

const statusStyles: Record<string, string> = {
    confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    completed: "bg-slate-500/10 text-slate-400 border-slate-500/30",
    declined: "bg-red-500/10 text-red-400 border-red-500/30",
};

const tabs = ["All", "Upcoming", "Pending", "Completed"] as const;
type Tab = (typeof tabs)[number];

export default function StudentSessions() {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>("All");
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [ratingBookingId, setRatingBookingId] = useState<string | null>(null);
    const [hoverStar, setHoverStar] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!currentUser) return;
        const q = query(collection(db, "bookings"), where("studentId", "==", currentUser.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const results: Booking[] = snapshot.docs.map((d) => ({
                id: d.id,
                mentorId: d.data().mentorId || "",
                mentorName: d.data().mentorName || "Unknown mentor",
                topic: d.data().topic || "",
                day: d.data().day || "",
                time: d.data().time || "",
                status: d.data().status || "pending",
                rating: d.data().rating,
            }));
            setBookings(results);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [currentUser]);

    const filtered = bookings.filter((b) => {
        if (activeTab === "All") return true;
        if (activeTab === "Upcoming") return b.status === "confirmed";
        return b.status === activeTab.toLowerCase();
    });

    const submitRating = async (booking: Booking, stars: number) => {
        setSubmitting(true);
        try {
            await updateDoc(doc(db, "bookings", booking.id), { rating: stars });

            const mentorRef = doc(db, "users", booking.mentorId);
            const mentorSnap = await getDoc(mentorRef);
            if (mentorSnap.exists()) {
                await updateDoc(mentorRef, {
                    ratingSum: increment(stars),
                    ratingCount: increment(1),
                });
            }
            setRatingBookingId(null);
            setHoverStar(0);
        } finally {
            setSubmitting(false);
        }
    };

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

                    <div className="mt-6 space-y-3">
                        {loading && <p className="text-slate-500 text-sm py-6">Loading sessions...</p>}
                        {!loading && filtered.length === 0 && (
                            <p className="text-slate-500 text-sm py-10 text-center border border-slate-800 rounded-xl bg-slate-950/40">
                                No sessions here.
                            </p>
                        )}
                        {filtered.map((session, index) => (
                            <div
                                key={session.id}
                                className="border border-slate-800 rounded-xl p-4 bg-slate-950/60"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`size-10 rounded-full ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
                                            {getInitials(session.mentorName)}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-sm">{session.topic}</p>
                                            <p className="text-slate-500 text-xs">with {session.mentorName}</p>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                                                <CalendarIcon className="size-3.5" />
                                                {session.day} · {session.time}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${statusStyles[session.status]}`}>
                                            {session.status}
                                        </span>
                                        {session.status === "confirmed" && (
                                            <Link
                                                to={`/call/${session.id}`}
                                                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-700 text-white transition"
                                            >
                                                <VideoIcon className="size-3.5" />
                                                Join
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                {session.status === "completed" && !session.rating && (
                                    <div className="mt-3 pt-3 border-t border-slate-800">
                                        {ratingBookingId === session.id ? (
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs text-slate-400 mr-2">Rate this session:</p>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        disabled={submitting}
                                                        onMouseEnter={() => setHoverStar(star)}
                                                        onMouseLeave={() => setHoverStar(0)}
                                                        onClick={() => submitRating(session, star)}
                                                    >
                                                        <StarIcon
                                                            className={`size-5 transition ${
                                                                star <= hoverStar ? "fill-amber-400 text-amber-400" : "text-slate-600"
                                                            }`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setRatingBookingId(session.id)}
                                                className="text-xs text-pink-500 hover:text-pink-400"
                                            >
                                                Rate this session
                                            </button>
                                        )}
                                    </div>
                                )}

                                {session.status === "completed" && session.rating && (
                                    <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-1">
                                        <p className="text-xs text-slate-500 mr-1">Your rating:</p>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <StarIcon
                                                key={star}
                                                className={`size-3.5 ${star <= session.rating! ? "fill-amber-400 text-amber-400" : "text-slate-700"}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}