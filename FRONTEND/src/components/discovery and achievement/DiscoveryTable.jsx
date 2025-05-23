import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import { Lock, Close } from "@mui/icons-material";
import compounds from "../Student Components/compound-elements.json";
import DiscoveryService from "../../services/DiscoveryService";
import UserService from "../../services/UserService";

const Discovery = () => {
  const [discovered, setDiscovered] = useState([]);
  const [selectedCompound, setSelectedCompound] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserDiscoveries = async () => {
      const currentUser = await UserService.getCurrentUser();

      if (currentUser?.userId) {
        try {
          const response = await DiscoveryService.getCurrentUserDiscoveries(currentUser.userId);
          const discoveryArray = response?.data || [];

          const validNames = discoveryArray
            .filter(item => item.name && typeof item.name === "string")
            .map(item => item.name.trim());

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
      setModalOpen(true);
    }
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedCompound(null);
  };

  return (
    <>
      <Grid container spacing={2} sx={{ padding: 2, marginTop: "15px" }}>
        {compounds.map((compound, index) => {
          const compoundName = compound.NAME.trim();
          const isUnlocked = discovered.includes(compoundName);

          return (
            <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
              <Card
                onClick={() => handleCardClick(compound, isUnlocked)}
                sx={{
                  bgcolor: isUnlocked ? "#ff9800" : "#222",
                  color: "white",
                  textAlign: "center",
                  padding: 2,
                  borderRadius: "12px",
                  boxShadow: "0px 0px 10px rgba(255, 152, 0, 0.5)",
                  cursor: isUnlocked ? "pointer" : "default",
                  transition: "transform 0.2s, box-shadow 0.3s",
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
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        textShadow: "0px 0px 5px rgba(255, 152, 0, 0.8)",
                      }}
                    >
                      {compoundName}
                    </Typography>
                  ) : (
                    <Lock sx={{ fontSize: 40, color: "gray" }} />
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Modal Dialog */}
      <Dialog open={modalOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            bgcolor: "#ff9800",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {selectedCompound?.NAME}
          <IconButton onClick={handleClose} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ padding: 3 }}>
          <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
            {selectedCompound?.Description || "No description available."}
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Discovery;
