import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App"; // Import App with all routes
import Buttons from "./components/buttons";
import FeatureCard from "./components/featurecard";
import Login from "./STUDENT/login-card";
import StudentRoomPage from "./STUDENT/StudentRoomPage";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <App /> */}
    <BrowserRouter>
    <StudentRoomPage />
    </BrowserRouter>
    {/* <Buttons /> */}
    {/* <FeatureCard /> */}
  </StrictMode>
);
