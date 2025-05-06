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
import ProfilePage from "./STUDENT/profile-page";
import ChallengePage from "./components/Student Components/ChallengePage";
import TeacherCareerPage from "./TEACHER/TeacherCareerPage";
import StudentElementMatcher from "./STUDENT/StudentElementMatcher";
import StudentStateChanges from "./STUDENT/StudentStateChanges";
import StudentCardMinigame from "./STUDENT/StudentCardMinigame";
import ProfilePage from "./pages/profile-page";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/career" element={<div>Career Page (Coming Soon)</div>} />
        <Route
          path="/contact-us"
          element={<div>Contact Us Page (Coming Soon)</div>}
        />
        <Route path="/login" element={<LoginCard />} />
        <Route path="/sign-up" element={<RegisterCard />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Student Route */}
        <Route path="/student-home-page" element={<StudentHomePage />} />
        <Route path="/student/profile" element={<ProfilePage />} />
        <Route path="/student/room" element={<StudentRoomPage />} />
        <Route
          path="/student/student-career-page"
          element={<StudentCareerPage />}
        />
        <Route path="/student/discovery" element={<StudentDiscoveryPage />} />
        <Route path="/student/game-room" element={<StudentGameRoomPage />} />
        <Route path="/student/sandbox" element={<StudentSandboxPage />} />
        <Route path="/student/daily-challenge" element={<ChallengePage />} />
        <Route path="/student/game1" element={<StudentElementMatcher/>} />
        <Route path="/student/game2" element={<StudentStateChanges/>} />
        <Route path="/student/game3" element={<StudentCardMinigame/>} />

        {/* Teacher Route */}
        <Route path="/teacher-home-page" element={<PageLayout />} />
        <Route path="/teacher/analytics" element={<TeacherAnalyticsPage />} />
        <Route path="/teacher/career-page" element={<TeacherCareerPage />} />
      </Routes>
    </Router>
  );
}
