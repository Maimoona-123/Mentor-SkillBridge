'use client'
import { useState, useEffect, useRef } from "react";
import { MessageCircleIcon, XIcon, SendIcon } from "lucide-react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";

// Key is read from .env (VITE_GROQ_API_KEY) — never hardcode it here
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

interface ChatMessage {
    role: "user" | "assistant";
    text: string;
}

const suggestedQuestions = [
    "How do I book a session with a mentor?",
    "Is SkillBridge really free?",
    "How do course certificates work?",
    "How do I become a mentor?",
    "What if I miss my session?",
];

export default function ChatbotWidget() {
    const { currentUser } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [greeted, setGreeted] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    useEffect(() => {
        const greet = async () => {
            if (!isOpen || greeted || !currentUser) return;
            setGreeted(true);

            const field = currentUser.role === "mentor" ? "mentorId" : "studentId";
            const q = query(
                collection(db, "bookings"),
                where(field, "==", currentUser.uid),
                where("status", "==", "confirmed")
            );
            const snapshot = await getDocs(q);

            const firstName = currentUser.name.split(" ")[0];

            if (!snapshot.empty) {
                const session = snapshot.docs[0].data();
                const withWhom = currentUser.role === "mentor" ? session.studentName : session.mentorName;
                setMessages([
                    {
                        role: "assistant",
                        text: `Hi ${firstName}! Just a heads up — you have a session with ${withWhom} on ${session.day} at ${session.time}. Ask me anything about your studies while you wait!`,
                    },
                ]);
            } else {
                setMessages([
                    {
                        role: "assistant",
                        text: `Hi ${firstName}! I'm your SkillBridge assistant. Ask me anything about coding, your studies, or how to use the platform.`,
                    },
                ]);
            }
        };
        greet();
    }, [isOpen, greeted, currentUser]);

    const handleSend = async (overrideText?: string) => {
        const userMessage = (overrideText ?? input).trim();
        if (!userMessage || sending) return;
        setInput("");
        setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
        setSending(true);

        try {
            const res = await fetch(GROQ_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "system",
                            content:
                                "You are a friendly, encouraging study assistant for SkillBridge, a free student-mentor platform. Help students with study questions, coding concepts, and general learning advice. Keep answers concise and clear.",
                        },
                        ...messages.map((m) => ({
                            role: m.role === "user" ? "user" : "assistant",
                            content: m.text,
                        })),
                        { role: "user", content: userMessage },
                    ],
                }),
            });

            const data = await res.json();
            const reply = data?.choices?.[0]?.message?.content || "Sorry, I couldn't process that. Try again?";
            setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
        } catch (err) {
            setMessages((prev) => [...prev, { role: "assistant", text: "Something went wrong. Please try again." }]);
        } finally {
            setSending(false);
        }
    };

    if (!currentUser) return null;

    return (
        <>
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[480px] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-800 bg-slate-900/50">
                        <div>
                            <p className="text-white text-sm font-medium">SkillBridge Assistant</p>
                            <p className="text-slate-500 text-xs">Always here to help</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="size-7 rounded-full hover:bg-slate-800 flex items-center justify-center transition"
                        >
                            <XIcon className="size-4 text-slate-400" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-[80%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed ${
                                        msg.role === "user"
                                            ? "bg-pink-600 text-white"
                                            : "bg-slate-800 text-slate-200"
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {sending && (
                            <div className="flex justify-start">
                                <div className="bg-slate-800 text-slate-400 px-3.5 py-2.5 rounded-xl text-sm">
                                    Typing...
                                </div>
                            </div>
                        )}
                        {messages.length === 1 && !sending && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {suggestedQuestions.map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => handleSend(q)}
                                        className="text-xs px-3 py-2 rounded-full border border-slate-700 text-slate-300 hover:border-pink-500 hover:text-white transition text-left"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-3 border-t border-slate-800 flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Ask a study question..."
                            className="flex-1 px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm placeholder:text-slate-600 outline-none focus:border-pink-500 transition"
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={sending || !input.trim()}
                            className="size-10 rounded-lg bg-pink-600 hover:bg-pink-700 disabled:opacity-40 flex items-center justify-center transition flex-shrink-0"
                        >
                            <SendIcon className="size-4 text-white" />
                        </button>
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 size-14 rounded-full bg-pink-600 hover:bg-pink-700 shadow-lg flex items-center justify-center transition active:scale-95"
            >
                {isOpen ? <XIcon className="size-6 text-white" /> : <MessageCircleIcon className="size-6 text-white" />}
            </button>
        </>
    );
}