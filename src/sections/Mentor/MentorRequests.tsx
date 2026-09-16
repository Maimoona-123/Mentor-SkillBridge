'use client'
import { useState, useEffect } from "react";
import { CheckIcon, XIcon } from "lucide-react";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
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
}

export default function MentorRequests() {
    const { currentUser } = useAuth();
    const [requests, setRequests] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        if (!currentUser) return;
        const q = query(
            collection(db, "bookings"),
            where("mentorId", "==", currentUser.uid),
            where("status", "==", "pending")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const results: Booking[] = snapshot.docs.map((d) => ({
                id: d.id,
                studentName: d.data().studentName || "Unknown student",
                topic: d.data().topic || "",
                day: d.data().day || "",
                time: d.data().time || "",
            }));
            setRequests(results);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [currentUser]);

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

    return (
        <div className="min-h-screen bg-black text-slate-300 pt-24 flex">
            <MentorSidebar />

            <main className="flex-1 md:ml-64 px-6 md:px-10 py-8 relative overflow-hidden">
                <div className="absolute top-0 -z-10 left-1/3 size-96 bg-pink-600/20 blur-[150px] rounded-full" />

                <div className="max-w-3xl">
                    <h1 className="text-2xl font-semibold text-white">Booking requests</h1>
                    <p className="text-slate-400 mt-1 text-sm">Students waiting for you to accept or decline a session.</p>

                    <div className="mt-8 space-y-3">
                        {loading && <p className="text-slate-500 text-sm">Loading requests...</p>}

                        {!loading && requests.length === 0 && (
                            <p className="text-slate-500 text-sm py-10 text-center border border-slate-800 rounded-xl bg-slate-950/40">
                                No pending requests right now.
                            </p>
                        )}

                        {requests.map((req, index) => (
                            <div
                                key={req.id}
                                className="flex items-center justify-between border border-slate-800 rounded-xl p-5 bg-slate-950/60"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`size-11 rounded-full ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
                                        {getInitials(req.studentName)}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium text-sm">{req.studentName}</p>
                                        <p className="text-slate-500 text-sm mt-0.5">{req.topic}</p>
                                        <p className="text-slate-600 text-xs mt-1">{req.day} · {req.time}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleDecline(req.id)}
                                        disabled={processingId === req.id}
                                        className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 disabled:opacity-50 transition"
                                    >
                                        <XIcon className="size-4" />
                                        Decline
                                    </button>
                                    <button
                                        onClick={() => handleAccept(req.id)}
                                        disabled={processingId === req.id}
                                        className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white transition"
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