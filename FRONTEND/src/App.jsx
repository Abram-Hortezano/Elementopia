import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Student Pages
import LandingPage from "./STUDENT/LandingPage";
import LoginCard from "./STUDENT/login-card";
import RegisterCard from "./STUDENT/register-card";
import AboutUs from "./STUDENT/about-us";
import StudentHomePage from "./STUDENT/StudentHomePage";
import StudentCareerPage from "./STUDENT/StudentCareerPage";
import StudentDiscoveryPage from "./STUDENT/StudentDiscoveryPage";
import StudentSandboxPage from "./STUDENT/StudentSandboxPage";
import ChallengePage from "./components/Student Components/ChallengePage";

// Teacher Pages
import TeacherCareerPage from "./TEACHER/TeacherCareerPage";
import TeacherGameRoomPage from "./TEACHER/TeacherGameRoomPage";
import TeacherRoomPage from "./TEACHER/TeacherRoomPage";
import TeacherDiscoveryPage from "./TEACHER/TeacherDiscoveryPage";

// Utils
import PrivateRoute from "./components/utils/PrivateRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/career" element={<div>Career Page (Coming Soon)</div>} />
        <Route
          path="/contact-us"
          element={<div>Contact Us Page (Coming Soon)</div>}
        />
        <Route path="/login" element={<LoginCard />} />
        <Route path="/sign-up" element={<RegisterCard />} />

        {/* Student Routes - Protected */}
        <Route
          path="/student-home-page"
          element={
            <PrivateRoute allowedRoles={["STUDENT"]}>
              <StudentHomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/student-career-page"
          element={
            <PrivateRoute allowedRoles={["STUDENT"]}>
              <StudentCareerPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/discovery"
          element={
            <PrivateRoute allowedRoles={["STUDENT"]}>
              <StudentDiscoveryPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/student/Chem-Simulation"
          element={
            <PrivateRoute allowedRoles={["STUDENT"]}>
              <StudentSandboxPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/daily-challenge"
          element={
            <PrivateRoute allowedRoles={["STUDENT"]}>
              <ChallengePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/teacher/career-page"
          element={
            <PrivateRoute allowedRoles={["TEACHER"]}>
              <TeacherCareerPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/room"
          element={
            <PrivateRoute allowedRoles={["TEACHER"]}>
              <TeacherRoomPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/Chem-Simulation"
          element={
            <PrivateRoute allowedRoles={["TEACHER"]}>
              <TeacherGameRoomPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/teacher/discovery"
          element={
            <PrivateRoute allowedRoles={["TEACHER"]}>
              <TeacherDiscoveryPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
