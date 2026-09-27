'use client'
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { PrinterIcon, ArrowLeftIcon, LinkIcon } from "lucide-react";
import { db } from "../../firebase";

export default function CourseCertificate() {
    const { id, studentId } = useParams();
    const [courseTitle, setCourseTitle] = useState("");
    const [mentorName, setMentorName] = useState("");
    const [studentName, setStudentName] = useState("");
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const load = async () => {
            if (!id || !studentId) return;
            const courseSnap = await getDoc(doc(db, "courses", id));
            if (courseSnap.exists()) {
                setCourseTitle(courseSnap.data().title);
                setMentorName(courseSnap.data().mentorName || "");
            }
            const enrollmentSnap = await getDoc(doc(db, "courses", id, "enrollments", studentId));
            if (enrollmentSnap.exists()) {
                setStudentName(enrollmentSnap.data().studentName || "Student");
            }
            setLoading(false);
        };
        load();
    }, [id, studentId]);

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return <div className="min-h-screen bg-black flex items-center justify-center"><p className="text-slate-500 text-sm">Loading certificate...</p></div>;
    }

    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    return (
        <div className="min-h-screen bg-black px-4 pt-32 pb-16 flex flex-col items-center">
            <div className="flex items-center gap-3 w-full max-w-3xl mb-6 print:hidden">
                <Link to={`/courses/${id}`} className="size-9 rounded-full border border-slate-700 hover:bg-slate-800 flex items-center justify-center transition">
                    <ArrowLeftIcon className="size-4 text-slate-300" />
                </Link>
                <div className="ml-auto flex gap-2">
                    <button
                        onClick={copyLink}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-white text-sm font-medium transition"
                    >
                        <LinkIcon className="size-4" />
                        {copied ? "Copied!" : "Copy Link"}
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium transition"
                    >
                        <PrinterIcon className="size-4" />
                        Print / Save as PDF
                    </button>
                </div>
            </div>

            <div className="w-full max-w-3xl aspect-[1.414/1] bg-[#FAF7F2] rounded-lg p-12 flex flex-col items-center justify-center text-center border-[10px] border-double border-[#0F3D3E]">
                <p className="text-xs tracking-[0.3em] text-[#0F3D3E] font-semibold">SKILLBRIDGE</p>
                <h1 className="text-3xl font-serif text-[#0F3D3E] mt-6">Certificate of Completion</h1>
                <p className="text-sm text-[#4A4642] mt-6">This certifies that</p>
                <p className="text-2xl font-serif text-[#0F3D3E] mt-2 border-b border-[#0F3D3E]/30 pb-2 px-8">
                    {studentName}
                </p>
                <p className="text-sm text-[#4A4642] mt-6 max-w-md">
                    has successfully completed the course
                </p>
                <p className="text-xl font-serif text-[#0F3D3E] mt-2">{courseTitle}</p>
                <p className="text-sm text-[#4A4642] mt-6">mentored by {mentorName}</p>
                <p className="text-xs text-[#8A8580] mt-8">{today}</p>
            </div>
        </div>
    );
}