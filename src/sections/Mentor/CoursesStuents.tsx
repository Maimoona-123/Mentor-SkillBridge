'use client'
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, collection, onSnapshot } from "firebase/firestore";
import { ArrowLeftIcon, AwardIcon, LinkIcon } from "lucide-react";
import MentorSidebar from "../../components/MentorSidebar";
import { db } from "../../firebase";

interface Enrollment {
    id: string;
    studentName: string;
    completedModules: number[];
}

export default function CourseStudents() {
    const { id } = useParams();
    const [courseTitle, setCourseTitle] = useState("");
    const [totalModules, setTotalModules] = useState(0);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        const loadCourse = async () => {
            if (!id) return;
            const snap = await getDoc(doc(db, "courses", id));
            if (snap.exists()) {
                setCourseTitle(snap.data().title);
                setTotalModules((snap.data().modules || []).length);
            }
        };
        loadCourse();
    }, [id]);

    useEffect(() => {
        if (!id) return;
        const unsubscribe = onSnapshot(collection(db, "courses", id, "enrollments"), (snapshot) => {
            const results: Enrollment[] = snapshot.docs.map((d) => ({
                id: d.id,
                studentName: d.data().studentName || "Unknown student",
                completedModules: d.data().completedModules || [],
            }));
            setEnrollments(results);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [id]);

    const copyCertLink = (studentId: string) => {
        const url = `${window.location.origin}/courses/${id}/certificate/${studentId}`;
        navigator.clipboard.writeText(url);
        setCopiedId(studentId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="min-h-screen bg-black text-slate-300 pt-24 flex">
            <MentorSidebar />

            <main className="flex-1 md:ml-64 px-6 md:px-10 py-8 relative overflow-hidden">
                <div className="absolute top-0 -z-10 left-1/3 size-96 bg-pink-600/20 blur-[150px] rounded-full" />

                <div className="max-w-2xl">
                    <Link to="/mentor-dashboard/courses" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition mb-4 w-fit">
                        <ArrowLeftIcon className="size-4" />
                        Back to My Courses
                    </Link>

                    <h1 className="text-2xl font-semibold text-white">{courseTitle}</h1>
                    <p className="text-slate-400 mt-1 text-sm">Students enrolled in this course and their progress.</p>

                    <div className="mt-6 space-y-3">
                        {loading && <p className="text-slate-500 text-sm">Loading students...</p>}

                        {!loading && enrollments.length === 0 && (
                            <p className="text-slate-500 text-sm py-10 text-center border border-slate-800 rounded-xl bg-slate-950/40">
                                No students enrolled yet. Share your course link to get started.
                            </p>
                        )}

                        {enrollments.map((enrollment) => {
                            const progress = totalModules > 0 ? enrollment.completedModules.length / totalModules : 0;
                            const isComplete = totalModules > 0 && enrollment.completedModules.length === totalModules;

                            return (
                                <div
                                    key={enrollment.id}
                                    className="border border-slate-800 rounded-xl p-4 bg-slate-950/60"
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-white font-medium text-sm">{enrollment.studentName}</p>
                                        {isComplete ? (
                                            <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                                <AwardIcon className="size-3.5" />
                                                Completed
                                            </span>
                                        ) : (
                                            <span className="text-xs text-slate-500">
                                                {enrollment.completedModules.length}/{totalModules} modules
                                            </span>
                                        )}
                                    </div>

                                    <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${isComplete ? "bg-emerald-500" : "bg-pink-600"}`}
                                            style={{ width: `${progress * 100}%` }}
                                        />
                                    </div>

                                    {isComplete && (
                                        <div className="flex gap-2 mt-3">
                                            <Link
                                                to={`/courses/${id}/certificate/${enrollment.id}`}
                                                className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition"
                                            >
                                                View Certificate
                                            </Link>
                                            <button
                                                onClick={() => copyCertLink(enrollment.id)}
                                                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 transition"
                                            >
                                                <LinkIcon className="size-3.5" />
                                                {copiedId === enrollment.id ? "Copied!" : "Copy Certificate Link"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
}