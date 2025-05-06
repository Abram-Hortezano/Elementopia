import React, { useState } from "react";
// import Confetti from 'react-confetti';
// import { useWindowSize } from 'react-use';
import { Box, Grid, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ElementMatchGame from "../components/MiniGames/ElementMatchGame"; // Import your mini-game here
import Assistant from "../components/Student Components/Assistant";
// Assets
import card1 from "../assets/img/card1.jpg";
import card2 from "../assets/img/card2.jpg";
import card3 from "../assets/img/card3.jpg";
import card4 from "../assets/img/card4.jpg";
import card5 from "../assets/img/card5.jpg";

// Styles
import "../assets/css/StudentGameRoomPage.css";
import StudentElementMatcher from "./StudentElementMatcher";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const gameCards = [
  { text: "Build the Atom", image: card1 },
  { text: "Elemental Match", image: card2 },
  { text: "Molecule Maker", image: card3 },
  { text: "Periodic Quest", image: card4 },
  { text: "Bond Breaker", image: card5 },
];

const StudentGameRoomPage = () => {
  const [open, setOpen] = useState(false);
<<<<<<< HEAD
  const [selectedGame, setSelectedGame] = useState(null);
  const studentName = "Mark";
=======
>>>>>>> 879aeda83d1096b1647f0fe8117b12d5078a0a54

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  return (
<<<<<<< HEAD
    <Box sx={{ bgcolor: "#121212", color: "white", minHeight: "100vh", width: "100vw" }}>
      <Navbar open={open} />
      <Sidebar open={open} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: open ? "20px" : "10px", width: "100%" }}>
        <DrawerHeader />

        {/* Show Back button and selected game if any */}
        {selectedGame ? (
          <>
            <Button
              variant="outlined"
              onClick={() => setSelectedGame(null)}
              sx={{ mb: 2, color: "white", borderColor: "white" }}
            >
              ⬅ Back to Game List
            </Button>

            {selectedGame === "Elemental Match" && <ElementMatchGame />}
            {/* Add more games here */}
          </>
        ) : (
          <Grid
            container
            spacing={2}
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            {gameCards.map((card, index) => (
              <Grid item key={index}>
                <div
                  className={`game-card ${selectedGame === card.text ? "selected" : ""}`}
                  onClick={() => setSelectedGame(card.text)}
                  style={{
                    backgroundImage: `url(${card.image})`,
                  }}
                >
                  <span className="card-text">{card.text}</span>
                </div>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Optional game or interaction area */}
=======
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
>>>>>>> 879aeda83d1096b1647f0fe8117b12d5078a0a54
        <StudentElementMatcher />
      </Box>

      {/* Assistant component */}
      <div className="game-room">
        <Assistant studentName={studentName} />
      </div>
    </Box>
  );
};

export default StudentGameRoomPage;
