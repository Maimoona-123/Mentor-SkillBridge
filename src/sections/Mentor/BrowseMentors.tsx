"use client";

import { useState } from "react";
import { SearchIcon, StarIcon } from "lucide-react";
import { Link } from "react-router-dom";

const skillFilters = [
  "All",
  "React",
  "Node.js",
  "Firebase",
  "UI/UX",
  "Python",
  "MongoDB",
];

const mentors = [
  {
    name: "Ayesha Zafar",
    role: "Frontend Developer",
    skills: ["React", "Redux", "Firebase"],
    rating: 4.9,
    sessions: 32,
    avatarColor: "bg-pink-600",
    initials: "AZ",
  },
  {
    name: "Hamza Malik",
    role: "Backend Engineer",
    skills: ["Node.js", "MongoDB"],
    rating: 4.8,
    sessions: 21,
    avatarColor: "bg-violet-600",
    initials: "HM",
  },
  {
    name: "Sara Khan",
    role: "Product Designer",
    skills: ["Figma", "UI/UX"],
    rating: 5.0,
    sessions: 40,
    avatarColor: "bg-emerald-600",
    initials: "SK",
  },
  {
    name: "Bilal Ahmed",
    role: "ML Engineer",
    skills: ["Python", "TensorFlow"],
    rating: 4.7,
    sessions: 18,
    avatarColor: "bg-amber-600",
    initials: "BA",
  },
  {
    name: "Maria Usman",
    role: "Full Stack Developer",
    skills: ["React", "Node.js", "MongoDB"],
    rating: 4.9,
    sessions: 27,
    avatarColor: "bg-sky-600",
    initials: "MU",
  },
  {
    name: "Danish Raza",
    role: "UI/UX Designer",
    skills: ["Figma", "UI/UX"],
    rating: 4.6,
    sessions: 15,
    avatarColor: "bg-rose-600",
    initials: "DR",
  },
];

export default function BrowseMentors() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="relative min-h-screen bg-black text-slate-300 px-4 md:px-16 lg:px-24 xl:px-32 pt-40 pb-24 overflow-hidden">

      {/* Pink Glow Backdrop */}
      <div className="absolute top-10 left-1/4 size-96 bg-pink-600/50 blur-[180px] rounded-full -z-0" />

      {/* Second Pink Glow */}
      <div className="absolute top-[500px] -right-40 size-80 bg-pink-600/30 blur-[160px] rounded-full -z-0" />

      {/* Main Content */}
      <div className="relative z-10">

        {/* Header */}
        <div className="max-w-2xl">
          <h1 className="text-4xl font-semibold text-white">
            Browse mentors
          </h1>

          <p className="text-slate-400 mt-3">
            240+ developers and designers volunteering their time. Find
            someone who's already solved what you're stuck on.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 mt-8 max-w-md pl-4 rounded-full border border-slate-700 bg-slate-900/50">
          <SearchIcon className="size-4.5 text-slate-500" />

          <input
            type="text"
            placeholder="Search by name or skill"
            className="w-full py-3 outline-none bg-transparent text-white placeholder:text-slate-600 text-sm"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2.5 mt-6">
          {skillFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                activeFilter === filter
                  ? "bg-pink-600 text-white"
                  : "border border-slate-700 text-slate-400 hover:border-slate-500"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Mentor Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {mentors.map((mentor, index) => (
            <div
              key={index}
              className="border border-slate-800 rounded-xl p-5 bg-slate-950/70 hover:border-slate-700 transition"
            >
              {/* Mentor Info */}
              <div className="flex items-center gap-3">
                <div
                  className={`size-12 rounded-full ${mentor.avatarColor} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}
                >
                  {mentor.initials}
                </div>

                <div>
                  <p className="text-white font-medium">
                    {mentor.name}
                  </p>

                  <p className="text-slate-500 text-sm">
                    {mentor.role}
                  </p>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {mentor.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2.5 py-1 rounded-full border border-slate-700 text-slate-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Rating */}
              <div className="flex items-center justify-between mt-5">
                <div className="flex items-center gap-1 text-sm text-slate-400">
                  <StarIcon className="size-4 fill-amber-400 text-amber-400" />

                  <span>{mentor.rating}</span>

                  <span className="text-slate-600">
                    · {mentor.sessions} sessions
                  </span>
                </div>
              </div>

              {/* View Profile */}
              <Link
                to={`/mentor/${index}`}
                className="block w-full mt-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-medium transition text-center"
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}