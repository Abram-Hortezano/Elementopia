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
import Laboratory from "./STUDENT/laboratory";
import CreateExperimentModal from "./STUDENT/create-experiment";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <App /> */}
    <BrowserRouter>
    {/* <StudentRoomPage /> */}
    {/* <TeacherRoomPage /> */}
    {/* <Laboratory /> */}
     {/* <StudentHomePage /> */}
     <CreateExperimentModal />
    </BrowserRouter>
    {/* <Buttons /> */}
    {/* <FeatureCard /> */}
  </StrictMode>
);
