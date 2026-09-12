'use client'
import { useState, useEffect, useRef } from "react";
import { UserIcon, MailIcon, CameraIcon, BriefcaseIcon } from "lucide-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import MentorSidebar from "../../components/MentorSidebar";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";

// Replace these with your own Cloudinary values (Dashboard > Cloud name, Settings > Upload > presets)
const CLOUDINARY_CLOUD_NAME = "YOUR_CLOUD_NAME";
const CLOUDINARY_UPLOAD_PRESET = "YOUR_UPLOAD_PRESET";

const allSkills = ["React", "Node.js", "Python", "UI/UX", "Firebase", "Machine Learning", "MongoDB", "DevOps", "Redux", "TypeScript"];

const getInitials = (name: string) =>
    name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

async function uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
    );

    if (!res.ok) throw new Error("Image upload failed");

    const data = await res.json();
    return data.secure_url;
}

export default function MentorProfileEdit() {
    const { currentUser } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [bio, setBio] = useState("");
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [existingPhotoURL, setExistingPhotoURL] = useState<string | null>(null);

    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            if (!currentUser) return;
            const snap = await getDoc(doc(db, "users", currentUser.uid));
            if (snap.exists()) {
                const data = snap.data();
                setExistingPhotoURL(data.photoURL || null);
            }
            setLoading(false);
        };
        loadProfile();
    }, [currentUser]);

    const toggleSkill = (skill: string) => {
        setSelectedSkills((prev) =>
            prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
        );
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    const resetForm = () => {
        setName("");
        setRole("");
        setBio("");
        setSelectedSkills([]);
        setPhotoFile(null);
        setPhotoPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSave = async () => {
        if (!currentUser) return;
        setSaving(true);
        setSaved(false);
        setError("");
        try {
            let photoURL = existingPhotoURL;

            if (photoFile) {
                photoURL = await uploadToCloudinary(photoFile);
                setExistingPhotoURL(photoURL);
            }

            await updateDoc(doc(db, "users", currentUser.uid), {
                ...(name && { name }),
                ...(role && { currentRole: role }),
                ...(bio && { bio }),
                ...(selectedSkills.length > 0 && { skills: selectedSkills }),
                ...(photoURL && { photoURL }),
            });

            setSaved(true);
            resetForm();
        } catch (err) {
            setError("Something went wrong while saving. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-slate-300 pt-24 flex">
                <MentorSidebar />
                <main className="flex-1 md:ml-64 px-6 md:px-10 py-8">
                    <p className="text-slate-500 text-sm">Loading your profile...</p>
                </main>
            </div>
        );
    }

    const displayPhoto = photoPreview || existingPhotoURL;

    return (
        <div className="min-h-screen bg-black text-slate-300 pt-24 flex">
            <MentorSidebar />

            <main className="flex-1 md:ml-64 px-6 md:px-10 py-8 relative overflow-hidden">
                <div className="absolute top-0 -z-10 left-1/3 size-96 bg-pink-600/20 blur-[150px] rounded-full" />

                <div className="max-w-2xl">
                    <h1 className="text-2xl font-semibold text-white">Mentor profile</h1>
                    <p className="text-slate-400 mt-1 text-sm">This is what students see when they view your profile.</p>

                    <div className="flex items-center gap-5 mt-8">
                        <div className="relative">
                            {displayPhoto ? (
                                <img
                                    src={displayPhoto}
                                    alt="Profile"
                                    className="size-20 rounded-full object-cover"
                                />
                            ) : (
                                <div className="size-20 rounded-full bg-pink-600 flex items-center justify-center text-white font-semibold text-2xl">
                                    {currentUser ? getInitials(currentUser.name) : "?"}
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -bottom-1 -right-1 size-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition"
                            >
                                <CameraIcon className="size-3.5 text-slate-300" />
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                            />
                        </div>
                        <div>
                            <p className="text-white font-medium">{currentUser?.name || "Your name"}</p>
                            <p className="text-slate-500 text-sm">Mentor</p>
                            {photoFile && <p className="text-pink-500 text-xs mt-1">New photo selected</p>}
                        </div>
                    </div>

                    <div className="mt-10 space-y-5">
                        <div>
                            <p className="mb-2 text-sm font-medium text-slate-200">Full name</p>
                            <div className="flex items-center gap-2 px-3.5 rounded-lg border border-slate-700 bg-slate-900/50 focus-within:border-pink-500 transition">
                                <UserIcon className="size-4.5 text-slate-500" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={currentUser?.name || "Enter your name"}
                                    className="w-full py-3 outline-none bg-transparent text-white placeholder:text-slate-600 text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <p className="mb-2 text-sm font-medium text-slate-200">Email</p>
                            <div className="flex items-center gap-2 px-3.5 rounded-lg border border-slate-700 bg-slate-900/50">
                                <MailIcon className="size-4.5 text-slate-500" />
                                <input
                                    type="email"
                                    value={currentUser?.email || ""}
                                    disabled
                                    className="w-full py-3 outline-none bg-transparent text-slate-500 text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <p className="mb-2 text-sm font-medium text-slate-200">Current role</p>
                            <div className="flex items-center gap-2 px-3.5 rounded-lg border border-slate-700 bg-slate-900/50 focus-within:border-pink-500 transition">
                                <BriefcaseIcon className="size-4.5 text-slate-500" />
                                <input
                                    type="text"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    placeholder="e.g. Frontend Developer at XYZ"
                                    className="w-full py-3 outline-none bg-transparent text-white placeholder:text-slate-600 text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <p className="mb-2 text-sm font-medium text-slate-200">About you</p>
                            <textarea
                                rows={4}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell students what you can help with"
                                className="w-full p-3.5 rounded-lg border border-slate-700 bg-slate-900/50 focus:border-pink-500 outline-none text-white text-sm resize-none transition placeholder:text-slate-600"
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

                        {error && <p className="text-red-400 text-sm">{error}</p>}

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white px-8 py-3 rounded-lg font-medium transition"
                            >
                                {saving ? "Saving..." : "Save changes"}
                            </button>
                            {saved && <p className="text-emerald-400 text-sm">Saved!</p>}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}