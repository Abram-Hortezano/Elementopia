import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Navbar from "../components/NavBar.jsx";
import TeacherSidebar from "../components/Teacher Component/TeacherSidebar.jsx";
import CurriculumBuilder from "../components/Teacher Component/CurriculumBuilder";
import LessonBuilder from "../components/Teacher Component/LessonBuilder.jsx";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const TeacherCareerPage = () => {
  const [open, setOpen] = useState(false); // Sidebar state

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "#121212",
        color: "white",
        minHeight: "100vh",
        width: "100vw",
      }}
    >
      <Navbar open={open} />
      <TeacherSidebar
        open={open}
        handleDrawerOpen={() => setOpen(true)}
        handleDrawerClose={() => setOpen(false)}
      />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: open ? "10px" : "5px",
          width: "100%",
          marginTop: "50px",
        }}
      >
        {/* <CurriculumBuilder /> */}
        <LessonBuilder />
      </Box>
    </Box>
  );
};

export default TeacherCareerPage;
