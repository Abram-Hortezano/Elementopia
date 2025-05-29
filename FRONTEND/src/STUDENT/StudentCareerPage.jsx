import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import Navbar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import CurriculumOverview from "../components/Curriculum Components/CurriculumOverview";
import BackButton from "../components/BackButton";

const StudentCareerPage = () => {
  const [open, setOpen] = useState(false);

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
      <Sidebar
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        handleDrawerClose={handleDrawerClose}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: open ? "20px" : "10px",
          width: "100%",
          marginTop: "50px",
        }}
      >
        {/* <Box sx={{ mb: 2 }}>
          <BackButton />
        </Box> */}

        <CurriculumOverview />
      </Box>
    </Box>
  );
};

export default StudentCareerPage;
