'use client'
import { Link } from "react-router-dom";
import { HeartIcon, ClockIcon, StarIcon, AwardIcon } from "lucide-react";

const benefits = [
    {
        icon: ClockIcon,
        title: "As little as 30 minutes",
        description: "No long-term commitment. Set your own availability, take as many or as few sessions as you want.",
    },
    {
        icon: StarIcon,
        title: "Build your reputation",
        description: "Get rated by students, showcase your skills, and build a public profile that shows your impact.",
    },
    {
        icon: AwardIcon,
        title: "Teach a full course",
        description: "Create structured courses with modules. Students who complete them earn a certificate — with your name on it.",
    },
    {
        icon: HeartIcon,
        title: "Real impact, real gratitude",
        description: "You remember what it felt like to be stuck. Be the person who helps someone else get unstuck.",
    },
];

const steps = [
    "Sign up with a mentor invite code (ask us for one)",
    "Fill out your profile — bio, skills, current role",
    "Add your available time slots or create a course",
    "Accept booking requests and start mentoring",
];

export default function BecomeMentor() {
    return (
        <div className="relative min-h-screen bg-black text-slate-300 px-4 md:px-16 lg:px-24 xl:px-32 pt-40 pb-24 overflow-hidden">
            <div className="absolute top-10 -z-10 left-1/4 size-96 bg-pink-600/40 blur-[150px] rounded-full" />

            <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-semibold text-white">
                    Someone helped you learn to code. <span className="text-pink-500">Pay it forward.</span>
                </h1>
                <p className="text-slate-400 mt-4 text-lg">
                    Become a mentor on SkillBridge and give students the same head start you once needed.
                </p>
                <Link
                    to="/signup"
                    className="inline-block mt-8 bg-pink-600 hover:bg-pink-700 text-white px-8 py-3.5 rounded-full font-medium transition"
                >
                    Become a mentor
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto mt-20">
                {benefits.map((benefit) => {
                    const Icon = benefit.icon;
                    return (
                        <div key={benefit.title} className="border border-slate-800 rounded-xl p-6 bg-slate-950/60">
                            <div className="size-10 rounded-lg bg-pink-600/10 border border-pink-600/30 flex items-center justify-center mb-4">
                                <Icon className="size-5 text-pink-500" />
                            </div>
                            <p className="text-white font-medium">{benefit.title}</p>
                            <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">{benefit.description}</p>
                        </div>
                    );
                })}
            </div>

            <div className="max-w-2xl mx-auto mt-20">
                <h2 className="text-2xl font-semibold text-white text-center">How to get started</h2>
                <div className="mt-8 space-y-4">
                    {steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-4 border border-slate-800 rounded-xl p-4 bg-slate-950/60">
                            <span className="size-7 rounded-full bg-pink-600 text-white text-sm font-medium flex items-center justify-center flex-shrink-0">
                                {index + 1}
                            </span>
                            <p className="text-slate-300 text-sm pt-0.5">{step}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-md mx-auto text-center mt-20 border border-slate-800 rounded-2xl p-8 bg-slate-950/60">
                <p className="text-white font-medium">Don't have an invite code?</p>
                <p className="text-slate-400 text-sm mt-2">
                    Message us and we'll get you set up — we vet mentors to keep the community trustworthy for students.
                </p>
            </div>
        </div>
    );
}