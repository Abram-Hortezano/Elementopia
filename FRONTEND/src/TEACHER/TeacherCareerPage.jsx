import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Navbar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import CurriculumBuilder from "../components/Teacher Component/CurriculumBuilder";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const TeacherCareerPage = () => {
  const [open, setOpen] = useState(false); // Sidebar state

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  return (
    <Box sx={{ display: "flex" }}>
      {/* Navbar with dynamic width */}
      <Navbar open={open} />

      {/* Sidebar with control props */}
      <Sidebar open={open} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} />

      {/* Main Content Area */}
       <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: open ? "20px" : "10px", width: "100%", marginTop: "50px" }}>
       
        <CurriculumBuilder/>
       
      </Box>
    </Box>
  );
};

export default TeacherCareerPage;