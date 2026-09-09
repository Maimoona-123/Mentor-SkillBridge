'use client'
import {
    LayoutDashboardIcon,
    InboxIcon,
    CalendarClockIcon,
    UserIcon,
    SettingsIcon,
    LogOutIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const sidebarLinks = [
    { name: "Overview", path: "/mentor-dashboard", icon: LayoutDashboardIcon },
    { name: "Requests", path: "/mentor-dashboard/requests", icon: InboxIcon },
    { name: "My Availability", path: "/mentor-dashboard/availability", icon: CalendarClockIcon },
    { name: "Profile", path: "/mentor-dashboard/profile", icon: UserIcon },
    { name: "Settings", path: "/mentor-dashboard/settings", icon: SettingsIcon },
];

export default function MentorSidebar() {
    const location = useLocation();

    return (
        <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 fixed top-24 bottom-0 left-0 px-4 py-6">
            <div className="flex items-center gap-3 px-3 pb-6 border-b border-slate-800">
                <div className="size-10 rounded-full bg-pink-600 flex items-center justify-center text-white font-semibold text-sm">
                    AZ
                </div>
                <div>
                    <p className="text-white text-sm font-medium">Ayesha Zafar</p>
                    <p className="text-slate-500 text-xs">Mentor</p>
                </div>
            </div>

            <nav className="flex flex-col gap-1 mt-6">
                {sidebarLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition text-left ${
                                isActive
                                    ? "bg-pink-600/10 text-pink-500 border border-pink-600/30"
                                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                            }`}
                        >
                            <Icon className="size-4.5" />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            <Link
                to="/"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-900 hover:text-white transition mt-auto"
            >
                <LogOutIcon className="size-4.5" />
                Log out
            </Link>
        </aside>
    );
}