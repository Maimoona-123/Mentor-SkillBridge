"use client";

import { useState } from "react";
import { MailIcon, UserIcon, LockIcon, KeyIcon } from "lucide-react";
import {
    createUserWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../firebase";

const MENTOR_INVITE_CODE = "MENTOR-2026";

export default function SignUp() {
    const navigate = useNavigate();

    const [role, setRole] = useState<"student" | "mentor">("student");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [inviteCode, setInviteCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (
            role === "mentor" &&
            inviteCode.trim() !== MENTOR_INVITE_CODE
        ) {
            setError(
                "That mentor invite code isn't valid. Double check it and try again."
            );
            return;
        }

        setLoading(true);

        try {
            const result = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            await updateProfile(result.user, {
                displayName: name,
            });

            await setDoc(doc(db, "users", result.user.uid), {
                name,
                email,
                role,
                createdAt: new Date().toISOString(),
            });

            navigate(
                role === "mentor" ? "/mentor-dashboard" : "/dashboard"
            );
        } catch (err: any) {
            setError(err.message.replace("Firebase: ", ""));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center px-4 pt-40 pb-24 bg-black text-slate-300 overflow-hidden">

            {/* Pink Backdrop */}
            <div className="absolute top-30 left-1/4 size-72 bg-pink-600 blur-[300px]" />

            {/* Signup Card */}
            <div className="relative z-10 w-full max-w-md border border-slate-800 rounded-2xl p-8 md:p-10 bg-black backdrop-blur-xl shadow-2xl shadow-pink-900/20">

                <h1 className="text-3xl font-semibold text-white text-center">
                    Create your account
                </h1>

                <p className="text-center text-slate-400 mt-2 text-sm">
                    Join SkillBridge as a student or a mentor
                </p>

                {/* Role Selection */}
                <div className="flex mt-8 border border-slate-700 rounded-lg overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setRole("student")}
                        className={`w-1/2 py-2.5 text-sm font-medium transition ${role === "student"
                                ? "bg-pink-600 text-white"
                                : "text-slate-400 hover:bg-slate-800"
                            }`}
                    >
                        I'm a Student
                    </button>

                    <button
                        type="button"
                        onClick={() => setRole("mentor")}
                        className={`w-1/2 py-2.5 text-sm font-medium transition ${role === "mentor"
                                ? "bg-pink-600 text-white"
                                : "text-slate-400 hover:bg-slate-800"
                            }`}
                    >
                        I'm a Mentor
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSignUp}
                    className="mt-6 space-y-4"
                >

                    {/* Full Name */}
                    <div>
                        <p className="mb-1.5 text-sm font-medium text-slate-200">
                            Full name
                        </p>

                        <div className="flex items-center gap-2 px-3.5 rounded-lg border border-slate-700 bg-slate-900/50 focus-within:border-pink-500 transition">
                            <UserIcon className="size-4.5 text-slate-500" />

                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                className="w-full py-3 outline-none bg-transparent text-white placeholder:text-slate-600 text-sm"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <p className="mb-1.5 text-sm font-medium text-slate-200">
                            Email
                        </p>

                        <div className="flex items-center gap-2 px-3.5 rounded-lg border border-slate-700 bg-slate-900/50 focus-within:border-pink-500 transition">
                            <MailIcon className="size-4.5 text-slate-500" />

                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full py-3 outline-none bg-transparent text-white placeholder:text-slate-600 text-sm"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <p className="mb-1.5 text-sm font-medium text-slate-200">
                            Password
                        </p>

                        <div className="flex items-center gap-2 px-3.5 rounded-lg border border-slate-700 bg-slate-900/50 focus-within:border-pink-500 transition">
                            <LockIcon className="size-4.5 text-slate-500" />

                            <input
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="At least 6 characters"
                                className="w-full py-3 outline-none bg-transparent text-white placeholder:text-slate-600 text-sm"
                            />
                        </div>
                    </div>

                    {/* Mentor Invite Code */}
                    {role === "mentor" && (
                        <div>
                            <p className="mb-1.5 text-sm font-medium text-slate-200">
                                Mentor invite code
                            </p>

                            <div className="flex items-center gap-2 px-3.5 rounded-lg border border-slate-700 bg-slate-900/50 focus-within:border-pink-500 transition">
                                <KeyIcon className="size-4.5 text-slate-500" />

                                <input
                                    type="text"
                                    required
                                    value={inviteCode}
                                    onChange={(e) => setInviteCode(e.target.value)}
                                    placeholder="Enter the code you were given"
                                    className="w-full py-3 outline-none bg-transparent text-white placeholder:text-slate-600 text-sm"
                                />
                            </div>

                            <p className="text-xs text-slate-600 mt-1.5">
                                Only people invited to mentor need this.
                            </p>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <p className="text-red-400 text-sm">
                            {error}
                        </p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50 active:scale-[0.99] text-white py-3 rounded-lg font-medium transition-all"
                    >
                        {loading ? "Creating account..." : "Create account"}
                    </button>
                </form>

                {/* Login */}
                <p className="text-center text-sm text-slate-400 mt-6">
                    Already have an account?{" "}

                    <Link
                        to="/login"
                        className="text-pink-500 hover:text-pink-400 font-medium"
                    >
                        Log in
                    </Link>
                </p>

            </div>
        </div>
    );
}