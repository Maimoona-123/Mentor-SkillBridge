'use client'
import { useState } from "react";
import { Link } from "react-router-dom";
import { SearchIcon, CalendarIcon, VideoIcon, StarIcon, BookOpenIcon, AwardIcon } from "lucide-react";

const studentSteps = [
    { icon: SearchIcon, title: "Browse mentors", description: "Filter by skill — React, Firebase, design, marketing, whatever you're stuck on." },
    { icon: CalendarIcon, title: "Book a free slot", description: "Pick from a mentor's real availability. No back-and-forth messages needed." },
    { icon: VideoIcon, title: "Join the video call", description: "A built-in call opens right in your dashboard — no extra apps to install." },
    { icon: StarIcon, title: "Rate your session", description: "Help other students find great mentors by leaving a quick rating." },
];

const courseSteps = [
    { icon: BookOpenIcon, title: "Enroll in a course", description: "Structured, module-based courses created by mentors — Web Dev, Design, Marketing, AI, and more." },
    { icon: AwardIcon, title: "Earn a certificate", description: "Complete every module and get a certificate with your name and your mentor's on it." },
];

export default function HowItWorks() {
    const [tab, setTab] = useState<"student" | "mentor">("student");

    return (
        <div className="relative min-h-screen bg-black text-slate-300 px-4 md:px-16 lg:px-24 xl:px-32 pt-40 pb-24 overflow-hidden">
            <div className="absolute top-10 -z-10 left-1/4 size-96 bg-pink-600/40 blur-[150px] rounded-full" />

            <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-4xl font-semibold text-white">How SkillBridge works</h1>
                <p className="text-slate-400 mt-3">Simple, free, and built around real conversations — not endless tutorials.</p>
            </div>

            <div className="flex justify-center mt-8">
                <div className="flex border border-slate-700 rounded-full p-1">
                    <button
                        onClick={() => setTab("student")}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition ${tab === "student" ? "bg-pink-600 text-white" : "text-slate-400"}`}
                    >
                        I'm a Student
                    </button>
                    <button
                        onClick={() => setTab("mentor")}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition ${tab === "mentor" ? "bg-pink-600 text-white" : "text-slate-400"}`}
                    >
                        I'm a Mentor
                    </button>
                </div>
            </div>

            {tab === "student" ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto mt-14">
                        {studentSteps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div key={step.title} className="border border-slate-800 rounded-xl p-6 bg-slate-950/60 relative">
                                    <span className="absolute top-4 right-4 text-xs text-slate-600 font-mono">0{index + 1}</span>
                                    <div className="size-10 rounded-lg bg-pink-600/10 border border-pink-600/30 flex items-center justify-center mb-4">
                                        <Icon className="size-5 text-pink-500" />
                                    </div>
                                    <p className="text-white font-medium">{step.title}</p>
                                    <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">{step.description}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="max-w-2xl mx-auto mt-16">
                        <p className="text-center text-slate-500 text-sm mb-6">Want something more structured?</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {courseSteps.map((step) => {
                                const Icon = step.icon;
                                return (
                                    <div key={step.title} className="border border-slate-800 rounded-xl p-6 bg-slate-950/60">
                                        <div className="size-10 rounded-lg bg-pink-600/10 border border-pink-600/30 flex items-center justify-center mb-4">
                                            <Icon className="size-5 text-pink-500" />
                                        </div>
                                        <p className="text-white font-medium">{step.title}</p>
                                        <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">{step.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="text-center mt-16">
                        <Link to="/mentors" className="inline-block bg-pink-600 hover:bg-pink-700 text-white px-8 py-3.5 rounded-full font-medium transition">
                            Browse mentors
                        </Link>
                    </div>
                </>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto mt-14">
                        <div className="border border-slate-800 rounded-xl p-6 bg-slate-950/60">
                            <p className="text-white font-medium">Set your availability</p>
                            <p className="text-slate-400 text-sm mt-1.5">Add the time slots that work for you — students book directly, no scheduling back-and-forth.</p>
                        </div>
                        <div className="border border-slate-800 rounded-xl p-6 bg-slate-950/60">
                            <p className="text-white font-medium">Accept or decline requests</p>
                            <p className="text-slate-400 text-sm mt-1.5">See who's booking and what they want help with before you confirm.</p>
                        </div>
                        <div className="border border-slate-800 rounded-xl p-6 bg-slate-950/60">
                            <p className="text-white font-medium">Meet over video</p>
                            <p className="text-slate-400 text-sm mt-1.5">Join the built-in call from your dashboard — no extra apps.</p>
                        </div>
                        <div className="border border-slate-800 rounded-xl p-6 bg-slate-950/60">
                            <p className="text-white font-medium">Create a course, optionally</p>
                            <p className="text-slate-400 text-sm mt-1.5">Build a structured course with modules and issue certificates to students who finish it.</p>
                        </div>
                    </div>

                    <div className="text-center mt-16">
                        <Link to="/become-a-mentor" className="inline-block bg-pink-600 hover:bg-pink-700 text-white px-8 py-3.5 rounded-full font-medium transition">
                            Become a mentor
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}