import React from "react";
import { Card, Typography, Grid } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

const achievements = Array(8).fill(false);

const AchievementsCard = () => {
  return (
    <Card
      sx={{
        bgcolor: "#292929",
        color: "white",
        p: 2,
        width: "100%",
        border: "2px solid #8bc34a",
        borderRadius: '10px',
        boxShadow: "0px 0px 15px rgba(139, 195, 74, 0.6)",
        transition: "transform 0.2s, box-shadow 0.3s",
        "&:hover": {
          boxShadow: "0px 0px 20px rgba(139, 195, 74, 1)",
        },
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          textTransform: "uppercase",
          textShadow: "0px 0px 5px rgba(255, 64, 129, 0.8)",
        }}
      >
        Recent Achievements
      </Typography>
      <Grid container spacing={1} sx={{ mt: 1 }}>
        {achievements.map((unlocked, index) => (
          <Grid item key={index}>
            {unlocked ? <Typography>🏆</Typography> : <LockIcon />}
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

export default AchievementsCard;
