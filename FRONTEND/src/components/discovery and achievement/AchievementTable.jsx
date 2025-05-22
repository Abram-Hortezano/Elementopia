import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import { Lock } from "@mui/icons-material";
import achievements from "../Student Components/achievements.json"; // Your achievements JSON file
import AchievementService from "../../services/AchievementService";
import UserService from "../../services/UserService";

const AchievementTable = () => {
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserAchievements = async () => {
      try {
        setLoading(true);
        const currentUser = await UserService.getCurrentUser();
        
        if (!currentUser) {
          setError("No user logged in");
          return;
        }

        // Handle both id and userId properties
        const userIdValue = currentUser.id || currentUser.userId;
        
        if (!userIdValue) {
          setError("No valid user ID found");
          return;
        }

        console.log("Fetching achievements for user ID:", userIdValue);

        const achievementArray = await AchievementService.getAchievementsByUser(userIdValue);
        console.log("Achievements from backend:", achievementArray);

        // Make sure you're using `codeName` from backend
        const validCodeNames = achievementArray
          .filter(item => item.title && typeof item.title === "string")
          .map(item => item.title.trim());

        setUnlockedAchievements(validCodeNames);
        setError(null);

      } catch (error) {
        console.error("Error fetching achievements:", error);
        setError(error.message || "Failed to fetch achievements");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAchievements();
  }, []);

  if (loading) {
    return (
      <Grid container spacing={2} sx={{ padding: 2, marginTop: "15px" }}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ color: 'white', textAlign: 'center' }}>
            Loading achievements...
          </Typography>
        </Grid>
      </Grid>
    );
  }

  if (error) {
    return (
      <Grid container spacing={2} sx={{ padding: 2, marginTop: "15px" }}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ color: '#F44336', textAlign: 'center' }}>
            Error: {error}
          </Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={2} sx={{ padding: 2, marginTop: "15px" }}>
      {achievements.map((achievement, index) => {
        // Use codeName as the key identifier for consistency
        const achievementCodeName = achievement?.codeName?.trim();
        
        if (!achievementCodeName) {
          console.warn(`Achievement at index ${index} is missing codeName:`, achievement);
          return null;
        }

        const isUnlocked = unlockedAchievements.includes(achievementCodeName);

        return (
          <Grid item xs={12} sm={6} md={4} lg={2} key={achievementCodeName}>
            <Card
              sx={{
                bgcolor: isUnlocked ? "#ff9800" : "#222",
                color: "white",
                textAlign: "center",
                padding: 2,
                borderRadius: "12px",
                boxShadow: isUnlocked 
                  ? "0px 0px 10px rgba(255, 152, 0, 0.5)" 
                  : "0px 0px 5px rgba(128, 128, 128, 0.3)",
                transition: "transform 0.2s, boxShadow 0.3s",
                "&:hover": isUnlocked
                  ? {
                      transform: "scale(1.05)",
                      boxShadow: "0px 0px 20px rgba(255, 152, 0, 0.8)",
                    }
                  : {
                      transform: "scale(1.02)",
                      boxShadow: "0px 0px 8px rgba(128, 128, 128, 0.5)",
                    },
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
                        marginBottom: 1,
                      }}
                    >
                      {achievement.title || achievementCodeName}
                    </Typography>
                    <Typography variant="body2" sx={{ marginTop: 1 }}>
                      {achievement.description || "No description available"}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        marginTop: 1, 
                        display: 'block',
                        fontStyle: 'italic',
                        opacity: 0.8
                      }}
                    >
                      ✅ Unlocked
                    </Typography>
                  </>
                ) : (
                  <>
                    <Lock sx={{ fontSize: 40, color: "gray", marginBottom: 1 }} />
                    <Typography variant="body2" sx={{ color: "gray" }}>
                      {achievement.title || achievementCodeName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "gray", marginTop: 1, display: 'block' }}>
                      🔒 Locked
                    </Typography>
                  </>
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