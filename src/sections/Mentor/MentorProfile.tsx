'use client'
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { StarIcon, CalendarIcon, ClockIcon } from "lucide-react";
import { db } from "../../firebase";

const getInitials = (name: string) =>
    name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

interface MentorData {
    name: string;
    currentRole: string;
    bio: string;
    skills: string[];
}

const availableSlots = [
    { day: "Mon", date: "8 Sep", times: ["4:00 PM", "6:30 PM"] },
    { day: "Wed", date: "10 Sep", times: ["5:00 PM"] },
    { day: "Fri", date: "12 Sep", times: ["3:00 PM", "7:00 PM"] },
];

export default function MentorProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mentor, setMentor] = useState<MentorData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState<{ day: string; date: string; time: string } | null>(null);

    useEffect(() => {
        const fetchMentor = async () => {
            if (!id) {
                setLoading(false);
                return;
            }
            try {
                const snap = await getDoc(doc(db, "users", id));
                if (snap.exists()) {
                    const data = snap.data();
                    setMentor({
                        name: data.name || "Unnamed Mentor",
                        currentRole: data.currentRole || "Mentor",
                        bio: data.bio || "This mentor hasn't added a bio yet.",
                        skills: data.skills || [],
                    });
                }
            } catch (err) {
                console.error("Failed to load mentor:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMentor();
    }, [id]);

    const handleBooking = () => {
        if (!selectedSlot || !mentor || !id) return;
        navigate("/booking", {
            state: {
                mentorId: id,
                mentorName: mentor.name,
                mentorRole: mentor.currentRole,
                slot: selectedSlot,
            },
        });
    };

    if (loading) {
        return (
            <div className="relative min-h-screen bg-black text-slate-300 px-4 pt-40 pb-24">
                <p className="text-slate-500 text-sm text-center">Loading mentor profile...</p>
            </div>
        );
    }

    if (!mentor) {
        return (
            <div className="relative min-h-screen bg-black text-slate-300 px-4 pt-40 pb-24 text-center">
                <p className="text-slate-400">Mentor not found.</p>
                <Link to="/mentors" className="text-pink-500 hover:text-pink-400 text-sm mt-2 inline-block">
                    Back to Browse Mentors
                </Link>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-black text-slate-300 px-4 md:px-16 lg:px-24 xl:px-32 pt-40 pb-24 overflow-hidden">
            <div className="absolute top-10 -z-10 left-1/4 size-96 bg-pink-600/40 blur-[150px] rounded-full" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
                <div className="lg:col-span-2">
                    <div className="flex items-center gap-4">
                        <div className="size-20 rounded-full bg-pink-600 flex items-center justify-center text-white font-semibold text-2xl flex-shrink-0">
                            {getInitials(mentor.name)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold text-white">{mentor.name}</h1>
                            <p className="text-slate-400">{mentor.currentRole}</p>
                            <div className="flex items-center gap-1.5 mt-1.5 text-sm">
                                <StarIcon className="size-4 fill-amber-400 text-amber-400" />
                                <span className="text-white">New</span>
                                <span className="text-slate-600">· 0 sessions completed</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-6">
                        {mentor.skills.length === 0 && <span className="text-sm text-slate-600">No skills listed yet</span>}
                        {mentor.skills.map((skill) => (
                            <span key={skill} className="text-sm px-3 py-1.5 rounded-full border border-slate-700 text-slate-400">
                                {skill}
                            </span>
                        ))}
                    </div>

                    <div className="mt-8 border-t border-slate-800 pt-6">
                        <h2 className="text-white font-medium mb-3">About</h2>
                        <p className="text-slate-400 leading-relaxed text-sm">{mentor.bio}</p>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="border border-slate-800 rounded-xl p-6 bg-slate-950/60 sticky top-28">
                        <div className="flex items-center gap-2 text-white font-medium">
                            <CalendarIcon className="size-4.5" />
                            Available slots
                        </div>

                        <div className="mt-5 space-y-4">
                            {availableSlots.map((slot) => (
                                <div key={slot.date}>
                                    <p className="text-sm text-slate-400">{slot.day}, {slot.date}</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {slot.times.map((time) => {
                                            const isSelected = selectedSlot?.date === slot.date && selectedSlot?.time === time;
                                            return (
                                                <button
                                                    key={time}
                                                    onClick={() => setSelectedSlot({ day: slot.day, date: slot.date, time })}
                                                    className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border transition ${
                                                        isSelected
                                                            ? "bg-pink-600 border-pink-600 text-white"
                                                            : "border-slate-700 hover:border-pink-500 hover:text-white"
                                                    }`}
                                                >
                                                    <ClockIcon className="size-3.5" />
                                                    {time}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleBooking}
                            disabled={!selectedSlot}
                            className="w-full mt-6 py-3 bg-pink-600 hover:bg-pink-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg font-medium transition"
                        >
                            {selectedSlot ? "Book Session" : "Select a time slot"}
                        </button>
                        <p className="text-center text-xs text-slate-600 mt-3">Free · 30 minutes</p>
                    </div>
                </div>
            </div>
        </div>
    );
}