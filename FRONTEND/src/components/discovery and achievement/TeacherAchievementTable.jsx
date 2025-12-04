import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  CardActionArea,
  Alert,
  CircularProgress,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InfoIcon from "@mui/icons-material/Info";
import AchievementService from "../../services/AchievementService";
import UserService from "../../services/UserService";

// Define all possible achievements (must match backend codeName)
const ALL_ACHIEVEMENTS = [
  { id: 'first_lesson', title: 'First Steps', description: 'Complete your first lesson', icon: '📚', category: 'Progress', rarity: 'Common', points: 100 },
  { id: 'first_challenge', title: 'Challenge Accepted', description: 'Complete your first challenge', icon: '⭐', category: 'Challenges', rarity: 'Common', points: 150 },
  { id: 'three_challenges', title: 'Hat Trick', description: 'Complete 3 challenges', icon: '🎯', category: 'Challenges', rarity: 'Uncommon', points: 200 },
  { id: 'atomic_master', title: 'Atomic Master', description: 'Complete all Atom lessons', icon: '⚛️', category: 'Mastery', rarity: 'Rare', points: 250 },
  { id: 'score_500', title: 'Rising Star', description: 'Earn 500 points', icon: '🌟', category: 'Scoring', rarity: 'Uncommon', points: 300 },
  { id: 'score_1000', title: 'High Achiever', description: 'Earn 1000 points', icon: '🏆', category: 'Scoring', rarity: 'Rare', points: 400 },
  { id: 'perfect_score', title: 'Perfect Score', description: 'Earn maximum points (1800)', icon: '👑', category: 'Scoring', rarity: 'Legendary', points: 500 },
  { id: 'all_complete', title: 'Chemistry Champion', description: 'Complete all lessons', icon: '🎓', category: 'Mastery', rarity: 'Legendary', points: 1000 },
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

const TeacherAchievementTable = () => {
  const [earnedAchievements, setEarnedAchievements] = useState(new Set());
  const [earnedDetails, setEarnedDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const user = await UserService.getCurrentUser();
        if (!user?.userId) return;

        const achievements = await AchievementService.getAchievementsByUser(user.userId);

        console.log("🏆 Backend achievements:", achievements);

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress sx={{ color: '#00bcd4' }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Teacher Preview Banner */}
      <Alert 
        severity="info" 
        icon={<VisibilityIcon />}
        sx={{ 
          mb: 4, 
          bgcolor: 'rgba(0, 188, 212, 0.1)', 
          border: '1px solid #00bcd4',
          color: '#e0f7fa',
          '& .MuiAlert-icon': { color: '#00bcd4' }
        }}
      >
        <Typography variant="body2">
          <strong>Teacher Preview:</strong> All achievements are shown as unlocked for preview purposes. 
          This view helps you understand what students can achieve.
        </Typography>
      </Alert>

      {/* HEADER STATS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              bgcolor: "rgba(30, 30, 46, 0.8)",
              border: "2px solid #00bcd4",
              borderRadius: "16px",
              p: 3,
              backdropFilter: "blur(10px)",
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h5" sx={{ color: '#00bcd4', fontWeight: 'bold', mb: 1 }}>
                  Achievement Progress
                </Typography>
                <Typography sx={{ color: '#b0b0b0' }}>Total achievements available for students</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h2" sx={{ color: '#00bcd4', fontWeight: 'bold' }}>
                  {ALL_ACHIEVEMENTS.length}
                </Typography>
                <Typography variant="caption" sx={{ color: '#888' }}>Total Achievements</Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  Teacher Preview: {ALL_ACHIEVEMENTS.length} unlocked
                </Typography>
                <Typography variant="body2" sx={{ color: '#00bcd4', fontWeight: 'bold' }}>
                  100%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={100}
                sx={{ 
                  height: 12, 
                  borderRadius: 6,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#00bcd4',
                    borderRadius: 6,
                  }
                }}
              />
            </Box>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              bgcolor: "rgba(30, 30, 46, 0.8)",
              border: "2px solid #4caf50",
              borderRadius: "16px",
              p: 3,
              height: '100%',
              backdropFilter: "blur(10px)",
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <EmojiEventsIcon sx={{ fontSize: 48, color: '#ffd700', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#4caf50', mb: 1 }}>
                Total Points Available
              </Typography>
              <Typography variant="h3" sx={{ color: '#ffd700', fontWeight: 'bold' }}>
                {ALL_ACHIEVEMENTS.reduce((sum, a) => sum + a.points, 0)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#888', display: 'block', mt: 1 }}>
                Maximum points students can earn
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* CATEGORY SECTIONS */}
      {categories.map(category => {
        const categoryAchievements = ALL_ACHIEVEMENTS.filter(a => a.category === category);
        const earnedInCategory = categoryAchievements.filter(a => earnedAchievements.has(a.id)).length;

        return (
          <Box key={category} sx={{ mb: 5 }}>
            {/* Category Header */}
            <Box sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              mb: 3,
              p: 2,
              bgcolor: 'rgba(30, 30, 46, 0.5)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(0, 188, 212, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography sx={{ color: '#00bcd4', fontWeight: 'bold' }}>
                    {category.charAt(0)}
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ color: "#00bcd4", fontWeight: "bold" }}>
                  {category} Achievements
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip 
                  label={`${categoryAchievements.length} total`} 
                  sx={{ bgcolor: 'rgba(0, 188, 212, 0.2)', color: '#00bcd4' }}
                />
                <Chip 
                  label="All unlocked" 
                  color="success" 
                  icon={<CheckCircleIcon />}
                />
              </Box>
            </Box>

            <Grid container spacing={3}>
              {categoryAchievements.map(achievement => {
                const isUnlocked = true; // For teacher preview, show all as unlocked
                const earnedData = earnedDetails.find(e => e.codeName === achievement.id);

                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={achievement.id}>
                    <Card
                      sx={{
                        bgcolor: 'rgba(30, 30, 46, 0.8)',
                        border: `2px solid ${getRarityColor(achievement.rarity)}`,
                        borderRadius: "16px",
                        backdropFilter: "blur(10px)",
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: `0 12px 24px rgba(0, 0, 0, 0.3)`,
                        },
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedAchievement(achievement)}
                    >
                      <CardActionArea>
                        <CardContent sx={{ p: 3 }}>
                          {/* Rarity Badge */}
                          <Box
                            sx={{
                              position: 'absolute',
                              top: -10,
                              right: 16,
                              bgcolor: getRarityColor(achievement.rarity),
                              px: 2,
                              py: 0.5,
                              borderRadius: '12px',
                              fontSize: '0.7rem',
                              fontWeight: 'bold',
                              color: 'white',
                              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                            }}
                          >
                            {achievement.rarity}
                          </Box>

                          {/* Achievement Icon */}
                          <Box sx={{ 
                            textAlign: 'center', 
                            mb: 2,
                            fontSize: '3.5rem',
                            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
                          }}>
                            {achievement.icon}
                          </Box>

                          {/* Achievement Title */}
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              textAlign: 'center', 
                              mb: 1,
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          >
                            {achievement.title}
                          </Typography>

                          {/* Achievement Description */}
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              textAlign: 'center', 
                              mb: 2,
                              color: '#b0b0b0',
                              height: 40,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {achievement.description}
                          </Typography>

                          {/* Points and Status */}
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            mt: 2
                          }}>
                            <Chip
                              label={`${achievement.points} pts`}
                              size="small"
                              sx={{
                                bgcolor: 'rgba(255, 215, 0, 0.2)',
                                color: '#ffd700',
                                fontWeight: 'bold'
                              }}
                            />
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                              <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                                UNLOCKED
                              </Typography>
                            </Box>
                          </Box>

                          {/* Teacher Preview Indicator */}
                          <Box sx={{ 
                            textAlign: 'center', 
                            mt: 2,
                            pt: 1,
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            <Typography variant="caption" sx={{ color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                              <VisibilityIcon sx={{ fontSize: 14 }} />
                              Teacher Preview
                            </Typography>
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        );
      })}

      {/* Selected Achievement Modal */}
      {selectedAchievement && (
        <Card
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 500,
            zIndex: 9999,
            bgcolor: 'rgba(20, 20, 35, 0.95)',
            backdropFilter: 'blur(20px)',
            border: `3px solid ${getRarityColor(selectedAchievement.rarity)}`,
            borderRadius: '20px',
            p: 4,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ fontSize: '4rem', mb: 2 }}>
              {selectedAchievement.icon}
            </Box>
            
            <Typography variant="h4" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>
              {selectedAchievement.title}
            </Typography>
            
            <Chip
              label={selectedAchievement.rarity}
              sx={{
                bgcolor: getRarityColor(selectedAchievement.rarity),
                color: 'white',
                fontWeight: 'bold',
                mb: 2
              }}
            />
            
            <Typography variant="body1" sx={{ color: '#b0b0b0', mb: 3 }}>
              {selectedAchievement.description}
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#888' }}>Points</Typography>
                <Typography variant="h5" sx={{ color: '#ffd700' }}>{selectedAchievement.points}</Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#888' }}>Category</Typography>
                <Typography variant="h6" sx={{ color: '#00bcd4' }}>{selectedAchievement.category}</Typography>
              </Box>
            </Box>
            
            <Button
              variant="contained"
              onClick={() => setSelectedAchievement(null)}
              sx={{
                bgcolor: '#00bcd4',
                color: 'white',
                '&:hover': { bgcolor: '#008ba3' },
                px: 4
              }}
            >
              Close Preview
            </Button>
          </Box>
        </Card>
      )}

      {/* Teacher Instructions */}
      <Card sx={{ 
        mt: 4, 
        bgcolor: 'rgba(30, 30, 46, 0.8)',
        border: '1px solid rgba(0, 188, 212, 0.3)',
        borderRadius: '12px',
        p: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <InfoIcon sx={{ color: '#00bcd4' }} />
          <Typography variant="h6" sx={{ color: '#00bcd4' }}>
            Teacher Notes
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
          This preview shows all achievements that students can earn. Use this information to:
        </Typography>
        <ul style={{ color: '#b0b0b0', marginLeft: 20, marginTop: 8 }}>
          <li>Understand the progression system students will experience</li>
          <li>Plan lessons around achievement milestones</li>
          <li>Motivate students with clear goals and rewards</li>
          <li>Track class-wide achievement progress</li>
        </ul>
      </Card>
    </Box>
  );
};

export default TeacherAchievementTable;