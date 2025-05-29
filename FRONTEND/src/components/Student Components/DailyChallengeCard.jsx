import React, { useState, useEffect, useCallback } from "react";
import { Card, Typography, Button, Box, CircularProgress, styled, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import UserService from "../../services/UserService";
import compoundList from "./compound-elements.json";

// Import icons for better visual cues (make sure to install @mui/icons-material)
import { HourglassEmpty, CheckCircleOutline, PlayCircleOutline, PersonOff } from '@mui/icons-material'; // Added PersonOff icon

const CHALLENGE_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const BASE_LAST_CHALLENGE_KEY = "lastDailyChallengeAttempt"; // Base key

// --- Styled Components (No changes needed here for logic, but incorporating previous size reductions) ---

const GameCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, #1f1f1f 0%, #0d0d0d 100%)', // Dark gradient
  color: "#e0e0e0", // Light grey for general text
  width: "100%",
  minHeight: "150px", // Smaller minimum height
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  borderRadius: "16px", // Softer corners
  border: "2px solid #3a3a3a", // Subtle dark border
  boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.6), inset 0 0 15px rgba(255, 152, 0, 0.1)", // Deep shadow + subtle inner glow
  overflow: 'hidden', // Ensures inner elements respect border radius
  position: 'relative', // For potential absolute positioning of decorative elements
  transition: "all 0.3s ease-out",
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: "0px 12px 25px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(255, 152, 0, 0.2)",
  },
  fontFamily: "'Orbitron', sans-serif", // Futuristic font
}));

const CardHeader = styled(Box)(({ theme }) => ({
  background: '#333', // Slightly lighter band for header
  padding: theme.spacing(1.5), // Reduced padding
  borderBottom: '1px solid #444',
  position: 'relative',
  '&::after': { // Decorative line/glow
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80%',
    height: '2px',
    backgroundColor: '#ff9800',
    boxShadow: '0 0 8px #ff9800',
    borderRadius: '2px',
  }
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  textTransform: "uppercase",
  color: "#ff9800", // Bright orange for key elements
  textShadow: "0px 0px 8px rgba(255, 152, 0, 0.8)",
  letterSpacing: "2px", // Reduced letter spacing
  fontSize: "1.4rem", // Reduced font size
  textAlign: 'center',
}));

const CardBody = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2), // Reduced padding
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flexGrow: 1, // Allows body to expand
}));

const DescriptionText = styled(Typography)(({ theme }) => ({
  fontSize: "0.9rem", // Reduced font size
  color: "#b0b0b0", // Slightly muted for body text
  textAlign: 'center',
  marginBottom: theme.spacing(1.5), // Reduced margin
  fontFamily: "'Share Tech Mono', monospace", // Monospace for description
}));

const StatusIndicator = styled(Box)(({ theme, available }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1), // Reduced padding
  borderRadius: '8px',
  margin: theme.spacing(1.5, 0), // Reduced margin
  width: '100%',
  background: available ? 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)' : 'linear-gradient(45deg, #FF5722 30%, #FFAB91 90%)', // Green for available, orange for cooldown
  boxShadow: available ? '0 0 15px rgba(76, 175, 80, 0.7)' : '0 0 15px rgba(255, 87, 34, 0.7)',
  color: '#fff',
  fontWeight: 'bold',
  textShadow: '0 0 5px rgba(0,0,0,0.5)',
  fontFamily: "'Orbitron', sans-serif",
  fontSize: '1rem', // Reduced font size
  gap: theme.spacing(1),
}));

const CountdownText = styled(Typography)(({ theme }) => ({
  fontSize: "2.5rem", // Reduced font size
  fontWeight: "bold",
  color: "#ffdd55", // Gold color for countdown
  textShadow: "0 0 15px #ffdd55, 0 0 25px rgba(255, 221, 85, 0.5)", // Stronger glow
  fontFamily: "'Share Tech Mono', monospace",
  lineHeight: 1, // Compact line height
}));

const ActionButton = styled(Button)(({ theme, available }) => ({
  background: available ? 'linear-gradient(45deg, #ff9800 30%, #ffc107 90%)' : '#333', // Orange/gold when available, dark grey when not
  color: available ? '#121212' : '#888',
  fontWeight: "bold",
  fontSize: "1rem", // Reduced font size
  padding: theme.spacing(1, 3), // Reduced padding
  borderRadius: "8px",
  textTransform: "uppercase",
  boxShadow: available ? "0px 4px 15px rgba(255, 152, 0, 0.6)" : "none",
  transition: "all 0.3s ease-out",
  '&:hover': available
    ? {
        background: 'linear-gradient(45deg, #ffc107 30%, #ff9800 90%)',
        transform: "scale(1.05) translateY(-2px)",
        boxShadow: "0px 6px 20px rgba(255, 152, 0, 0.8)",
      }
    : {},
  '&:disabled': {
    background: '#222',
    color: '#555',
    boxShadow: 'none',
    cursor: 'not-allowed',
    transform: 'none',
  },
}));

// --- Main Component ---

const DailyChallengeCard = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(0);
  const [isChallengeAvailable, setIsChallengeAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null); // State to store the current user

  // Helper to get the user-specific localStorage key
  const getUserChallengeKey = useCallback((userId) => {
    return `${BASE_LAST_CHALLENGE_KEY}_${userId}`;
  }, []);

  // Memoized function to calculate time left, depends on userId
  const calculateTimeLeft = useCallback((userId) => {
    if (!userId) { // If no user is logged in, challenge is never available
      setTimeLeft(0);
      setIsChallengeAvailable(false);
      return 0;
    }
    const userSpecificKey = getUserChallengeKey(userId);
    const lastAttempt = localStorage.getItem(userSpecificKey);

    if (lastAttempt) {
      const lastAttemptTime = parseInt(lastAttempt, 10);
      const nextAvailableTime = lastAttemptTime + CHALLENGE_COOLDOWN_MS;
      const remaining = nextAvailableTime - Date.now();
      
      if (remaining > 0) {
        setTimeLeft(remaining);
        setIsChallengeAvailable(false);
        return remaining;
      }
    }
    setTimeLeft(0);
    setIsChallengeAvailable(true);
    return 0;
  }, [getUserChallengeKey]); // Recalculate if getUserChallengeKey changes (unlikely)

  // Effect to load user and set up timer
  useEffect(() => {
    let timer;
    const initCard = async () => {
      setIsLoading(true);
      const user = await UserService.getCurrentUser();
      setCurrentUser(user);

      if (user?.userId) {
        const initialTimeLeft = calculateTimeLeft(user.userId);
        if (initialTimeLeft > 0) {
          timer = setInterval(() => {
            const remaining = calculateTimeLeft(user.userId);
            if (remaining <= 0) {
              clearInterval(timer);
              setIsChallengeAvailable(true);
            }
          }, 1000);
        } else {
            setIsChallengeAvailable(true); // Available if no cooldown
        }
      } else {
        // No user logged in
        setIsChallengeAvailable(false);
        setTimeLeft(0);
      }
      setIsLoading(false);
    };

    initCard();

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [currentUser?.userId, calculateTimeLeft]); // Re-run effect if current user's ID changes or calculateTimeLeft memoization changes

  const formatTime = (ms) => {
    if (ms <= 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
      .map((unit) => String(unit).padStart(2, "0"))
      .join(":");
  };

  const handleStartChallenge = async () => {
    if (!currentUser || !currentUser.userId) {
      alert("Authentication required. Please log in to accept the quest.");
      return;
    }

    if (!isChallengeAvailable) {
      alert(`Access denied. Next quest available in ${formatTime(timeLeft)}.`);
      return;
    }

    const discoveredCompoundsSymbols = currentUser.discoveredCompounds?.map(sym => sym.toLowerCase()) || []; 

    const nextCompound = compoundList.find(
      (compound) => !discoveredCompoundsSymbols.includes(compound.Symbol.toLowerCase())
    );

    if (!nextCompound) {
      alert("All quests completed! You are a master alchemist!");
      return;
    }

    // Store the last attempt time specific to this user
    localStorage.setItem(getUserChallengeKey(currentUser.userId), Date.now().toString());
    localStorage.setItem("dailyChallengeCompound", JSON.stringify(nextCompound));

    calculateTimeLeft(currentUser.userId); // Update cooldown immediately for the current user

    navigate("/student/daily-challenge");
  };

  if (isLoading) {
    return (
      <GameCard
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress sx={{ color: "#ff9800" }} size={50} />
        <Typography sx={{ mt: 2, color: "#b0b0b0", fontFamily: "'Share Tech Mono', monospace" }}>
          Loading Quest Data...
        </Typography>
      </GameCard>
    );
  }

  // Determine button and status based on user login and challenge availability
  const canStartChallenge = isChallengeAvailable && currentUser?.userId;
  const buttonText = currentUser?.userId 
    ? (isChallengeAvailable ? "Accept Quest" : "Await Transmission")
    : "Login to Access";
  const buttonIcon = canStartChallenge ? <PlayCircleOutline /> : (currentUser?.userId ? null : <PersonOff />);

  return (
    <GameCard>
      <CardHeader>
        <CardTitle>Daily Quest Log</CardTitle>
      </CardHeader>

      <CardBody>
        <DescriptionText>
          Your mission: discover a new compound and expand your knowledge of the elemental world.
        </DescriptionText>

        {!currentUser?.userId ? (
            <StatusIndicator available={false}>
                <PersonOff sx={{ fontSize: 25 }} />
                <Typography variant="h6">LOGIN REQUIRED</Typography>
            </StatusIndicator>
        ) : (isChallengeAvailable ? (
          <StatusIndicator available={true}>
            <CheckCircleOutline sx={{ fontSize: 25 }} />
            <Typography variant="h6">QUEST READY</Typography>
          </StatusIndicator>
        ) : (
          <>
            <StatusIndicator available={false}>
                <HourglassEmpty sx={{ fontSize: 25 }} />
                <Typography variant="h6">COOLDOWN ACTIVE</Typography>
            </StatusIndicator>
            <CountdownText variant="h4">
                {formatTime(timeLeft)}
            </CountdownText>
          </>
        ))}
      </CardBody>

      <Box sx={{ p: 2, pt: 0, textAlign: 'center' }}>
        <ActionButton
          available={canStartChallenge}
          onClick={handleStartChallenge}
          disabled={!canStartChallenge}
          startIcon={buttonIcon}
        >
          {buttonText}
        </ActionButton>
      </Box>
    </GameCard>
  );
};

export default DailyChallengeCard;