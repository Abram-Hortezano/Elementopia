import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./STUDENT/LandingPage";
import LoginCard from "./STUDENT/login-card";
import RegisterCard from "./STUDENT/register-card";
import AboutUs from "./STUDENT/about-us";
import StudentHomePage from "./STUDENT/StudentHomePage";
import StudentRoomPage from "./STUDENT/StudentRoomPage";
import StudentCareerPage from "./STUDENT/StudentCareerPage";
import StudentDiscoveryPage from "./STUDENT/StudentDiscoveryPage";
import StudentGameRoomPage from "./STUDENT/StudentGameRoomPage";
import StudentSandboxPage from "./STUDENT/StudentSandboxPage";
import PageLayout from "./TEACHER/PageLayout";
import TeacherAnalyticsPage from "./TEACHER/TeacherAnalyticsPage";
import ProtectedRoute from "./components/ProtectedRoute"; 

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/career" element={<div>Career Page (Coming Soon)</div>} />
        <Route path="/contact-us" element={<div>Contact Us Page (Coming Soon)</div>} />
        <Route path="/login" element={<LoginCard />} />
        <Route path="/sign-up" element={<RegisterCard />} />

        {/* Student Route */}
        <Route
          path="/student-home-page"
          element={
            <ProtectedRoute>
              <StudentHomePage />
            </ProtectedRoute>
          }
        />
        <Route path="/student-home-page/room" element={<StudentRoomPage />} />
        <Route path="/student-home-page/student-career-page" element={<StudentCareerPage />} />
        <Route path="/student-home-page/discovery" element={<StudentDiscoveryPage />} />
        <Route path="/student-home-page/game-room" element={<StudentGameRoomPage />} />
        <Route path="/student-home-page/sandbox" element={<StudentSandboxPage />} />

        {/* Teacher Route */}
        <Route path="/teacher-home-page" element={<PageLayout />} />
        <Route path="/teacher-home-page/analytics" element={<TeacherAnalyticsPage />} />
      </Routes>
    </Router>
  );
}
