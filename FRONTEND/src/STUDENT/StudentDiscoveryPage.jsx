import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Discovery from "../components/discovery and achievement/DiscoveryTable";
import Achievements from "../components/discovery and achievement/AchievementTable";

const StudentDiscoveryPage = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("achievements");

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
        marginTop: "55px",
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
          transition: "margin 0.3s ease",
          marginLeft: open ? "180px" : "60px",
          maxWidth: "100%",
        }}
      >
        <Box sx={{ display: "flex", gap: 2, mb: 2, justifyContent: "center" }}>
          <Button
            variant={activeTab === "achievements" ? "contained" : "outlined"}
            onClick={() => setActiveTab("achievements")}
            sx={{
              fontSize: "1rem",
              fontWeight: "bold",
              bgcolor: activeTab === "achievements" ? "#00bcd4" : "#333",
              color: "white",
              borderRadius: "8px",
              boxShadow: "0px 0px 10px rgba(0, 188, 212, 0.7)",
              "&:hover": {
                bgcolor: "#008ba3",
                boxShadow: "0px 0px 20px rgba(0, 188, 212, 1)",
              },
            }}
          >
            Achievements
          </Button>
          <Button
            variant={activeTab === "discovery" ? "contained" : "outlined"}
            onClick={() => setActiveTab("discovery")}
            sx={{
              fontSize: "1rem",
              fontWeight: "bold",
              bgcolor: activeTab === "discovery" ? "#00bcd4" : "#333",
              color: "white",
              borderRadius: "8px",
              boxShadow: "0px 0px 10px rgba(0, 188, 212, 0.7)",
              "&:hover": {
                bgcolor: "#008ba3",
                boxShadow: "0px 0px 20px rgba(0, 188, 212, 1)",
              },
            }}
          >
            Discovery
          </Button>
        </Box>

        {activeTab === "achievements" ? <Achievements /> : <Discovery />}
      </Box>
    </Box>
  );
};

export default StudentDiscoveryPage;
