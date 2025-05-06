import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Navbar from "../components/NavBar";
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
      <Sidebar open={open} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} />
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
        <CustomRoom/>
      </Box>
    </Box>
  );
};

export default StudentRoomPage;
