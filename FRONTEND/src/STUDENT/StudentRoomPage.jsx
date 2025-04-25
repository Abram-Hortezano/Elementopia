import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const StudentRoomPage = () => {
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  return (
    <Box sx={{ display: "flex" }}>
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
          transition: "margin 0.3s ease",
          marginLeft: open ? "180px" : "60px",
          maxWidth: "100%;",
        }}
      >
        <DrawerHeader />
        <Typography sx={{ marginBottom: 2 }}>This is the Room Page</Typography>
      </Box>
    </Box>
  );
};

export default StudentRoomPage;
