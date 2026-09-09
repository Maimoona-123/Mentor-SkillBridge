'use client'
import { StarIcon, CalendarIcon, ClockIcon } from "lucide-react";

const availableSlots = [
    { day: "Mon", date: "8 Sep", times: ["4:00 PM", "6:30 PM"] },
    { day: "Wed", date: "10 Sep", times: ["5:00 PM"] },
    { day: "Fri", date: "12 Sep", times: ["3:00 PM", "7:00 PM"] },
];

export default function MentorProfile() {
    return (
        <div className="relative min-h-screen bg-black text-slate-300 px-4 md:px-16 lg:px-24 xl:px-32 pt-40 pb-24 overflow-hidden">
            <div className="absolute top-10 -z-10 left-1/4 size-96 bg-pink-600/40 blur-[150px] rounded-full" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
                {/* Left: Profile info */}
                <div className="lg:col-span-2">
                    <div className="flex items-center gap-4">
                        <div className="size-20 rounded-full bg-pink-600 flex items-center justify-center text-white font-semibold text-2xl flex-shrink-0">
                            AZ
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold text-white">Ayesha Zafar</h1>
                            <p className="text-slate-400">Frontend Developer at a startup in Karachi</p>
                            <div className="flex items-center gap-1.5 mt-1.5 text-sm">
                                <StarIcon className="size-4 fill-amber-400 text-amber-400" />
                                <span className="text-white">4.9</span>
                                <span className="text-slate-600">· 32 sessions completed</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-6">
                        {["React", "Redux", "Firebase", "Tailwind CSS", "JavaScript"].map((skill) => (
                            <span key={skill} className="text-sm px-3 py-1.5 rounded-full border border-slate-700 text-slate-400">
                                {skill}
                            </span>
                        ))}
                    </div>

                    <div className="mt-8 border-t border-slate-800 pt-6">
                        <h2 className="text-white font-medium mb-3">About</h2>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            I've been building frontend applications professionally for 4 years, mostly with React
                            and Firebase. I started mentoring because I remember how confusing state management felt
                            when I was learning — happy to walk through hooks, Redux, or just debug whatever you're
                            stuck on. No question is too basic.
                        </p>
                    </div>

                    <div className="mt-8 border-t border-slate-800 pt-6">
                        <h2 className="text-white font-medium mb-4">What students say</h2>
                        <div className="space-y-4">
                            <div className="border border-slate-800 rounded-lg p-4 bg-slate-950/40">
                                <p className="text-sm text-slate-300">
                                    "Explained Firebase auth better in 30 minutes than a week of tutorials did."
                                </p>
                                <p className="text-xs text-slate-600 mt-2">— Maria Usman</p>
                            </div>
                            <div className="border border-slate-800 rounded-lg p-4 bg-slate-950/40">
                                <p className="text-sm text-slate-300">
                                    "Patient, clear, and actually checked my code before the call."
                                </p>
                                <p className="text-xs text-slate-600 mt-2">— Hamza Aslam</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Booking card */}
                <div className="lg:col-span-1">
                    <div className="border border-slate-800 rounded-xl p-6 bg-slate-950/60 sticky top-28">
                        <div className="flex items-center gap-2 text-white font-medium">
                            <CalendarIcon className="size-4.5" />
                            Available slots
                        </div>

                        <div className="mt-5 space-y-4">
                            {availableSlots.map((slot) => (
                                <div key={slot.date}>
                                    <p className="text-sm text-slate-400">
                                        {slot.day}, {slot.date}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {slot.times.map((time) => (
                                            <button
                                                key={time}
                                                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-slate-700 hover:border-pink-500 hover:text-white transition"
                                            >
                                                <ClockIcon className="size-3.5" />
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition">
                            Book Session
                        </button>
                        <p className="text-center text-xs text-slate-600 mt-3">Free · 30 minutes</p>
                    </div>
                </div>
            </div>
        </div>
    );
}