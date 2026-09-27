'use client'
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { BookOpenIcon, LayersIcon } from "lucide-react";
import { db } from "../../firebase";

const categories = ["All", "Web Development", "Graphic Design", "Digital Marketing", "Shopify", "AI"];

interface Course {
    id: string;
    title: string;
    category: string;
    description: string;
    mentorName: string;
    moduleCount: number;
}

export default function Courses() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            const snapshot = await getDocs(collection(db, "courses"));
            const results: Course[] = snapshot.docs.map((d) => ({
                id: d.id,
                title: d.data().title,
                category: d.data().category,
                description: d.data().description || "",
                mentorName: d.data().mentorName || "Unknown mentor",
                moduleCount: (d.data().modules || []).length,
            }));
            setCourses(results);
            setLoading(false);
        };
        fetchCourses();
    }, []);

    const filtered = activeCategory === "All" ? courses : courses.filter((c) => c.category === activeCategory);

    return (
        <div className="relative min-h-screen bg-black text-slate-300 px-4 md:px-16 lg:px-24 xl:px-32 pt-40 pb-24 overflow-hidden">
            <div className="absolute top-10 -z-10 left-1/4 size-96 bg-pink-600/40 blur-[150px] rounded-full" />

            <div className="max-w-2xl">
                <h1 className="text-4xl font-semibold text-white">Free courses</h1>
                <p className="text-slate-400 mt-3">
                    Structured, self-paced courses built by mentors. Finish all the modules and earn a certificate.
                </p>
            </div>

            <div className="flex flex-wrap gap-2.5 mt-8">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                            activeCategory === cat
                                ? "bg-pink-600 text-white"
                                : "border border-slate-700 text-slate-400 hover:border-slate-500"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {loading && <p className="text-slate-500 text-sm mt-10">Loading courses...</p>}

            {!loading && filtered.length === 0 && (
                <p className="text-slate-500 text-sm mt-10 border border-slate-800 rounded-xl p-8 text-center bg-slate-950/40">
                    No courses in this category yet.
                </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
                {filtered.map((course) => (
                    <Link
                        key={course.id}
                        to={`/courses/${course.id}`}
                        className="border border-slate-800 rounded-xl p-5 bg-slate-950/70 hover:border-slate-700 transition block"
                    >
                        <div className="size-10 rounded-lg bg-pink-600/10 border border-pink-600/30 flex items-center justify-center mb-4">
                            <BookOpenIcon className="size-4.5 text-pink-500" />
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-full border border-slate-700 text-slate-400">
                            {course.category}
                        </span>
                        <p className="text-white font-medium mt-3">{course.title}</p>
                        <p className="text-slate-500 text-sm mt-1 line-clamp-2">{course.description}</p>
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-4">
                            <LayersIcon className="size-3.5" />
                            {course.moduleCount} modules · by {course.mentorName}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}