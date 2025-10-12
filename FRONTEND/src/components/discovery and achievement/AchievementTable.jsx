import React, { useEffect, useState } from "react";
import {
  Grid, Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, IconButton
} from "@mui/material";
import { Lock, EmojiEvents, Close } from "@mui/icons-material";
import achievements from "../MiniGames/achievements.json";
import AchievementService from "../../services/AchievementService";
import UserService from "../../services/UserService";

const AchievementTable = () => {
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  useEffect(() => {
    const fetchUserAchievements = async () => {
      try {
        setLoading(true);
        const currentUser = await UserService.getCurrentUser();
        if (!currentUser) return setError("No user logged in");

        const userIdValue = currentUser.id || currentUser.userId;
        if (!userIdValue) return setError("No valid user ID found");

        const achievementArray = await AchievementService.getAchievementsByUser(userIdValue);
        const validCodeNames = achievementArray
          .filter(item => item.title && typeof item.title === "string")
          .map(item => item.title.trim());

        setUnlockedAchievements(validCodeNames);
      } catch (error) {
        setError(error.message || "Failed to fetch achievements");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAchievements();
  }, []);

  const handleCardClick = (achievement) => {
    if (unlockedAchievements.includes(achievement.codeName.trim())) {
      setSelectedAchievement(achievement);
    }
  };

  const handleCloseModal = () => setSelectedAchievement(null);

  if (loading || error) {
    return (
      <Grid container spacing={2} sx={{ padding: 2, marginTop: "15px" }}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ color: error ? "#F44336" : 'white', textAlign: 'center' }}>
            {error ? `Error: ${error}` : "Loading achievements..."}
          </Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <>
      <Grid container spacing={3} sx={{ padding: 2, marginTop: "15px" }}>
        {achievements.map((achievement, index) => {
          const codeName = achievement?.codeName?.trim();
          if (!codeName) return null;
          const isUnlocked = unlockedAchievements.includes(codeName);

          return (
            <Grid item xs={12} sm={6} md={4} lg={2} key={codeName}>
              <Card
                onClick={() => handleCardClick(achievement)}
                sx={{
                  bgcolor: "#1e1e1e",
                  color: isUnlocked ? "#fffde7" : "#888",
                  textAlign: "center",
                  padding: 2,
                  borderRadius: "16px",
                  minHeight: 180,
                  width: "auto",
                  cursor: isUnlocked ? "pointer" : "default",
                  boxShadow: isUnlocked
                    ? "0 0 15px 3px rgba(255, 193, 7, 0.5)"
                    : "0 0 10px rgba(128, 128, 128, 0.2)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: isUnlocked ? "scale(1.08)" : "scale(1.02)",
                    boxShadow: isUnlocked
                      ? "0 0 25px 5px rgba(255, 214, 0, 0.9)"
                      : "0 0 15px rgba(100, 100, 100, 0.4)",
                  },
                }}
              >
                <CardContent>
                  {isUnlocked ? (
                    <>
                      <EmojiEvents sx={{ fontSize: 40, color: "#fff176", mb: 1 }} />
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          textShadow: "0 0 5px #ffeb3b",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {achievement.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ display: 'block', fontStyle: 'italic', mt: 1, opacity: 0.8 }}
                      >
                        ✅ Unlocked
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Lock sx={{ fontSize: 40, color: "gray", mb: 1 }} />
                      <Typography variant="body2">{achievement.title}</Typography>
                      <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
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

      {/* Achievement Modal */}
      {selectedAchievement && (
        <Dialog
          open={!!selectedAchievement}
          onClose={handleCloseModal}
          PaperProps={{
            sx: {
              background: "rgba(31, 31, 31, 0.9)",
              border: "2px solid #ffb300",
              borderRadius: 4,
              backdropFilter: "blur(10px)",
              boxShadow: "0 0 30px rgba(255, 193, 7, 0.8)",
              color: "white",
              padding: 2,
              maxWidth: 480,
              animation: "fadeIn 0.3s ease-in-out",
              position: "relative"
            },
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: 700,
              fontSize: "1.75rem",
              background: "linear-gradient(90deg, #ffc107, #ff9800)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 6px rgba(255, 193, 7, 0.7)",
              pb: 1,
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <EmojiEvents sx={{ fontSize: 32, color: "#ffeb3b" }} />
              {selectedAchievement.title}
            </span>
            <IconButton onClick={handleCloseModal} sx={{ color: "#ffeb3b" }}>
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ mt: 1 }}>
            <Typography
              variant="body1"
              sx={{
                fontSize: "1.1rem",
                lineHeight: 1.6,
                textAlign: "center",
                color: "#ffe082",
                textShadow: "0 0 3px #ffcc80",
                px: 2,
              }}
            >
              {selectedAchievement.description}
            </Typography>
          </DialogContent>
        </Dialog>

      )}
    </>
  );
};

export default AchievementTable;
