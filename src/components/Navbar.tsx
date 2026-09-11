import { MenuIcon, XIcon, LogOutIcon } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { navlinks } from "../data/navlinks";
import type { INavLink } from "../types";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const getInitials = (name: string) =>
    name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        setIsOpen(false);
        navigate("/");
    };

    const dashboardPath = currentUser?.role === "mentor" ? "/mentor-dashboard" : "/dashboard";

    return (
        <>
            <motion.nav className="fixed top-0 z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
            >
                <Link to="/">
                    <img className="h-8.5 w-auto" src="/assets/logo.svg" alt="SkillBridge logo" width={130} height={34} />
                </Link>

                <div className="hidden md:flex items-center gap-8 transition duration-500">
                    {navlinks.map((link: INavLink) => (
                        <NavLink key={link.name} to={link.href} className="hover:text-pink-500 transition">
                            {link.name}
                        </NavLink>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-4">
                    {currentUser ? (
                        <>
                            <Link
                                to={dashboardPath}
                                className="flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full border border-slate-700 hover:border-pink-600 transition"
                            >
                                <span className="size-7 rounded-full bg-pink-600 flex items-center justify-center text-white text-xs font-semibold">
                                    {getInitials(currentUser.name)}
                                </span>
                                <span className="text-sm font-medium">{currentUser.name}</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="size-9 rounded-full border border-slate-700 hover:bg-slate-800 flex items-center justify-center transition"
                                title="Log out"
                            >
                                <LogOutIcon className="size-4" />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all rounded-full"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/signup"
                                className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all rounded-full"
                            >
                                Find a Mentor
                            </Link>
                        </>
                    )}
                </div>

                <button onClick={() => setIsOpen(true)} className="md:hidden">
                    <MenuIcon size={26} className="active:scale-90 transition" />
                </button>
            </motion.nav>

            <div className={`fixed inset-0 z-100 bg-black/40 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-400 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                {navlinks.map((link: INavLink) => (
                    <NavLink key={link.name} to={link.href} onClick={() => setIsOpen(false)}>
                        {link.name}
                    </NavLink>
                ))}

                {currentUser ? (
                    <>
                        <Link
                            to={dashboardPath}
                            onClick={() => setIsOpen(false)}
                            className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all rounded-full text-white text-base"
                        >
                            {currentUser.name}
                        </Link>
                        <button onClick={handleLogout} className="text-slate-400 text-base">
                            Log out
                        </button>
                    </>
                ) : (
                    <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all rounded-full text-white text-base"
                    >
                        Log in
                    </Link>
                )}

                <button onClick={() => setIsOpen(false)} className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-pink-600 hover:bg-pink-700 transition text-white rounded-md flex">
                    <XIcon />
                </button>
            </div>
        </>
    );
}