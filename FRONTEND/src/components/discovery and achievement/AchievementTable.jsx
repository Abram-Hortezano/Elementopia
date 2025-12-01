import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AchievementService from "../../services/AchievementService";
import UserService from "../../services/UserService";

// Define all possible achievements (must match MapTree.jsx)
const ALL_ACHIEVEMENTS = [
  {
    id: 'first_lesson',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '📚',
    category: 'Progress',
    rarity: 'Common'
  },
  {
    id: 'first_challenge',
    title: 'Challenge Accepted',
    description: 'Complete your first challenge',
    icon: '⭐',
    category: 'Challenges',
    rarity: 'Common'
  },
  {
    id: 'three_challenges',
    title: 'Hat Trick',
    description: 'Complete 3 challenges',
    icon: '🎯',
    category: 'Challenges',
    rarity: 'Uncommon'
  },
  {
    id: 'atomic_master',
    title: 'Atomic Master',
    description: 'Complete all Atom lessons',
    icon: '⚛️',
    category: 'Mastery',
    rarity: 'Rare'
  },
  {
    id: 'score_500',
    title: 'Rising Star',
    description: 'Earn 500 points',
    icon: '🌟',
    category: 'Scoring',
    rarity: 'Uncommon'
  },
  {
    id: 'score_1000',
    title: 'High Achiever',
    description: 'Earn 1000 points',
    icon: '🏆',
    category: 'Scoring',
    rarity: 'Rare'
  },
  {
    id: 'perfect_score',
    title: 'Perfect Score',
    description: 'Earn maximum points (1800)',
    icon: '👑',
    category: 'Scoring',
    rarity: 'Legendary'
  },
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
        if (user?.userId) {
          const achievements = await AchievementService.getAchievementsByUser(user.userId);
          const earnedIds = new Set(achievements.map(a => a.achievementId || a.id));
          setEarnedAchievements(earnedIds);
          setEarnedDetails(achievements);
          console.log(`🏆 Loaded ${earnedIds.size} achievements`);
        }
      } catch (error) {
        console.error("Failed to load achievements:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, []);

  const completionPercentage = Math.round((earnedAchievements.size / ALL_ACHIEVEMENTS.length) * 100);
  const categories = ['Progress', 'Challenges', 'Scoring', 'Mastery'];

  return (
    <Box>
      {/* Header Stats */}
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <EmojiEventsIcon sx={{ fontSize: 48, color: '#ffd700' }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#00bcd4' }}>
                Your Achievements
              </Typography>
              <Typography variant="body1" sx={{ color: '#888' }}>
                Track your progress and unlock rewards
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#ffd700' }}>
              {earnedAchievements.size}/{ALL_ACHIEVEMENTS.length}
            </Typography>
            <Typography variant="body2" sx={{ color: '#888' }}>
              Unlocked
            </Typography>
          </Box>
        </Box>

        {/* Progress Bar */}
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#888' }}>
              Overall Progress
            </Typography>
            <Typography variant="body2" sx={{ color: '#00bcd4', fontWeight: 'bold' }}>
              {completionPercentage}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={completionPercentage}
            sx={{
              height: 12,
              borderRadius: 6,
              backgroundColor: '#333',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #00bcd4, #ffd700)',
                borderRadius: 6,
              }
            }}
          />
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography sx={{ color: '#888' }}>Loading achievements...</Typography>
        </Box>
      ) : (
        <>
          {/* Category Sections */}
          {categories.map(category => {
            const categoryAchievements = ALL_ACHIEVEMENTS.filter(a => a.category === category);
            const earnedInCategory = categoryAchievements.filter(a => earnedAchievements.has(a.id)).length;
            
            return (
              <Box key={category} sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: '#00bcd4',
                      textTransform: 'uppercase',
                      letterSpacing: 1
                    }}
                  >
                    {category}
                  </Typography>
                  <Chip
                    label={`${earnedInCategory}/${categoryAchievements.length}`}
                    sx={{
                      bgcolor: '#00bcd4',
                      color: '#000',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>

                <Grid container spacing={3}>
                  {categoryAchievements.map(achievement => {
                    const isUnlocked = earnedAchievements.has(achievement.id);
                    const earnedData = earnedDetails.find(e => 
                      (e.achievementId || e.id) === achievement.id
                    );
                    
                    return (
                      <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                        <Card
                          sx={{
                            bgcolor: isUnlocked ? '#1e1e1e' : '#0f0f0f',
                            border: isUnlocked 
                              ? `2px solid ${getRarityColor(achievement.rarity)}`
                              : '2px solid #333',
                            borderRadius: '12px',
                            height: '100%',
                            position: 'relative',
                            overflow: 'visible',
                            transition: 'all 0.3s ease',
                            opacity: isUnlocked ? 1 : 0.5,
                            '&:hover': {
                              transform: isUnlocked ? 'translateY(-8px)' : 'none',
                              boxShadow: isUnlocked 
                                ? `0 12px 24px ${getRarityColor(achievement.rarity)}40`
                                : 'none',
                            }
                          }}
                        >
                          {/* Rarity Badge */}
                          <Box
                            sx={{
                              position: 'absolute',
                              top: -12,
                              right: 16,
                              bgcolor: getRarityColor(achievement.rarity),
                              color: '#fff',
                              px: 2,
                              py: 0.5,
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: 'bold',
                              textTransform: 'uppercase',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                            }}
                          >
                            {achievement.rarity}
                          </Box>

                          <CardContent sx={{ pt: 3 }}>
                            {/* Icon and Status */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                              <Box
                                sx={{
                                  fontSize: '4rem',
                                  filter: isUnlocked ? 'none' : 'grayscale(100%)',
                                  opacity: isUnlocked ? 1 : 0.3,
                                  mr: 2,
                                  lineHeight: 1
                                }}
                              >
                                {achievement.icon}
                              </Box>
                              
                              <Box sx={{ flex: 1 }}>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 'bold',
                                    color: isUnlocked ? '#fff' : '#555',
                                    mb: 0.5
                                  }}
                                >
                                  {achievement.title}
                                </Typography>
                                
                                {isUnlocked ? (
                                  <Chip
                                    icon={<CheckCircleIcon />}
                                    label="Unlocked"
                                    size="small"
                                    sx={{
                                      bgcolor: getRarityColor(achievement.rarity),
                                      color: '#fff',
                                      fontWeight: 'bold'
                                    }}
                                  />
                                ) : (
                                  <Chip
                                    icon={<LockIcon />}
                                    label="Locked"
                                    size="small"
                                    sx={{
                                      bgcolor: '#333',
                                      color: '#888'
                                    }}
                                  />
                                )}
                              </Box>
                            </Box>

                            {/* Description */}
                            <Typography
                              sx={{
                                color: isUnlocked ? '#ccc' : '#555',
                                fontSize: '0.95rem',
                                minHeight: '40px'
                              }}
                            >
                              {achievement.description}
                            </Typography>

                            {/* Date Earned (if unlocked) */}
                            {isUnlocked && earnedData?.dateEarned && (
                              <Typography
                                sx={{
                                  mt: 2,
                                  fontSize: '0.75rem',
                                  color: '#888',
                                  fontStyle: 'italic'
                                }}
                              >
                                Unlocked: {new Date(earnedData.dateEarned).toLocaleDateString()}
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

          {/* Empty State */}
          {earnedAchievements.size === 0 && (
            <Box
              sx={{
                textAlign: 'center',
                py: 6,
                px: 3,
                bgcolor: '#1e1e1e',
                borderRadius: '12px',
                border: '2px dashed #333'
              }}
            >
              <EmojiEventsIcon sx={{ fontSize: 64, color: '#555', mb: 2 }} />
              <Typography variant="h5" sx={{ color: '#888', mb: 1 }}>
                No Achievements Yet
              </Typography>
              <Typography sx={{ color: '#666' }}>
                Complete lessons and challenges to start unlocking achievements!
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default AchievementTable;