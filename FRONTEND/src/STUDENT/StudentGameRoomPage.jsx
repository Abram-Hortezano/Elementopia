import React, { useState } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import Navbar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import StudentElementMatcher from "./ElementMatcher";
import StudentStateChanges from "./StudentStateChanges";
import StudentCardMatching from "./StudentCardMinigame";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const StudentGameRoomPage = () => {
  const [open, setOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState("game1");

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const renderGame = () => {
    switch (selectedGame) {
      case "game1":
        return <StudentElementMatcher />;
      case "game2":
        return <StudentStateChanges />;
      case "game3":
        return <StudentCardMatching />;
      default:
        return null;
    }
  };

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
        }}
      >
        {/* Fix: Push content below navbar */}
        <DrawerHeader />

        {/* Fix: Buttons for switching games */}
        <Stack direction="row" spacing={2} mb={2}>
          <Button
            variant={selectedGame === "game1" ? "contained" : "outlined"}
            color="primary"
            onClick={() => setSelectedGame("game1")}
          >
            Element Matcher
          </Button>
          <Button
            variant={selectedGame === "game2" ? "contained" : "outlined"}
            color="secondary"
            onClick={() => setSelectedGame("game2")}
          >
            State Changes
          </Button>
          <Button
            variant={selectedGame === "game3" ? "contained" : "outlined"}
            color="success"
            onClick={() => setSelectedGame("game3")}
          >
            Card Matching
          </Button>
        </Stack>

        {/* Show selected game */}
        {renderGame()}
      </Box>
    </Box>
  );
};

export default StudentGameRoomPage;
