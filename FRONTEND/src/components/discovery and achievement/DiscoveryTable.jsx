import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import { Lock } from "@mui/icons-material";
import compounds from "../Student Components/compound-elements.json";
import DiscoveryService from "../../services/DiscoveryService";
import UserService from "../../services/UserService";

const Discovery = () => {
  const [discovered, setDiscovered] = useState([]);

  useEffect(() => {
    const fetchUserDiscoveries = async () => {
      const currentUser = await UserService.getCurrentUser();

      if (currentUser?.userId) {
        try {
          const response = await DiscoveryService.getCurrentUserDiscoveries(currentUser.userId);

          console.log("Raw discoveries from DB:", response);

          const discoveryArray = response?.data || []; // 👈 Ensure it's an array

          const validNames = discoveryArray
            .filter(item => item.name && typeof item.name === "string")
            .map(item => item.name.trim());

          console.log("Filtered discovered names:", validNames);

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

  return (
    <Grid container spacing={2} sx={{ padding: 2, marginTop: "15px" }}>
      {compounds.map((compound, index) => {
        const compoundName = compound.NAME.trim();
        const isUnlocked = discovered.includes(compoundName);

        return (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
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
  );
};

export default Discovery;
