'use client'
import { useState } from "react";
import { CalendarIcon, ClockIcon, CheckCircle2Icon } from "lucide-react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

interface BookingState {
    mentorId: string;
    mentorName: string;
    mentorRole: string;
    slot: { day: string; time: string };
}

const getInitials = (name: string) =>
    name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

export default function BookingConfirmation() {
    const location = useLocation();
    const { currentUser } = useAuth();
    const state = location.state as BookingState | null;

    const [message, setMessage] = useState("");
    const [confirmed, setConfirmed] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    if (!state) {
        return <Navigate to="/mentors" replace />;
    }

    const handleConfirm = async () => {
        if (!currentUser) {
            setError("You need to be logged in to book a session.");
            return;
        }
        setSaving(true);
        setError("");
        try {
            await addDoc(collection(db, "bookings"), {
                studentId: currentUser.uid,
                studentName: currentUser.name,
                mentorId: state.mentorId,
                mentorName: state.mentorName,
                topic: message || "General mentorship session",
                day: state.slot.day,
                time: state.slot.time,
                status: "pending",
                createdAt: serverTimestamp(),
            });
            setConfirmed(true);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (confirmed) {
        return (
            <div className="relative min-h-screen bg-black text-slate-300 flex items-center justify-center px-4 overflow-hidden">
                <div className="absolute top-10 -z-10 left-1/3 size-96 bg-pink-600/30 blur-[150px] rounded-full" />
                <div className="text-center max-w-sm">
                    <div className="size-16 rounded-full bg-pink-600/10 border border-pink-600/30 flex items-center justify-center mx-auto">
                        <CheckCircle2Icon className="size-8 text-pink-500" />
                    </div>
                    <h1 className="text-2xl font-semibold text-white mt-6">Session requested!</h1>
                    <p className="text-slate-400 mt-2 text-sm">
                        {state.mentorName} will confirm shortly. You'll see it update in your dashboard.
                    </p>
                    <Link
                        to="/dashboard"
                        className="inline-block mt-6 bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-medium transition"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-black text-slate-300 px-4 pt-40 pb-24 flex items-center justify-center overflow-hidden">
            <div className="absolute top-10 -z-10 left-1/3 size-96 bg-pink-600/30 blur-[150px] rounded-full" />

            <div className="w-full max-w-md border border-slate-800 rounded-2xl p-8 bg-slate-950/70 backdrop-blur-xl">
                <h1 className="text-2xl font-semibold text-white text-center">Confirm your session</h1>
                <p className="text-center text-slate-400 mt-2 text-sm">Double check the details before booking</p>

                <div className="flex items-center gap-3 mt-6 p-4 rounded-lg border border-slate-800 bg-slate-900/40">
                    <div className="size-11 rounded-full bg-pink-600 flex items-center justify-center text-white font-semibold text-sm">
                        {getInitials(state.mentorName)}
                    </div>
                    <div>
                        <p className="text-white font-medium text-sm">{state.mentorName}</p>
                        <p className="text-slate-500 text-xs">{state.mentorRole}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6 mt-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1.5">
                        <CalendarIcon className="size-4" />
                        {state.slot.day}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <ClockIcon className="size-4" />
                        {state.slot.time} · 30 min
                    </div>
                </div>

                <div className="mt-6">
                    <p className="mb-2 text-sm font-medium text-slate-200">What do you want to talk about?</p>
                    <textarea
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="e.g. Stuck on React state management for a project"
                        className="w-full p-3.5 rounded-lg border border-slate-700 bg-slate-900/50 focus:border-pink-500 outline-none text-white text-sm resize-none transition placeholder:text-slate-600"
                    />
                </div>

                {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

                <button
                    onClick={handleConfirm}
                    disabled={saving}
                    className="w-full mt-6 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition"
                >
                    {saving ? "Booking..." : "Confirm Booking"}
                </button>
                <p className="text-center text-xs text-slate-600 mt-3">Free · No payment required</p>
            </div>
        </div>
    );
}