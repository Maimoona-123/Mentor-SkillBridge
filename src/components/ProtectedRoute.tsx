'use client'
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../context/AuthContext";

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRole: UserRole;
}

export default function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <p className="text-slate-500 text-sm">Loading...</p>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (currentUser.role !== allowedRole) {
        const correctPath = currentUser.role === "mentor" ? "/mentor-dashboard" : "/dashboard";
        return <Navigate to={correctPath} replace />;
    }

    return <>{children}</>;
}