'use client'
import { useState, useEffect } from "react";
import { PlusIcon, TrashIcon, BookOpenIcon, LinkIcon } from "lucide-react";
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from "firebase/firestore";
import { Link } from "react-router-dom";
import MentorSidebar from "../../components/MentorSidebar";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";

const categories = ["Web Development", "Graphic Design", "Digital Marketing", "Shopify", "AI"];

interface Course {
    id: string;
    title: string;
    category: string;
    moduleCount: number;
    enrolledCount: number;
}

export default function CreateCourse() {
    const { currentUser } = useAuth();
    const [myCourses, setMyCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState(categories[0]);
    const [description, setDescription] = useState("");
    const [modules, setModules] = useState<string[]>([]);
    const [newModule, setNewModule] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const copyLink = (courseId: string) => {
        const url = `${window.location.origin}/courses/${courseId}`;
        navigator.clipboard.writeText(url);
        setCopiedId(courseId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    useEffect(() => {
        if (!currentUser) return;
        const q = query(collection(db, "courses"), where("mentorId", "==", currentUser.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const results: Course[] = snapshot.docs.map((d) => ({
                id: d.id,
                title: d.data().title,
                category: d.data().category,
                moduleCount: (d.data().modules || []).length,
                enrolledCount: d.data().enrolledCount || 0,
            }));
            setMyCourses(results);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [currentUser]);

    const addModule = () => {
        if (!newModule.trim()) return;
        setModules((prev) => [...prev, newModule.trim()]);
        setNewModule("");
    };

    const removeModule = (index: number) => {
        setModules((prev) => prev.filter((_, i) => i !== index));
    };

    const handleCreate = async () => {
        if (!currentUser) return;
        setError("");
        if (!title.trim()) return setError("Course title is required.");
        if (modules.length === 0) return setError("Add at least one module.");

        setSaving(true);
        try {
            await addDoc(collection(db, "courses"), {
                title: title.trim(),
                category,
                description,
                modules,
                mentorId: currentUser.uid,
                mentorName: currentUser.name,
                enrolledCount: 0,
                createdAt: serverTimestamp(),
            });
            setTitle("");
            setDescription("");
            setModules([]);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-slate-300 pt-24 flex">
            <MentorSidebar />

            <main className="flex-1 md:ml-64 px-6 md:px-10 py-8 relative overflow-hidden">
                <div className="absolute top-0 -z-10 left-1/3 size-96 bg-pink-600/20 blur-[150px] rounded-full" />

                <div className="max-w-2xl">
                    <h1 className="text-2xl font-semibold text-white">My courses</h1>
                    <p className="text-slate-400 mt-1 text-sm">Create a structured course with modules — students complete it and earn a certificate.</p>

                    {/* Existing courses */}
                    <div className="mt-6 space-y-2">
                        {!loading && myCourses.length > 0 && (
                            <div className="space-y-2 mb-6">
                                {myCourses.map((course) => (
                                    <div
                                        key={course.id}
                                        className="flex items-center justify-between border border-slate-800 rounded-xl p-4 bg-slate-950/60 hover:border-slate-700 transition"
                                    >
                                        <Link to={`/courses/${course.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="size-10 rounded-lg bg-pink-600/10 border border-pink-600/30 flex items-center justify-center flex-shrink-0">
                                                <BookOpenIcon className="size-4.5 text-pink-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-white font-medium text-sm truncate">{course.title}</p>
                                                <p className="text-slate-500 text-xs">{course.category} · {course.moduleCount} modules · {course.enrolledCount} enrolled</p>
                                            </div>
                                        </Link>
                                        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                                            <Link
                                                to={`/mentor-dashboard/courses/${course.id}/students`}
                                                className="text-xs px-3 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white transition"
                                            >
                                                View Students
                                            </Link>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    copyLink(course.id);
                                                }}
                                                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 transition"
                                            >
                                                <LinkIcon className="size-3.5" />
                                                {copiedId === course.id ? "Copied!" : "Copy Link"}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Create form */}
                    <div className="border border-slate-800 rounded-xl p-6 bg-slate-950/60">
                        <p className="text-white font-medium mb-4">Create a new course</p>

                        <div className="space-y-4">
                            <div>
                                <p className="mb-2 text-sm font-medium text-slate-200">Course title</p>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. React for Beginners"
                                    className="w-full p-3 rounded-lg border border-slate-700 bg-slate-900/50 text-white text-sm placeholder:text-slate-600 outline-none focus:border-pink-500 transition"
                                />
                            </div>

                            <div>
                                <p className="mb-2 text-sm font-medium text-slate-200">Category</p>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-slate-700 bg-slate-900/50 text-white text-sm outline-none focus:border-pink-500 transition"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <p className="mb-2 text-sm font-medium text-slate-200">Description</p>
                                <textarea
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="What will students learn in this course?"
                                    className="w-full p-3 rounded-lg border border-slate-700 bg-slate-900/50 text-white text-sm placeholder:text-slate-600 outline-none focus:border-pink-500 resize-none transition"
                                />
                            </div>

                            <div>
                                <p className="mb-2 text-sm font-medium text-slate-200">Modules (lessons)</p>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={newModule}
                                        onChange={(e) => setNewModule(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addModule())}
                                        placeholder="e.g. Introduction to JSX"
                                        className="flex-1 p-3 rounded-lg border border-slate-700 bg-slate-900/50 text-white text-sm placeholder:text-slate-600 outline-none focus:border-pink-500 transition"
                                    />
                                    <button
                                        onClick={addModule}
                                        className="flex items-center gap-1.5 px-4 py-3 rounded-lg bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium transition"
                                    >
                                        <PlusIcon className="size-4" />
                                        Add
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {modules.map((mod, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-slate-700 bg-slate-900/50 text-sm text-white"
                                        >
                                            <span>{index + 1}. {mod}</span>
                                            <button onClick={() => removeModule(index)} className="hover:bg-slate-800 rounded-full p-1 transition">
                                                <TrashIcon className="size-3.5 text-slate-500" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {error && <p className="text-red-400 text-sm">{error}</p>}
                            {success && <p className="text-emerald-400 text-sm">Course created!</p>}

                            <button
                                onClick={handleCreate}
                                disabled={saving}
                                className="bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white px-8 py-3 rounded-lg font-medium transition"
                            >
                                {saving ? "Creating..." : "Create course"}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}