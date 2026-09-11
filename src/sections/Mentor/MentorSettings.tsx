'use client'
import { useState } from "react";
import { LockIcon, BellIcon, Trash2Icon } from "lucide-react";
import MentorSidebar from "../../components/MentorSidebar";

export default function MentorSettings() {
    const [emailNotif, setEmailNotif] = useState(true);
    const [requestAlerts, setRequestAlerts] = useState(true);

    return (
        <div className="min-h-screen bg-black text-slate-300 pt-24 flex">
            <MentorSidebar />

            <main className="flex-1 md:ml-64 px-6 md:px-10 py-8 relative overflow-hidden">
                <div className="absolute top-0 -z-10 left-1/3 size-96 bg-pink-600/20 blur-[150px] rounded-full" />

                <div className="max-w-2xl">
                    <h1 className="text-2xl font-semibold text-white">Settings</h1>
                    <p className="text-slate-400 mt-1 text-sm">Manage your mentor account preferences.</p>

                    {/* Notifications */}
                    <div className="mt-8 border border-slate-800 rounded-xl p-6 bg-slate-950/60">
                        <div className="flex items-center gap-2 text-white font-medium">
                            <BellIcon className="size-4.5" />
                            Notifications
                        </div>

                        <div className="mt-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-white">Email notifications</p>
                                    <p className="text-xs text-slate-500">Get updates about your sessions via email</p>
                                </div>
                                <button
                                    onClick={() => setEmailNotif(!emailNotif)}
                                    className={`w-11 h-6 rounded-full transition relative ${emailNotif ? "bg-pink-600" : "bg-slate-700"}`}
                                >
                                    <span className={`absolute top-0.5 size-5 rounded-full bg-white transition-transform ${emailNotif ? "translate-x-5" : "translate-x-0.5"}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-white">New request alerts</p>
                                    <p className="text-xs text-slate-500">Notify me the moment a student books a slot</p>
                                </div>
                                <button
                                    onClick={() => setRequestAlerts(!requestAlerts)}
                                    className={`w-11 h-6 rounded-full transition relative ${requestAlerts ? "bg-pink-600" : "bg-slate-700"}`}
                                >
                                    <span className={`absolute top-0.5 size-5 rounded-full bg-white transition-transform ${requestAlerts ? "translate-x-5" : "translate-x-0.5"}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="mt-6 border border-slate-800 rounded-xl p-6 bg-slate-950/60">
                        <div className="flex items-center gap-2 text-white font-medium">
                            <LockIcon className="size-4.5" />
                            Password
                        </div>
                        <p className="text-xs text-slate-500 mt-1.5">Change the password for your account</p>

                        <div className="mt-4 space-y-3 max-w-sm">
                            <input
                                type="password"
                                placeholder="Current password"
                                className="w-full p-3 rounded-lg border border-slate-700 bg-slate-900/50 focus:border-pink-500 outline-none text-white text-sm transition"
                            />
                            <input
                                type="password"
                                placeholder="New password"
                                className="w-full p-3 rounded-lg border border-slate-700 bg-slate-900/50 focus:border-pink-500 outline-none text-white text-sm transition"
                            />
                            <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition">
                                Update password
                            </button>
                        </div>
                    </div>

                    {/* Danger zone */}
                    <div className="mt-6 border border-red-900/40 rounded-xl p-6 bg-red-950/10">
                        <div className="flex items-center gap-2 text-red-400 font-medium">
                            <Trash2Icon className="size-4.5" />
                            Delete mentor account
                        </div>
                        <p className="text-xs text-slate-500 mt-1.5">
                            This will permanently delete your mentor profile and remove you from all future bookings. This can't be undone.
                        </p>
                        <button className="mt-4 border border-red-800 text-red-400 hover:bg-red-950/40 px-6 py-2.5 rounded-lg font-medium text-sm transition">
                            Delete my account
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}