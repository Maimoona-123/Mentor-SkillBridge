'use client'
import { useState } from "react";
import { UserIcon, MailIcon, CameraIcon, BriefcaseIcon } from "lucide-react";
import MentorSidebar from "../../components/MentorSidebar";

const allSkills = ["React", "Node.js", "Python", "UI/UX", "Firebase", "Machine Learning", "MongoDB", "DevOps", "Redux", "TypeScript"];

export default function MentorProfileEdit() {
    const [selectedSkills, setSelectedSkills] = useState<string[]>(["React", "Redux", "Firebase"]);

    const toggleSkill = (skill: string) => {
        setSelectedSkills((prev) =>
            prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
        );
    };

    return (
        <div className="min-h-screen bg-black text-slate-300 pt-24 flex">
            <MentorSidebar />

            <main className="flex-1 md:ml-64 px-6 md:px-10 py-8 relative overflow-hidden">
                <div className="absolute top-0 -z-10 left-1/3 size-96 bg-pink-600/20 blur-[150px] rounded-full" />

                <div className="max-w-2xl">
                    <h1 className="text-2xl font-semibold text-white">Mentor profile</h1>
                    <p className="text-slate-400 mt-1 text-sm">This is what students see when they view your profile.</p>

                    {/* Avatar */}
                    <div className="flex items-center gap-5 mt-8">
                        <div className="relative">
                            <div className="size-20 rounded-full bg-pink-600 flex items-center justify-center text-white font-semibold text-2xl">
                                AZ
                            </div>
                            <button className="absolute -bottom-1 -right-1 size-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition">
                                <CameraIcon className="size-3.5 text-slate-300" />
                            </button>
                        </div>
                        <div>
                            <p className="text-white font-medium">Ayesha Zafar</p>
                            <p className="text-slate-500 text-sm">Mentor · 32 sessions completed</p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="mt-10 space-y-5">
                        <div>
                            <p className="mb-2 text-sm font-medium text-slate-200">Full name</p>
                            <div className="flex items-center gap-2 px-3.5 rounded-lg border border-slate-700 bg-slate-900/50 focus-within:border-pink-500 transition">
                                <UserIcon className="size-4.5 text-slate-500" />
                                <input
                                    type="text"
                                    defaultValue="Ayesha Zafar"
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
                                    defaultValue="ayesha.zafar@email.com"
                                    className="w-full py-3 outline-none bg-transparent text-white text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <p className="mb-2 text-sm font-medium text-slate-200">Current role</p>
                            <div className="flex items-center gap-2 px-3.5 rounded-lg border border-slate-700 bg-slate-900/50 focus-within:border-pink-500 transition">
                                <BriefcaseIcon className="size-4.5 text-slate-500" />
                                <input
                                    type="text"
                                    defaultValue="Frontend Developer"
                                    className="w-full py-3 outline-none bg-transparent text-white text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <p className="mb-2 text-sm font-medium text-slate-200">About you</p>
                            <textarea
                                rows={4}
                                defaultValue="I've been building frontend applications for 4 years, mostly with React and Firebase. Happy to help with hooks, state management, or debugging."
                                className="w-full p-3.5 rounded-lg border border-slate-700 bg-slate-900/50 focus:border-pink-500 outline-none text-white text-sm resize-none transition"
                            />
                        </div>

                        <div>
                            <p className="mb-2 text-sm font-medium text-slate-200">Skills you mentor in</p>
                            <div className="flex flex-wrap gap-2">
                                {allSkills.map((skill) => (
                                    <button
                                        key={skill}
                                        type="button"
                                        onClick={() => toggleSkill(skill)}
                                        className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition ${
                                            selectedSkills.includes(skill)
                                                ? "bg-pink-600 text-white"
                                                : "border border-slate-700 text-slate-400 hover:border-slate-500"
                                        }`}
                                    >
                                        {skill}
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