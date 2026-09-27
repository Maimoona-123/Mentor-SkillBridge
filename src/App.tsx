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
import ChatbotWidget from "./sections/ChatbotWidget/Chatbot";
import ProtectedRoute from "./components/ProtectedRoute";
import Courses from "./sections/Mentor/Courses";
import CourseDetail from "./sections/Mentor/Coursedetail";
import CourseCertificate from "./sections/Mentor/Coursecertificate";
import CreateCourse from "./sections/Mentor/Createcourse";
import CourseStudents from "./sections/Mentor/CoursesStuents";
import HowItWorks from "./sections/Howitworks";
import BecomeMentor from "./sections/Becomementor";

export default function App() {
    return (
        <>
            <LenisScroll />

            <Navbar />

            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/mentors" element={<BrowseMentors />} />
                <Route path="/mentor/:id" element={<MentorProfile />} />
                <Route path="/booking" element={<BookingConfirmation />} />
                <Route path="/call/:bookingId" element={<VideoCall />} />

                {/* Courses */}
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route
                    path="/courses/:id/certificate/:studentId"
                    element={<CourseCertificate />}
                />

                {/* Other Public Pages */}
                <Route
                    path="/become-a-mentor"
                    element={<BecomeMentor />}
                />
                <Route
                    path="/how-it-works"
                    element={<HowItWorks />}
                />

                {/* Student Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRole="student">
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard/profile"
                    element={
                        <ProtectedRoute allowedRole="student">
                            <StudentProfile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard/settings"
                    element={
                        <ProtectedRoute allowedRole="student">
                            <StudentSettings />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard/sessions"
                    element={
                        <ProtectedRoute allowedRole="student">
                            <StudentSessions />
                        </ProtectedRoute>
                    }
                />

                {/* Mentor Routes */}
                <Route
                    path="/mentor-dashboard"
                    element={
                        <ProtectedRoute allowedRole="mentor">
                            <MentorDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/mentor-dashboard/requests"
                    element={
                        <ProtectedRoute allowedRole="mentor">
                            <MentorRequests />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/mentor-dashboard/availability"
                    element={
                        <ProtectedRoute allowedRole="mentor">
                            <MentorAvailability />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/mentor-dashboard/profile"
                    element={
                        <ProtectedRoute allowedRole="mentor">
                            <MentorProfileEdit />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/mentor-dashboard/settings"
                    element={
                        <ProtectedRoute allowedRole="mentor">
                            <MentorSettings />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/mentor-dashboard/courses"
                    element={
                        <ProtectedRoute allowedRole="mentor">
                            <CreateCourse />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/mentor-dashboard/courses/:id/students"
                    element={
                        <ProtectedRoute allowedRole="mentor">
                            <CourseStudents />
                        </ProtectedRoute>
                    }
                />
            </Routes>

            <Footer />
            <ChatbotWidget />
        </>
    );
}