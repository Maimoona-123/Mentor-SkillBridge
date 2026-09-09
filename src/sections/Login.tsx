"use client";

import { useState } from "react";
import { MailIcon, LockIcon } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../firebase";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userDoc = await getDoc(
        doc(db, "users", result.user.uid)
      );

      if (!userDoc.exists()) {
        setError(
          "No account data found. Please contact support."
        );
        setLoading(false);
        return;
      }

      const role = userDoc.data().role;

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
      <div className="absolute top-30 left-1/4 size-72 bg-pink-600 blur-[300px] opacity-70 z-0" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md border border-slate-800 rounded-2xl p-8 md:p-10 bg-black/90 backdrop-blur-xl shadow-2xl shadow-pink-900/20">

        <h1 className="text-3xl font-semibold text-white text-center">
          Welcome back
        </h1>

        <p className="text-center text-slate-400 mt-2 text-sm">
          Log in to book a session or manage your mentorship
        </p>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="mt-8 space-y-4"
        >

          {/* Email */}
          <div>
            <p className="mb-1.5 text-sm font-medium text-slate-200">
              Email
            </p>

            <div className="flex items-center gap-2 px-3.5 rounded-lg border border-slate-700 bg-black/70 focus-within:border-pink-500 transition">
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

            <div className="flex items-center gap-2 px-3.5 rounded-lg border border-slate-700 bg-black/70 focus-within:border-pink-500 transition">
              <LockIcon className="size-4.5 text-slate-500" />

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full py-3 outline-none bg-transparent text-white placeholder:text-slate-600 text-sm"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm">
              {error}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50 active:scale-[0.99] text-white py-3 rounded-lg font-medium transition-all"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        {/* Signup */}
        <p className="text-center text-sm text-slate-400 mt-6">
          Don't have an account?{" "}

          <Link
            to="/signup"
            className="text-pink-500 hover:text-pink-400 font-medium"
          >
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}