'use client'
import { useState } from "react";
import { UserIcon, MailIcon, CameraIcon } from "lucide-react";
import DashboardSidebar from "../../components/DashboardSidebar";
import { useAuth } from "../../context/AuthContext";

const allInterests = ["React", "Node.js", "Python", "UI/UX", "Firebase", "Machine Learning", "MongoDB", "DevOps"];

const getInitials = (name: string) =>
    name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

export default function StudentProfile() {
    const { currentUser } = useAuth();
    const [selectedInterests, setSelectedInterests] = useState<string[]>(["React", "Firebase"]);

    const toggleInterest = (interest: string) => {
        setSelectedInterests((prev) =>
            prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
        );
    };

    return (
        <div className="min-h-screen bg-black text-slate-300 pt-24 flex">
            <DashboardSidebar />

            <main className="flex-1 md:ml-64 px-6 md:px-10 py-8 relative overflow-hidden">
                <div className="absolute top-0 -z-10 left-1/3 size-96 bg-pink-600/20 blur-[150px] rounded-full" />

                <div className="max-w-2xl">
                    <h1 className="text-2xl font-semibold text-white">My Profile</h1>
                    <p className="text-slate-400 mt-1 text-sm">Update your details and interests.</p>

                    <div className="flex items-center gap-5 mt-8">
                        <div className="relative">
                            <div className="size-20 rounded-full bg-pink-600 flex items-center justify-center text-white font-semibold text-2xl">
                                {currentUser ? getInitials(currentUser.name) : "?"}
                            </div>
                            <button className="absolute -bottom-1 -right-1 size-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition">
                                <CameraIcon className="size-3.5 text-slate-300" />
                            </button>
                        </div>
                        <div>
                            <p className="text-white font-medium">{currentUser?.name || "Guest"}</p>
                            <p className="text-slate-500 text-sm">Student</p>
                        </div>
                    </div>

                    <div className="mt-10 space-y-5">
                        <div>
                            <p className="mb-2 text-sm font-medium text-slate-200">Full name</p>
                            <div className="flex items-center gap-2 px-3.5 rounded-lg border border-slate-700 bg-slate-900/50 focus-within:border-pink-500 transition">
                                <UserIcon className="size-4.5 text-slate-500" />
                                <input
                                    type="text"
                                    defaultValue={currentUser?.name || ""}
                                    className="w-full py-3 outline-none bg-transparent text-white text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <p className="mb-2 text-sm font-medium text-slate-200">Email</p>
                            <div className="flex items-center gap-2 px-3.5 rounded-lg border border-slate-700 bg-slate-900/50 focus-within:border-pink-500 transition">
                                <MailIcon className="size-4.5 text-slate-500" />
                                <input
                                    type="email"
                                    defaultValue={currentUser?.email || ""}
                                    className="w-full py-3 outline-none bg-transparent text-white text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <p className="mb-2 text-sm font-medium text-slate-200">About you</p>
                            <textarea
                                rows={4}
                                placeholder="Tell mentors a bit about yourself and what you're learning"
                                className="w-full p-3.5 rounded-lg border border-slate-700 bg-slate-900/50 focus:border-pink-500 outline-none text-white text-sm resize-none transition placeholder:text-slate-600"
                            />
                        </div>

                        <div>
                            <p className="mb-2 text-sm font-medium text-slate-200">What do you want to learn?</p>
                            <div className="flex flex-wrap gap-2">
                                {allInterests.map((interest) => (
                                    <button
                                        key={interest}
                                        type="button"
                                        onClick={() => toggleInterest(interest)}
                                        className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition ${
                                            selectedInterests.includes(interest)
                                                ? "bg-pink-600 text-white"
                                                : "border border-slate-700 text-slate-400 hover:border-slate-500"
                                        }`}
                                    >
                                        {interest}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-medium transition mt-4">
                            Save changes
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}