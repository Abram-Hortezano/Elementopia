import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import { Lock } from "@mui/icons-material";
import achievements from "../Student Components/achievements.json"; // Your achievements JSON file
import AchievementService from "../../services/AchievementService";
import UserService from "../../services/UserService";

const AchievementTable = () => {
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);

  useEffect(() => {
    const fetchUserAchievements = async () => {
      const currentUser = await UserService.getCurrentUser();
      if (currentUser?.userId) {
        try {
          const achievementArray = await AchievementService.getAchievementsByUser(currentUser.userId);
          console.log("Achievements from backend:", achievementArray);

          // achievementArray is assumed to be an array of achievement objects
          const validNames = achievementArray
            .filter(item => item.name && typeof item.name === "string")
            .map(item => item.name.trim());
          setUnlockedAchievements(validNames);
        } catch (error) {
          console.error("Error fetching achievements:", error);
        }
      } else {
        console.error("No valid user ID found.");
      }
    };
    fetchUserAchievements();
  }, []);

  return (
    <Grid container spacing={2} sx={{ padding: 2, marginTop: "15px" }}>
      {achievements.map((achievement, index) => {
        // Use codeName as key identifier for consistency, fallback to index if missing
        const achievementName = achievement?.codeName?.trim() || `Unnamed Achievement ${index}`;
        const isUnlocked = unlockedAchievements.includes(achievementName);

        return (
          <Grid item xs={12} sm={6} md={4} lg={2} key={achievementName}>
            <Card
              sx={{
                bgcolor: isUnlocked ? "#ff9800" : "#222",
                color: "white",
                textAlign: "center",
                padding: 2,
                borderRadius: "12px",
                boxShadow: "0px 0px 10px rgba(255, 152, 0, 0.5)",
                transition: "transform 0.2s, boxShadow 0.3s",
                "&:hover": isUnlocked
                  ? {
                      transform: "scale(1.05)",
                      boxShadow: "0px 0px 20px rgba(255, 152, 0, 0.8)",
                    }
                  : {},
              }}
            >
              <CardContent>
                {isUnlocked ? (
                  <>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        textShadow: "0px 0px 5px rgba(255, 152, 0, 0.8)",
                      }}
                    >
                      {achievement.title || achievementName}
                    </Typography>
                    <Typography variant="body2" sx={{ marginTop: 1 }}>
                      {achievement.description || "No description available"}
                    </Typography>
                  </>
                ) : (
                  <Lock sx={{ fontSize: 40, color: "gray" }} />
                )}
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default AchievementTable;
