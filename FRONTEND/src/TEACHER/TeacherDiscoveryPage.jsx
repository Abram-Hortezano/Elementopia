import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert,
  Paper,
} from "@mui/material";
import Navbar from "../components/NavBar";
import TeacherSidebar from "../components/Teacher Component/TeacherSidebar";
import TeacherDiscovery from "../components/discovery and achievement/TeacherDiscoveryTable";
import TeacherAchievementTable from "../components/discovery and achievement/TeacherAchievementTable";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SchoolIcon from "@mui/icons-material/School";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ScienceIcon from "@mui/icons-material/Science";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";

const TeacherDiscoveryPage = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("achievements");

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  // Mock data for teacher preview stats
  const teacherStats = {
    totalAchievements: 24,
    unlockedAchievements: 24,
    totalDiscoveries: 48,
    unlockedDiscoveries: 48,
    studentProgress: 78, // Average student progress percentage
    topAchievement: "Chemistry Champion",
    recentUnlock: "Perfect Score",
  };

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "#0a0a0f",
        background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)",
        color: "white",
        minHeight: "100vh",
        width: "100vw",
        marginTop: "55px",
        overflowX: "hidden",
      }}
    >
      <Navbar open={open} />
      <TeacherSidebar
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        handleDrawerClose={handleDrawerClose}
      />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          transition: "margin 0.3s ease",
          marginLeft: open ? "180px" : "60px",
          maxWidth: "100%",
          overflow: "auto",
        }}
      >
        {/* Teacher Preview Banner */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: "rgba(0, 188, 212, 0.1)",
            border: "2px solid #00bcd4",
            borderRadius: "16px",
            p: 3,
            mb: 4,
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(0, 188, 212, 0.3)",
          }}
        >
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <SchoolIcon sx={{ fontSize: 40, color: "#00bcd4" }} />
            </Grid>
            <Grid item xs>
              <Box>
                <Typography variant="h4" sx={{ color: "#00bcd4", fontWeight: "bold", mb: 1 }}>
                  Teacher Preview Dashboard
                </Typography>
                <Typography variant="body1" sx={{ color: "#b0e0e6" }}>
                  View all achievements and discoveries that students can unlock. This preview shows the complete learning journey.
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Chip
                icon={<VisibilityIcon />}
                label="TEACHER VIEW"
                sx={{
                  bgcolor: "#00bcd4",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  px: 2,
                  py: 1,
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                bgcolor: "rgba(76, 175, 80, 0.1)",
                border: "2px solid #4caf50",
                borderRadius: "12px",
                height: "100%",
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-5px)" },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <EmojiEventsIcon sx={{ color: "#4caf50", mr: 2, fontSize: 30 }} />
                  <Typography variant="h6" sx={{ color: "#e8f5e9" }}>
                    Achievements
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ color: "#4caf50", fontWeight: "bold", mb: 1 }}>
                  {teacherStats.unlockedAchievements}/{teacherStats.totalAchievements}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(teacherStats.unlockedAchievements / teacherStats.totalAchievements) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "#4caf50",
                    },
                  }}
                />
                <Typography variant="caption" sx={{ color: "#b0b0b0", mt: 1, display: "block" }}>
                  100% unlocked for preview
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                bgcolor: "rgba(33, 150, 243, 0.1)",
                border: "2px solid #2196f3",
                borderRadius: "12px",
                height: "100%",
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-5px)" },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <ScienceIcon sx={{ color: "#2196f3", mr: 2, fontSize: 30 }} />
                  <Typography variant="h6" sx={{ color: "#e3f2fd" }}>
                    Discoveries
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ color: "#2196f3", fontWeight: "bold", mb: 1 }}>
                  {teacherStats.unlockedDiscoveries}/{teacherStats.totalDiscoveries}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(teacherStats.unlockedDiscoveries / teacherStats.totalDiscoveries) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "#2196f3",
                    },
                  }}
                />
                <Typography variant="caption" sx={{ color: "#b0b0b0", mt: 1, display: "block" }}>
                  All chemical compounds visible
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                bgcolor: "rgba(255, 152, 0, 0.1)",
                border: "2px solid #ff9800",
                borderRadius: "12px",
                height: "100%",
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-5px)" },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <AutoAwesomeIcon sx={{ color: "#ff9800", mr: 2, fontSize: 30 }} />
                  <Typography variant="h6" sx={{ color: "#fff3e0" }}>
                    Top Achievement
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ color: "#ff9800", fontWeight: "bold", mb: 1 }}>
                  {teacherStats.topAchievement}
                </Typography>
                <Chip
                  label="Legendary"
                  size="small"
                  sx={{
                    bgcolor: "rgba(255, 152, 0, 0.3)",
                    color: "#ff9800",
                    fontWeight: "bold",
                  }}
                />
                <Typography variant="caption" sx={{ color: "#b0b0b0", mt: 1, display: "block" }}>
                  Most prestigious achievement
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                bgcolor: "rgba(156, 39, 176, 0.1)",
                border: "2px solid #9c27b0",
                borderRadius: "12px",
                height: "100%",
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-5px)" },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <CheckCircleIcon sx={{ color: "#9c27b0", mr: 2, fontSize: 30 }} />
                  <Typography variant="h6" sx={{ color: "#f3e5f5" }}>
                    Recent Unlock
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ color: "#9c27b0", fontWeight: "bold", mb: 1 }}>
                  {teacherStats.recentUnlock}
                </Typography>
                <Chip
                  icon={<LockOpenIcon />}
                  label="Unlocked"
                  size="small"
                  sx={{
                    bgcolor: "rgba(156, 39, 176, 0.3)",
                    color: "#9c27b0",
                    fontWeight: "bold",
                  }}
                />
                <Typography variant="caption" sx={{ color: "#b0b0b0", mt: 1, display: "block" }}>
                  Latest student achievement
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tab Navigation - Enhanced */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: "rgba(30, 30, 46, 0.8)",
            borderRadius: "16px",
            p: 2,
            mb: 4,
            border: "1px solid rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              variant={activeTab === "achievements" ? "contained" : "outlined"}
              onClick={() => setActiveTab("achievements")}
              startIcon={<EmojiEventsIcon />}
              sx={{
                fontSize: "1.1rem",
                fontWeight: "bold",
                px: 4,
                py: 1.5,
                bgcolor: activeTab === "achievements" ? 
                  "linear-gradient(135deg, #00bcd4 0%, #008ba3 100%)" : "transparent",
                color: activeTab === "achievements" ? "white" : "#00bcd4",
                borderRadius: "12px",
                border: activeTab === "achievements" ? "none" : "2px solid #00bcd4",
                boxShadow: activeTab === "achievements" ? 
                  "0px 0px 20px rgba(0, 188, 212, 0.7)" : "none",
                "&:hover": {
                  bgcolor: activeTab === "achievements" ? 
                    "linear-gradient(135deg, #008ba3 0%, #006679 100%)" : "rgba(0, 188, 212, 0.1)",
                  boxShadow: "0px 0px 25px rgba(0, 188, 212, 1)",
                  border: "2px solid #00bcd4",
                },
                transition: "all 0.3s ease",
                minWidth: { xs: "100%", sm: "auto" },
              }}
            >
              Achievements Preview
            </Button>
            
            <Button
              variant={activeTab === "discovery" ? "contained" : "outlined"}
              onClick={() => setActiveTab("discovery")}
              startIcon={<ScienceIcon />}
              sx={{
                fontSize: "1.1rem",
                fontWeight: "bold",
                px: 4,
                py: 1.5,
                bgcolor: activeTab === "discovery" ? 
                  "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)" : "transparent",
                color: activeTab === "discovery" ? "white" : "#2196f3",
                borderRadius: "12px",
                border: activeTab === "discovery" ? "none" : "2px solid #2196f3",
                boxShadow: activeTab === "discovery" ? 
                  "0px 0px 20px rgba(33, 150, 243, 0.7)" : "none",
                "&:hover": {
                  bgcolor: activeTab === "discovery" ? 
                    "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)" : "rgba(33, 150, 243, 0.1)",
                  boxShadow: "0px 0px 25px rgba(33, 150, 243, 1)",
                  border: "2px solid #2196f3",
                },
                transition: "all 0.3s ease",
                minWidth: { xs: "100%", sm: "auto" },
              }}
            >
              Discovery Preview
            </Button>
          </Box>
        </Paper>

        {/* Content Area */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: "rgba(20, 20, 35, 0.8)",
            borderRadius: "16px",
            p: 3,
            border: "1px solid rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            minHeight: "500px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
          }}
        >
          {activeTab === "achievements" ? (
            <>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <EmojiEventsIcon sx={{ color: "#00bcd4", mr: 2, fontSize: 32 }} />
                <Typography variant="h4" sx={{ color: "#00bcd4", fontWeight: "bold" }}>
                  Achievements Preview
                </Typography>
                <Tooltip title="All achievements unlocked for teacher preview">
                  <IconButton sx={{ ml: 2, color: "#00bcd4" }}>
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <TeacherAchievementTable />
            </>
          ) : (
            <>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <ScienceIcon sx={{ color: "#2196f3", mr: 2, fontSize: 32 }} />
                <Typography variant="h4" sx={{ color: "#2196f3", fontWeight: "bold" }}>
                  Discovery Preview
                </Typography>
                <Tooltip title="All discoveries unlocked for teacher preview">
                  <IconButton sx={{ ml: 2, color: "#2196f3" }}>
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <TeacherDiscovery />
            </>
          )}
        </Paper>

        {/* Footer Note */}
        <Paper
          elevation={0}
          sx={{
            mt: 4,
            p: 2,
            bgcolor: "rgba(30, 30, 46, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <Typography variant="body2" sx={{ color: "#888", fontStyle: "italic" }}>
            Teacher Preview Mode • All content visible for educational planning • Updated in real-time
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default TeacherDiscoveryPage;