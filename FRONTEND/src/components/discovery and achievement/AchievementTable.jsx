import React, { useState, useEffect } from "react";
import { Card, CardContent, Grid, Typography, Box, Tooltip, Button, CircularProgress } from "@mui/material";
import { Lock, EmojiEvents, Refresh } from "@mui/icons-material";
import AchievementService from '../../services/AchievementService';

const AchievementsTable = () => {
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Define your achievement templates
  const achievementTemplates = [
    { id: 1, title: "Memory Novice", description: "Complete the easy difficulty memory game", codeName: "MEMORY_NOVICE" },
    { id: 2, title: "Memory Intermediate", description: "Complete the medium difficulty memory game", codeName: "MEMORY_INTERMEDIATE" },
    { id: 3, title: "Memory Master", description: "Complete the hard difficulty memory game", codeName: "MEMORY_MASTER" },
    { id: 4, title: "Element Explorer", description: "Discover your first element", codeName: "ELEMENT_EXPLORER" },
    { id: 5, title: "Chemistry Novice", description: "Complete your first chemistry challenge", codeName: "CHEMISTRY_NOVICE" },
    { id: 6, title: "Quiz Master", description: "Score 100% on a quiz", codeName: "QUIZ_MASTER" },
    { id: 7, title: "Quick Matchmaker", description: "Complete an Easy level within 20 turns", codeName: "QUICK_MATCHMAKER" },
    { id: 8, title: "Score Hunter", description: "Achieve a total score of 100+ points", codeName: "SCORE_HUNTER" },
    { id: 9, title: "Master Matcher", description: "Complete all 3 levels (Easy → Medium → Hard)", codeName: "MASTER_MATCHER" },
    // Add more achievements to match your 24 achievement slots
    // ...
  ];
  
  // Fill remaining slots with placeholder locked achievements
  const totalAchievements = 24;
  const remainingAchievements = totalAchievements - achievementTemplates.length;
  
  for (let i = 0; i < remainingAchievements; i++) {
    achievementTemplates.push({ 
      id: achievementTemplates.length + 1 + i, 
      title: "Hidden Achievement", 
      description: "Keep exploring to unlock this achievement",
      codeName: `HIDDEN_${i + 1}`
    });
  }

  const fetchAchievements = async () => {
    try {
      setRefreshing(true);
      const user = JSON.parse(sessionStorage.getItem("user"));
      if (user && user.id) {
        const userAchievements = await AchievementService.getAchievementsByUser(user.id);
        // Extract just the IDs or code names of unlocked achievements
        const unlockedCodes = userAchievements.map(achievement => achievement.codeName);
        setUnlockedAchievements(unlockedCodes);
      }
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error("Failed to fetch achievements:", error);
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchAchievements();
    
    // Optional: Set up auto-refresh every 30 seconds
    const intervalId = setInterval(fetchAchievements, 30000);
    
    // Clean up the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const handleRefresh = () => {
    fetchAchievements();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, padding: 2 }}>
        <Typography variant="h4">Achievements</Typography>
        <Button 
          variant="outlined" 
          startIcon={<Refresh />} 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </Box>
      
      <Grid container spacing={2} justifyContent="center" sx={{ padding: 2 }}>
        {achievementTemplates.map((achievement) => {
          const isUnlocked = unlockedAchievements.includes(achievement.codeName);

          return (
            <Grid item xs={12} sm={6} md={4} lg={2} key={achievement.id}>
              <Tooltip title={isUnlocked ? achievement.description : "Achievement locked"}>
                <Card
                  sx={{
                    bgcolor: isUnlocked ? "cyan" : "#222",
                    color: "white",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center", 
                    padding: 2,
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
                      <Box sx={{ textAlign: 'center' }}>
                        <EmojiEvents sx={{ fontSize: 40, color: "gold", mb: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                          {achievement.title}
                        </Typography>
                      </Box>
                    ) : (
                      <Lock sx={{ fontSize: 40, color: "gray" }} />
                    )}
                  </CardContent>
                </Card>
              </Tooltip>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default AchievementsTable;