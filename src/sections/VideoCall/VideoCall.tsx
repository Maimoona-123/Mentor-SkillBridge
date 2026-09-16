'use client'
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ArrowLeftIcon, CheckIcon } from "lucide-react";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

export default function VideoCall() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [marking, setMarking] = useState(false);
    const [marked, setMarked] = useState(false);

    useEffect(() => {
        const loadBooking = async () => {
            if (!bookingId) return;
            const snap = await getDoc(doc(db, "bookings", bookingId));
            if (snap.exists()) {
                setTopic(snap.data().topic || "Mentorship session");
                setMarked(snap.data().status === "completed");
            } else {
                setNotFound(true);
            }
            setLoading(false);
        };
        loadBooking();
    }, [bookingId]);

    const handleMarkDone = async () => {
        if (!bookingId) return;
        setMarking(true);
        try {
            await updateDoc(doc(db, "bookings", bookingId), { status: "completed" });
            setMarked(true);
        } finally {
            setMarking(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <p className="text-slate-500 text-sm">Setting up your call...</p>
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
                <p className="text-slate-400 text-sm">Session not found.</p>
                <button onClick={() => navigate(-1)} className="text-pink-500 hover:text-pink-400 text-sm">
                    Go back
                </button>
            </div>
        );
    }

    const displayName = encodeURIComponent(currentUser?.name || "Guest");
    const roomUrl = `https://meet.jit.si/skillbridge-session-${bookingId}#userInfo.displayName="${displayName}"`;
    const isMentor = currentUser?.role === "mentor";

    return (
        <div className="h-screen bg-black flex flex-col">
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-800 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="size-9 rounded-full border border-slate-700 hover:bg-slate-800 flex items-center justify-center transition"
                    >
                        <ArrowLeftIcon className="size-4 text-slate-300" />
                    </button>
                    <div>
                        <p className="text-white text-sm font-medium">{topic}</p>
                        <p className="text-slate-500 text-xs">SkillBridge Session</p>
                    </div>
                </div>

                {isMentor && (
                    marked ? (
                        <span className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            <CheckIcon className="size-3.5" />
                            Marked as completed
                        </span>
                    ) : (
                        <button
                            onClick={handleMarkDone}
                            disabled={marking}
                            className="text-xs px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-medium transition"
                        >
                            {marking ? "Marking..." : "End & mark as completed"}
                        </button>
                    )
                )}
            </div>
            <iframe
                src={roomUrl}
                allow="camera; microphone; fullscreen; display-capture; autoplay"
                style={{ flex: 1, width: "100%", border: 0 }}
                title="Video call"
            />
        </div>
    );
}