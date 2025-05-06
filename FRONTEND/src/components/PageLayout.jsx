import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Navbar from "../NavBar";
import Sidebar from "../Sidebar";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const PageLayout = () => {
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
      <Box component="main" sx={{ flexGrow: 1, p: 3, transition: "margin 0.3s ease", marginLeft: open ? "180px" : "60px" }}>
        <DrawerHeader />
        <Typography sx={{ marginBottom: 2 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Typography>
        <Typography sx={{ marginBottom: 2 }}>
          Consequat mauris nunc congue nisi vitae suscipit. Pulvinar elementum integer enim neque volutpat ac tincidunt.
        </Typography>
      </Box>
    </Box>
  );
};

export default PageLayout;
