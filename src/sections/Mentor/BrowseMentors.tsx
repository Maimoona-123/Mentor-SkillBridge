"use client";

import { useState, useEffect } from "react";
import { SearchIcon, StarIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const avatarColors = ["bg-pink-600", "bg-violet-600", "bg-emerald-600", "bg-amber-600", "bg-sky-600", "bg-rose-600"];

const getInitials = (name: string) =>
    name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

interface Mentor {
    id: string;
    name: string;
    currentRole: string;
    skills: string[];
    ratingSum: number;
    ratingCount: number;
}

export default function BrowseMentors() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMentors = async () => {
            const q = query(collection(db, "users"), where("role", "==", "mentor"));
            const snapshot = await getDocs(q);
            const results: Mentor[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                name: doc.data().name || "Unnamed Mentor",
                currentRole: doc.data().currentRole || "Mentor",
                skills: doc.data().skills || [],
                ratingSum: doc.data().ratingSum || 0,
                ratingCount: doc.data().ratingCount || 0,
            }));
            setMentors(results);
            setLoading(false);
        };
        fetchMentors();
    }, []);

    const skillFilters = ["All", ...Array.from(new Set(mentors.flatMap((m) => m.skills)))];

    const filteredMentors =
        activeFilter === "All" ? mentors : mentors.filter((m) => m.skills.includes(activeFilter));

    return (
        <div className="relative min-h-screen bg-black text-slate-300 px-4 md:px-16 lg:px-24 xl:px-32 pt-40 pb-24 overflow-hidden">
            <div className="absolute top-10 left-1/4 size-96 bg-pink-600/50 blur-[180px] rounded-full -z-0" />
            <div className="absolute top-[500px] -right-40 size-80 bg-pink-600/30 blur-[160px] rounded-full -z-0" />

            <div className="relative z-10">
                <div className="max-w-2xl">
                    <h1 className="text-4xl font-semibold text-white">Browse mentors</h1>
                    <p className="text-slate-400 mt-3">
                        Developers and designers volunteering their time. Find someone who's already solved what you're stuck on.
                    </p>
                </div>

                <div className="flex items-center gap-2 mt-8 max-w-md pl-4 rounded-full border border-slate-700 bg-slate-900/50">
                    <SearchIcon className="size-4.5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search by name or skill"
                        className="w-full py-3 outline-none bg-transparent text-white placeholder:text-slate-600 text-sm"
                    />
                </div>

                {skillFilters.length > 1 && (
                    <div className="flex flex-wrap gap-2.5 mt-6">
                        {skillFilters.map((filter) => (
                            <button
                                key={filter}
                                type="button"
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                                    activeFilter === filter
                                        ? "bg-pink-600 text-white"
                                        : "border border-slate-700 text-slate-400 hover:border-slate-500"
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                )}

                {loading && <p className="text-slate-500 text-sm mt-10">Loading mentors...</p>}

                {!loading && filteredMentors.length === 0 && (
                    <p className="text-slate-500 text-sm mt-10 border border-slate-800 rounded-xl p-8 text-center bg-slate-950/40">
                        No mentors yet. Be the first to{" "}
                        <Link to="/signup" className="text-pink-500 hover:text-pink-400">
                            sign up as a mentor
                        </Link>
                        .
                    </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
                    {filteredMentors.map((mentor, index) => (
                        <div
                            key={mentor.id}
                            className="border border-slate-800 rounded-xl p-5 bg-slate-950/70 hover:border-slate-700 transition"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`size-12 rounded-full ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}
                                >
                                    {getInitials(mentor.name)}
                                </div>
                                <div>
                                    <p className="text-white font-medium">{mentor.name}</p>
                                    <p className="text-slate-500 text-sm">{mentor.currentRole}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-1.5 mt-4">
                                {mentor.skills.length === 0 && (
                                    <span className="text-xs text-slate-600">No skills listed yet</span>
                                )}
                                {mentor.skills.map((skill) => (
                                    <span key={skill} className="text-xs px-2.5 py-1 rounded-full border border-slate-700 text-slate-400">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between mt-5">
                                <div className="flex items-center gap-1 text-sm text-slate-400">
                                    <StarIcon className="size-4 fill-amber-400 text-amber-400" />
                                    <span>{mentor.ratingCount > 0 ? (mentor.ratingSum / mentor.ratingCount).toFixed(1) : "New mentor"}</span>
                                </div>
                            </div>

                            <Link
                                to={`/mentor/${mentor.id}`}
                                className="block w-full mt-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-medium transition text-center"
                            >
                                View Profile
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}