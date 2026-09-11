'use client'
import { useState } from "react";
import { PlusIcon, TrashIcon } from "lucide-react";
import MentorSidebar from "../../components/MentorSidebar";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface Slot {
    id: string;
    day: string;
    time: string;
}

export default function MentorAvailability() {
    const [slots, setSlots] = useState<Slot[]>([
        { id: "1", day: "Monday", time: "4:00 PM" },
        { id: "2", day: "Monday", time: "6:30 PM" },
        { id: "3", day: "Wednesday", time: "5:00 PM" },
        { id: "4", day: "Friday", time: "3:00 PM" },
    ]);

    const [newDay, setNewDay] = useState("Monday");
    const [newTime, setNewTime] = useState("");

    const addSlot = () => {
        if (!newTime.trim()) return;
        setSlots((prev) => [...prev, { id: Date.now().toString(), day: newDay, time: newTime }]);
        setNewTime("");
    };

    const removeSlot = (id: string) => {
        setSlots((prev) => prev.filter((s) => s.id !== id));
    };

    return (
        <div className="min-h-screen bg-black text-slate-300 pt-24 flex">
            <MentorSidebar />

            <main className="flex-1 md:ml-64 px-6 md:px-10 py-8 relative overflow-hidden">
                <div className="absolute top-0 -z-10 left-1/3 size-96 bg-pink-600/20 blur-[150px] rounded-full" />

                <div className="max-w-2xl">
                    <h1 className="text-2xl font-semibold text-white">My availability</h1>
                    <p className="text-slate-400 mt-1 text-sm">Add the times you're free to take a session. Students book from these slots.</p>

                    {/* Add new slot */}
                    <div className="mt-8 border border-slate-800 rounded-xl p-5 bg-slate-950/60">
                        <p className="text-sm font-medium text-white mb-3">Add a time slot</p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <select
                                value={newDay}
                                onChange={(e) => setNewDay(e.target.value)}
                                className="p-3 rounded-lg border border-slate-700 bg-slate-900/50 text-white text-sm outline-none focus:border-pink-500 transition"
                            >
                                {days.map((day) => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                value={newTime}
                                onChange={(e) => setNewTime(e.target.value)}
                                placeholder="e.g. 5:00 PM"
                                className="flex-1 p-3 rounded-lg border border-slate-700 bg-slate-900/50 text-white text-sm placeholder:text-slate-600 outline-none focus:border-pink-500 transition"
                            />
                            <button
                                onClick={addSlot}
                                className="flex items-center justify-center gap-1.5 px-5 py-3 rounded-lg bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium transition"
                            >
                                <PlusIcon className="size-4" />
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Grouped slots by day */}
                    <div className="mt-8 space-y-5">
                        {days.map((day) => {
                            const daySlots = slots.filter((s) => s.day === day);
                            if (daySlots.length === 0) return null;
                            return (
                                <div key={day}>
                                    <p className="text-sm font-medium text-slate-300 mb-2.5">{day}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {daySlots.map((slot) => (
                                            <div
                                                key={slot.id}
                                                className="flex items-center gap-2 pl-3.5 pr-2.5 py-2 rounded-lg border border-slate-700 bg-slate-900/50 text-sm text-white"
                                            >
                                                {slot.time}
                                                <button
                                                    onClick={() => removeSlot(slot.id)}
                                                    className="size-5 rounded-full hover:bg-slate-800 flex items-center justify-center transition"
                                                >
                                                    <TrashIcon className="size-3.5 text-slate-500" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                        {slots.length === 0 && (
                            <p className="text-slate-500 text-sm py-10 text-center border border-slate-800 rounded-xl bg-slate-950/40">
                                No availability set yet. Add a slot above.
                            </p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}