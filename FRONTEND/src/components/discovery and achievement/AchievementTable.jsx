import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AchievementService from "../../services/AchievementService";
import UserService from "../../services/UserService";

// Define all possible achievements (must match backend codeName)
const ALL_ACHIEVEMENTS = [
  { id: 'first_lesson', title: 'First Steps', description: 'Complete your first lesson', icon: '📚', category: 'Progress', rarity: 'Common' },
  { id: 'first_challenge', title: 'Challenge Accepted', description: 'Complete your first challenge', icon: '⭐', category: 'Challenges', rarity: 'Common' },
  { id: 'three_challenges', title: 'Hat Trick', description: 'Complete 3 challenges', icon: '🎯', category: 'Challenges', rarity: 'Uncommon' },
  { id: 'atomic_master', title: 'Atomic Master', description: 'Complete all Atom lessons', icon: '⚛️', category: 'Mastery', rarity: 'Rare' },
  { id: 'score_500', title: 'Rising Star', description: 'Earn 500 points', icon: '🌟', category: 'Scoring', rarity: 'Uncommon' },
  { id: 'score_1000', title: 'High Achiever', description: 'Earn 1000 points', icon: '🏆', category: 'Scoring', rarity: 'Rare' },
  { id: 'perfect_score', title: 'Perfect Score', description: 'Earn maximum points (1800)', icon: '👑', category: 'Scoring', rarity: 'Legendary' },
];

const getRarityColor = (rarity) => {
  switch (rarity) {
    case 'Common': return '#9e9e9e';
    case 'Uncommon': return '#4caf50';
    case 'Rare': return '#2196f3';
    case 'Legendary': return '#ff9800';
    default: return '#9e9e9e';
  }
};

const AchievementTable = () => {
  const [earnedAchievements, setEarnedAchievements] = useState(new Set());
  const [earnedDetails, setEarnedDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const user = await UserService.getCurrentUser();
        if (!user?.userId) return;

        const achievements = await AchievementService.getAchievementsByUser(user.userId);

        console.log("🏆 Backend achievements:", achievements);

        // ✅ FIXED: use codeName instead of achievementId / id
        const earnedSet = new Set(
          achievements.map(a => a.codeName)
        );

        setEarnedAchievements(earnedSet);
        setEarnedDetails(achievements);

      } catch (error) {
        console.error("Failed to load achievements:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, []);

  const completionPercentage = Math.round(
    (earnedAchievements.size / ALL_ACHIEVEMENTS.length) * 100
  );

  const categories = ['Progress', 'Challenges', 'Scoring', 'Mastery'];

  return (
    <Box>

      {/* HEADER STATS */}
      <Box
        sx={{
          mb: 4,
          p: 3,
          bgcolor: "#1e1e1e",
          borderRadius: "12px",
          border: "2px solid #00bcd4",
          boxShadow: "0px 0px 20px rgba(0, 188, 212, 0.4)",
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" sx={{ color: '#00bcd4', fontWeight: 'bold' }}>
              Your Achievements
            </Typography>
            <Typography sx={{ color: '#888' }}>Track your progress</Typography>
          </Box>
          <Typography variant="h3" sx={{ color: '#ffd700' }}>
            {earnedAchievements.size}/{ALL_ACHIEVEMENTS.length}
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <LinearProgress
            variant="determinate"
            value={completionPercentage}
            sx={{ height: 12, borderRadius: 6 }}
          />
        </Box>
      </Box>

      {loading ? (
        <Typography sx={{ textAlign: "center", color: "#888" }}>
          Loading achievements...
        </Typography>
      ) : (
        <>
          {/* CATEGORY SECTIONS */}
          {categories.map(category => {
            const categoryAchievements = ALL_ACHIEVEMENTS.filter(a => a.category === category);
            const earnedInCategory = categoryAchievements.filter(a => earnedAchievements.has(a.id)).length;

            return (
              <Box key={category} sx={{ mb: 4 }}>

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography sx={{ color: "#00bcd4", fontWeight: "bold" }}>
                    {category.toUpperCase()}
                  </Typography>
                  <Chip label={`${earnedInCategory}/${categoryAchievements.length}`} />
                </Box>

                <Grid container spacing={3}>
                  {categoryAchievements.map(achievement => {
                    const isUnlocked = earnedAchievements.has(achievement.id);

                    // ✅ FIXED MATCH USING codeName
                    const earnedData = earnedDetails.find(
                      e => e.codeName === achievement.id
                    );

                    return (
                      <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                        <Card
                          sx={{
                            bgcolor: isUnlocked ? '#1e1e1e' : '#0f0f0f',
                            border: `2px solid ${isUnlocked ? getRarityColor(achievement.rarity) : '#333'}`,
                            borderRadius: "12px",
                            opacity: isUnlocked ? 1 : 0.5
                          }}
                        >

                          {/* RARITY BADGE */}
                          <Box
                            sx={{
                              position: 'absolute',
                              top: -12,
                              right: 16,
                              bgcolor: getRarityColor(achievement.rarity),
                              px: 2,
                              py: 0.4,
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: 'bold'
                            }}
                          >
                            {achievement.rarity}
                          </Box>

                          <CardContent>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              <span style={{ fontSize: "3rem" }}>{achievement.icon}</span>

                              <Box>
                                <Typography variant="h6">{achievement.title}</Typography>

                                {isUnlocked ? (
                                  <Chip icon={<CheckCircleIcon />} label="Unlocked" color="success" />
                                ) : (
                                  <Chip icon={<LockIcon />} label="Locked" />
                                )}
                              </Box>
                            </Box>

                            <Typography sx={{ mt: 1 }}>
                              {achievement.description}
                            </Typography>

                            {/* ✅ DATE FIXED */}
                            {isUnlocked && earnedData?.dateAchieved && (
                              <Typography sx={{ fontSize: '0.7rem', color: '#aaa' }}>
                                Unlocked on: {new Date(earnedData.dateAchieved).toLocaleDateString()}
                              </Typography>
                            )}

                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>

              </Box>
            );
          })}

          {/* EMPTY STATE */}
          {earnedAchievements.size === 0 && (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <EmojiEventsIcon sx={{ fontSize: 64, color: '#555' }} />
              <Typography>No achievements yet</Typography>
            </Box>
          )}

        </>
      )}
    </Box>
  );
};

export default AchievementTable;
