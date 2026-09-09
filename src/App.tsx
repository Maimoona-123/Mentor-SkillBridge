import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUp from "./sections/Signup";
import Login from "./sections/Login";
import BrowseMentors from "./sections/BrowseMentors";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";
import LenisScroll from "./components/LenisScroll";
import MentorProfile from "./sections/MentorProfile";
import StudentDashboard from "./sections/StudentDashboard";
import MentorDashboard from "./sections/MentorDashboard";
import StudentProfile from "./sections/StudentProfile";
import StudentSettings from "./sections/StudentSetting";
import BookingConfirmation from "./sections/BookingConfirmation";

export default function App() {
    return (
        <>
            <LenisScroll />
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/mentors" element={<BrowseMentors />} />
                <Route path="/mentor/:id" element={<MentorProfile />} />
                <Route path="/dashboard" element={<StudentDashboard />} />
                <Route path="/dashboard/profile" element={<StudentProfile />} />
                <Route path="/dashboard/settings" element={<StudentSettings />} />
                <Route path="/mentor-dashboard" element={<MentorDashboard />} />
                <Route path="/booking" element={<BookingConfirmation />} />
            </Routes>
            <Footer />
        </>
    );
}