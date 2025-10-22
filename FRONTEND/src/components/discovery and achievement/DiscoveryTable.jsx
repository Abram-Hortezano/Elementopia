import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  styled,
  Box, // Import Box for the details panel
} from "@mui/material";
import { Lock } from "@mui/icons-material";
import compounds from "../Student Components/compound-elements.json";
import DiscoveryService from "../../services/DiscoveryService";
import UserService from "../../services/UserService";

// Styled components for the gaming theme
const DiscoveryPageContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(3), // Space between the grid and the details panel
  padding: theme.spacing(2),
  marginTop: "15px",
  backgroundColor: "#121212", // Dark background for the whole page
  minHeight: "80vh", // Ensure it fills the viewport height
}));

const DiscoveryGrid = styled(Grid)(({ theme }) => ({
  flexGrow: 1, // Allows the grid to take available space
}));

const CompoundCard = styled(Card)(({ theme, isUnlocked }) => ({
  backgroundColor: isUnlocked ? "#332500" : "#222", // Darker base colors
  color: "white",
  textAlign: "center",
  padding: theme.spacing(2),
  borderRadius: "8px",
  boxShadow: isUnlocked ? "0 0 15px #ff9800" : "0 0 5px #333", // Subtle glow
  cursor: isUnlocked ? "pointer" : "default",
  transition: "transform 0.2s, box-shadow 0.3s",
  border: isUnlocked ? "1px solid #cc7a00" : "1px solid #444",
  "&:hover": isUnlocked
    ? {
        transform: "scale(1.03)",
        boxShadow: "0 0 25px #ffb347", // Stronger glow on hover
      }
    : {},
}));

const UnlockedTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  textShadow: "0px 0px 8px #ff9800", // Glowing text
  fontFamily: "'Orbitron', 'Share Tech Mono', monospace", // Futuristic font
}));

const LockedIcon = styled(Lock)(({ theme }) => ({
  fontSize: 40,
  color: "#555",
}));

const DetailsPanel = styled(Card)(({ theme }) => ({
  width: 350, // Fixed width for the details panel
  minWidth: 300,
  backgroundColor: "#1a1a1a", // Dark modal background
  color: "white",
  borderRadius: "10px",
  border: "1px solid #ff9800",
  padding: theme.spacing(3),
  boxShadow: "0 0 20px rgba(255, 152, 0, 0.5)", // Glowing shadow for the panel
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const PanelTitle = styled(Typography)(({ theme }) => ({
  color: "#ff9800",
  fontFamily: "'Orbitron', 'Share Tech Mono', monospace",
  fontWeight: "bold",
  fontSize: "1.5rem",
  textShadow: "0px 0px 5px rgba(255, 152, 0, 0.8)",
  marginBottom: theme.spacing(2),
}));

const PanelContent = styled(Typography)(({ theme }) => ({
  fontFamily: "'Share Tech Mono', monospace",
  lineHeight: 1.8,
  color: "#eee",
  marginBottom: theme.spacing(1),
}));

const Discovery = () => {
  const [discovered, setDiscovered] = useState([]);
  const [selectedCompound, setSelectedCompound] = useState(null);

  useEffect(() => {
    const fetchUserDiscoveries = async () => {
      const currentUser = await UserService.getCurrentUser();

      if (currentUser?.userId) {
        try {
          const response = await DiscoveryService.getCurrentUserDiscoveries(
            currentUser.userId
          );
          const discoveryArray = response?.data || [];

          const validNames = discoveryArray
            .filter((item) => item.name && typeof item.name === "string")
            .map((item) => item.name.trim());

          setDiscovered(validNames);
        } catch (error) {
          console.error("Error fetching discoveries:", error);
        }
      } else {
        console.error("No valid user ID found.");
      }
    };

    fetchUserDiscoveries();
  }, []);

  const handleCardClick = (compound, isUnlocked) => {
    if (isUnlocked) {
      setSelectedCompound(compound);
    } else {
      setSelectedCompound(null); // Clear selection if locked card is clicked
    }
  };

  return (
    <DiscoveryPageContainer>
      <DiscoveryGrid container spacing={3}>
        {compounds.map((compound, index) => {
          const compoundName = compound.NAME.trim();
          const isUnlocked = discovered.includes(compoundName);

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <CompoundCard
                onClick={() => handleCardClick(compound, isUnlocked)}
                isUnlocked={isUnlocked}
              >
                <CardContent>
                  {isUnlocked ? (
                    <UnlockedTitle variant="h6">{compoundName}</UnlockedTitle>
                  ) : (
                    <LockedIcon />
                  )}
                </CardContent>
              </CompoundCard>
            </Grid>
          );
        })}
      </DiscoveryGrid>

      {/* Right-hand side details panel */}
      {selectedCompound && (
        <DetailsPanel>
          <PanelTitle variant="h5">{selectedCompound.NAME}</PanelTitle>
          <PanelContent>
            **Description:**{" "}
            {selectedCompound.Description || "No description available."}
          </PanelContent>
          <PanelContent>
            **Elements:** {selectedCompound.Elements?.join(", ") || "N/A"}
          </PanelContent>
          <PanelContent>
            **Uses:** {selectedCompound.Uses?.join(", ") || "N/A"}
          </PanelContent>
        </DetailsPanel>
      )}
    </DiscoveryPageContainer>
  );
 };
 
 export default Discovery;