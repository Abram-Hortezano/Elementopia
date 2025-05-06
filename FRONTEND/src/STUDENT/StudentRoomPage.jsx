import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CustomRoom from "./custom-room"

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const StudentRoomPage = () => {
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
<<<<<<< HEAD
      <Sidebar
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        handleDrawerClose={handleDrawerClose}
      />
=======
      <Sidebar open={open} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} />
>>>>>>> e0b83494df3a2e0d8f8d69de11ee92b32337ad28
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
<<<<<<< HEAD
          transition: "margin 0.3s ease",
          marginLeft: open ? "180px" : "60px",
          maxWidth: "100%;",
        }}
      >
        <DrawerHeader />
        <Typography sx={{ marginBottom: 2 }}>This is the Room Page</Typography>
=======
          marginLeft: open ? "20px" : "10px",
          width: "100%",
          marginTop: "50px",
        }}
      >
        <CustomRoom/>
>>>>>>> e0b83494df3a2e0d8f8d69de11ee92b32337ad28
      </Box>
    </Box>
  );
};

export default StudentRoomPage;
