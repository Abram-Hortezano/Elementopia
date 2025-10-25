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
import LandingPage from "./STUDENT/LandingPage";
import MapTree from "./STUDENT/Map-Tree";
import AtomBuilder from "./STUDENT/AtomBuilder";
import CovalentBonding from "./STUDENT/CovalentBonding";
import IonicBonding from "./STUDENT/IonicBonding";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
      {/*<BrowserRouter>*/}
    {/* <StudentRoomPage /> */}
    {/* <TeacherRoomPage /> */}
    {/* <Laboratory /> */}
    {/* <StudentProgressModal /> */}
    {/* <PracticeSprite /> */}
      {/*<MapTree />*/}
    {/* <IonicBonding /> */}
    {/* <CovalentBonding /> */}
    {/* <AtomBuilder /> */}
    {/* <AddStudentModal /> */}
    {/* <LandingPage /> */}
     {/* <StudentHomePage /> */}
     {/* <CreateExperimentModal /> */}
      {/*</BrowserRouter>*/}
    {/* <Buttons /> */}
    {/* <FeatureCard /> */}
  </StrictMode>
);