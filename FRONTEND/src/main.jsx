import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App"; // Import App with all routes
import Buttons from "./components/buttons";
import FeatureCard from "./components/featurecard";
import Login from "./STUDENT/login-card";
import StudentRoomPage from "./STUDENT/StudentRoomPage";
import { BrowserRouter } from "react-router-dom";
import StudentHomePage from "./STUDENT/StudentHomePage";
import TeacherRoomPage from "./TEACHER/TeacherRoomPage";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <App /> */}
    <BrowserRouter>
    {/* <StudentRoomPage /> */}
    <TeacherRoomPage />
     {/* <StudentHomePage /> */}
    </BrowserRouter>
    {/* <Buttons /> */}
    {/* <FeatureCard /> */}
  </StrictMode>
);
