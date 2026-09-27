'use client'
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
    doc, getDoc, setDoc, updateDoc, increment, onSnapshot,
} from "firebase/firestore";
import { CheckCircle2Icon, CircleIcon, AwardIcon } from "lucide-react";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

interface CourseData {
    title: string;
    category: string;
    description: string;
    mentorName: string;
    modules: string[];
}

export default function CourseDetail() {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const [course, setCourse] = useState<CourseData | null>(null);
    const [loading, setLoading] = useState(true);
    const [enrolled, setEnrolled] = useState(false);
    const [completedModules, setCompletedModules] = useState<number[]>([]);
    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            if (!id) return;
            const snap = await getDoc(doc(db, "courses", id));
            if (snap.exists()) {
                const data = snap.data();
                setCourse({
                    title: data.title,
                    category: data.category,
                    description: data.description || "",
                    mentorName: data.mentorName || "Unknown mentor",
                    modules: data.modules || [],
                });
            }
            setLoading(false);
        };
        fetchCourse();
    }, [id]);

    useEffect(() => {
        if (!id || !currentUser) return;
        const enrollmentRef = doc(db, "courses", id, "enrollments", currentUser.uid);
        const unsubscribe = onSnapshot(enrollmentRef, (snap) => {
            if (snap.exists()) {
                setEnrolled(true);
                setCompletedModules(snap.data().completedModules || []);
            } else {
                setEnrolled(false);
                setCompletedModules([]);
            }
        });
        return () => unsubscribe();
    }, [id, currentUser]);

    const handleEnroll = async () => {
        if (!id || !currentUser) return;
        setEnrolling(true);
        try {
            await setDoc(doc(db, "courses", id, "enrollments", currentUser.uid), {
                studentId: currentUser.uid,
                studentName: currentUser.name,
                completedModules: [],
                enrolledAt: new Date().toISOString(),
            });
            await updateDoc(doc(db, "courses", id), { enrolledCount: increment(1) });
        } finally {
            setEnrolling(false);
        }
    };

    const toggleModule = async (index: number) => {
        if (!id || !currentUser) return;
        const updated = completedModules.includes(index)
            ? completedModules.filter((i) => i !== index)
            : [...completedModules, index];
        await updateDoc(doc(db, "courses", id, "enrollments", currentUser.uid), {
            completedModules: updated,
        });
    };

    if (loading) {
        return <div className="min-h-screen bg-black flex items-center justify-center"><p className="text-slate-500 text-sm">Loading course...</p></div>;
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-3">
                <p className="text-slate-400 text-sm">Course not found.</p>
                <Link to="/courses" className="text-pink-500 hover:text-pink-400 text-sm">Back to courses</Link>
            </div>
        );
    }

    const isComplete = course.modules.length > 0 && completedModules.length === course.modules.length;

    return (
        <div className="relative min-h-screen bg-black text-slate-300 px-4 pt-40 pb-24 overflow-hidden">
            <div className="absolute top-10 -z-10 left-1/4 size-96 bg-pink-600/40 blur-[150px] rounded-full" />

            <div className="max-w-2xl mx-auto">
                <span className="text-xs px-2.5 py-1 rounded-full border border-slate-700 text-slate-400">{course.category}</span>
                <h1 className="text-3xl font-semibold text-white mt-3">{course.title}</h1>
                <p className="text-slate-400 mt-2">{course.description}</p>
                <p className="text-slate-500 text-sm mt-2">Taught by {course.mentorName} · {course.modules.length} modules</p>

                {!enrolled && (
                    <button
                        onClick={handleEnroll}
                        disabled={enrolling}
                        className="mt-6 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white px-8 py-3 rounded-lg font-medium transition"
                    >
                        {enrolling ? "Enrolling..." : "Enroll for free"}
                    </button>
                )}

                {enrolled && isComplete && (
                    <div className="mt-6 border border-emerald-600/30 bg-emerald-500/10 rounded-xl p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <AwardIcon className="size-6 text-emerald-400" />
                            <div>
                                <p className="text-white font-medium text-sm">Course completed!</p>
                                <p className="text-slate-400 text-xs">You've finished all modules.</p>
                            </div>
                        </div>
                        <Link
                            to={`/courses/${id}/certificate/${currentUser?.uid}`}
                            className="text-sm px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition"
                        >
                            View Certificate
                        </Link>
                    </div>
                )}

                <div className="mt-8">
                    <h2 className="text-white font-medium mb-4">Modules</h2>
                    <div className="space-y-2">
                        {course.modules.map((mod, index) => {
                            const isDone = completedModules.includes(index);
                            return (
                                <button
                                    key={index}
                                    onClick={() => enrolled && toggleModule(index)}
                                    disabled={!enrolled}
                                    className={`w-full flex items-center gap-3 p-4 rounded-lg border text-left transition ${
                                        isDone
                                            ? "border-emerald-600/30 bg-emerald-500/5"
                                            : "border-slate-800 bg-slate-950/60"
                                    } ${enrolled ? "hover:border-slate-700 cursor-pointer" : "cursor-default opacity-70"}`}
                                >
                                    {isDone ? (
                                        <CheckCircle2Icon className="size-5 text-emerald-400 flex-shrink-0" />
                                    ) : (
                                        <CircleIcon className="size-5 text-slate-600 flex-shrink-0" />
                                    )}
                                    <span className={`text-sm ${isDone ? "text-emerald-300" : "text-slate-300"}`}>
                                        {index + 1}. {mod}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    {enrolled && !isComplete && (
                        <p className="text-slate-500 text-xs mt-3">Click a module once you've covered it with your mentor.</p>
                    )}
                </div>
            </div>
        </div>
    );
}