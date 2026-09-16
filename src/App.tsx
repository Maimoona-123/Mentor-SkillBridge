import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUp from "./sections/Signup";
import Login from "./sections/Login";
import BrowseMentors from "./sections/Mentor/BrowseMentors";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";
import LenisScroll from "./components/LenisScroll";
import MentorProfile from "./sections/Mentor/MentorProfile";
import StudentDashboard from "./sections/Student/StudentDashboard";
import MentorDashboard from "./sections/Mentor/MentorDashboard";
import StudentProfile from "./sections/Student/StudentProfile";
import StudentSettings from "./sections/Student/StudentSetting";
import BookingConfirmation from "./sections/Student/BookingConfirmation";
import MentorRequests from "./sections/Mentor/MentorRequests";
import MentorAvailability from "./sections/Mentor/MentorAvailability";
import MentorProfileEdit from "./sections/Mentor/MentorProfileEdit";
import MentorSettings from "./sections/Mentor/MentorSettings";
import StudentSessions from "./sections/Student/Studentsessions";
import VideoCall from "./sections/VideoCall/VideoCall";

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

                <Route path="/mentor-dashboard/requests" element={<MentorRequests />} />
                <Route path="/mentor-dashboard/availability" element={<MentorAvailability />} />
                <Route path="/mentor-dashboard/profile" element={<MentorProfileEdit />} />
                <Route path="/mentor-dashboard/settings" element={<MentorSettings />} />

                <Route path="/dashboard/sessions" element={<StudentSessions />} />

                <Route path="/call/:bookingId" element={<VideoCall />} />
            </Routes>
            <Footer />
        </>
    );
}