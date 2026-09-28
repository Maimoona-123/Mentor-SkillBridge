'use client'
import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2Icon, BookOpenIcon } from "lucide-react";

const roadmaps: Record<string, { step: string; description: string }[]> = {
    "Web Development": [
        { step: "HTML, CSS & Git basics", description: "Learn to structure pages, style them, and track your code with version control." },
        { step: "JavaScript fundamentals", description: "Variables, functions, DOM manipulation, and how the browser actually works." },
        { step: "A frontend framework (React)", description: "Components, state, props — how modern websites are built." },
        { step: "Backend basics (Node.js + a database)", description: "APIs, servers, and storing data with something like MongoDB or Firebase." },
        { step: "Build & deploy real projects", description: "Ship 2-3 projects, host them, and put them in a portfolio." },
    ],
    "Graphic Design": [
        { step: "Design fundamentals", description: "Color theory, typography, layout, and visual hierarchy." },
        { step: "Learn a design tool (Figma or Canva)", description: "Get comfortable with the tools professionals actually use." },
        { step: "Branding basics", description: "Logos, color palettes, and how to build a consistent visual identity." },
        { step: "UI design for apps and websites", description: "Design real screens — buttons, forms, navigation that people can use." },
        { step: "Build a portfolio", description: "5-6 strong pieces showing range: branding, UI, social media, print." },
    ],
    "Digital Marketing": [
        { step: "Marketing fundamentals", description: "Understand audiences, funnels, and how people actually make decisions." },
        { step: "Social media marketing", description: "Content strategy, posting schedules, and platform-specific best practices." },
        { step: "SEO basics", description: "How to get a website found on Google — keywords, content, backlinks." },
        { step: "Paid ads (Meta & Google)", description: "How campaigns work, targeting, and reading basic performance data." },
        { step: "Run a real campaign", description: "Even a small one — for a friend's business or your own project." },
    ],
    "Shopify": [
        { step: "Shopify basics", description: "Setting up a store, products, collections, and the admin dashboard." },
        { step: "Theme customization", description: "Editing themes with the Shopify editor — no code required to start." },
        { step: "Liquid basics (optional, for developers)", description: "Shopify's templating language, for custom theme work." },
        { step: "Apps & integrations", description: "Payment gateways, shipping, and popular apps stores actually use." },
        { step: "Launch a store", description: "Set up a real or practice store end-to-end, from products to checkout." },
    ],
    "AI": [
        { step: "Python basics", description: "The language most AI tools and libraries are built around." },
        { step: "Math refresher", description: "Just enough linear algebra, probability, and stats to understand models." },
        { step: "Machine learning fundamentals", description: "Supervised vs unsupervised learning, using libraries like scikit-learn." },
        { step: "Working with LLMs & APIs", description: "How to use tools like OpenAI or open-source models in real projects." },
        { step: "Build an AI-powered project", description: "A chatbot, a classifier, anything that puts the concepts into practice." },
    ],
};

const categories = Object.keys(roadmaps);

export default function Roadmaps() {
    const [active, setActive] = useState(categories[0]);

    return (
        <div className="relative min-h-screen bg-black text-slate-300 px-4 md:px-16 lg:px-24 xl:px-32 pt-40 pb-24 overflow-hidden">
            <div className="absolute top-10 -z-10 left-1/4 size-96 bg-pink-600/40 blur-[150px] rounded-full" />

            <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-4xl font-semibold text-white">Not sure where to start?</h1>
                <p className="text-slate-400 mt-3">
                    Here's a simple roadmap for each track. Pick one, work through it, and book a mentor whenever you get stuck.
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2.5 mt-8">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActive(cat)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                            active === cat
                                ? "bg-pink-600 text-white"
                                : "border border-slate-700 text-slate-400 hover:border-slate-500"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="max-w-2xl mx-auto mt-14">
                <div className="space-y-4">
                    {roadmaps[active].map((item, index) => (
                        <div key={item.step} className="flex items-start gap-4 border border-slate-800 rounded-xl p-5 bg-slate-950/60">
                            <span className="size-8 rounded-full bg-pink-600/10 border border-pink-600/30 text-pink-500 text-sm font-medium flex items-center justify-center flex-shrink-0">
                                {index + 1}
                            </span>
                            <div>
                                <p className="text-white font-medium">{item.step}</p>
                                <p className="text-slate-400 text-sm mt-1 leading-relaxed">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-10 justify-center">
                    <Link
                        to="/mentors"
                        className="flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-full font-medium transition"
                    >
                        <CheckCircle2Icon className="size-4" />
                        Find a mentor for {active}
                    </Link>
                    <Link
                        to="/courses"
                        className="flex items-center justify-center gap-2 border border-slate-700 hover:bg-slate-900 text-white px-6 py-3 rounded-full font-medium transition"
                    >
                        <BookOpenIcon className="size-4" />
                        Browse {active} courses
                    </Link>
                </div>
            </div>
        </div>
    );
}