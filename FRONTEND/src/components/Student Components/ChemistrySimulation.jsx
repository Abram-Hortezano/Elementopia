import React, { useState, useEffect } from "react";
import { Stage, Layer, Circle, Text, Line } from "react-konva";
import {
  Box,
  Typography,
  Button,
  ToggleButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ElementTable from "./ElementTable";
import compoundElements from "../Student Components/compound-elements.json";
import DiscoveryService from "../../services/DiscoveryService";
import UserService from "../../services/UserService";

const initialAtoms = [];

const getElementColor = (element) => {
  const colors = {
    H: "#f44336",
    O: "#2196f3",
    C: "#4caf50",
    N: "#9c27b0",
    Na: "#ff9800",
    Cl: "#00bcd4",
    K: "#e91e63",
    Ca: "#8bc34a",
    Mg: "#3f51b5",
    Fe: "#795548",
  };
  return colors[element] || "#ccc";
};

const ChemistrySimulation = () => {
  const [atoms, setAtoms] = useState(initialAtoms);
  const [selectedElement, setSelectedElement] = useState("H");
  const [moleculeOutput, setMoleculeOutput] = useState("");
  const [eraseMode, setEraseMode] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [dailyChallengeCompound, setDailyChallengeCompound] = useState(null);
  const [completedSymbols, setCompletedSymbols] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const challengeFromStorage = JSON.parse(localStorage.getItem("dailyChallengeCompound"));
  
    if (challengeFromStorage) {
      setDailyChallengeCompound(challengeFromStorage);
    } else {
      setDailyChallengeCompound(compoundElements[0]);
    }
  
    const stored = JSON.parse(localStorage.getItem("completedSymbols")) || [];
    setCompletedSymbols(stored);
  }, []);
  

  useEffect(() => {
    checkMolecule();
  }, [atoms]);

  const checkMolecule = () => {
    const currentElements = atoms.map((atom) => atom.element);
    const foundCompound = compoundElements.find((compound) => {
      const compoundElementsSorted = [...compound.Elements].sort();
      const currentElementsSorted = [...currentElements].sort();
      return JSON.stringify(compoundElementsSorted) === JSON.stringify(currentElementsSorted);
    });

    if (foundCompound) {
      setMoleculeOutput(
        `NAME: ${foundCompound.NAME}\n` +
        `Symbol: ${foundCompound.Symbol}\n` +
        `Description: ${foundCompound.Description}\n` +
        `Elements: ${foundCompound.Elements.join(", ")}\n` +
        `Uses: ${foundCompound.Uses.join(", ")}`
      );

      saveDiscovery(foundCompound);

      if (
        dailyChallengeCompound &&
        foundCompound.Symbol === dailyChallengeCompound.Symbol &&
        !completedSymbols.includes(foundCompound.Symbol)
      ) {
        const updated = [...completedSymbols, foundCompound.Symbol];
        setCompletedSymbols(updated);
        localStorage.setItem("completedSymbols", JSON.stringify(updated));
        localStorage.removeItem("dailyChallengeCompound");
        setShowChallengeModal(true);
      }
      
    } else {
      setMoleculeOutput("No known molecule formed.");
    }
  };

  const saveDiscovery = async (compound) => {
    const user = await UserService.getCurrentUser();
    if (!user || !user.userId) {
      alert("User is not logged in. Please log in first.");
      return;
    }
  
    const userId = user.userId;
  
    // Get the current date and format it as YYYY-MM-DD
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0]; // Get only the date part (YYYY-MM-DD)
  
    const discoveryData = {
      name: compound.NAME,
      dateDiscovered: formattedDate,
    };
   
  
    try {
      const discoveryResponse = await DiscoveryService.createDiscovery(userId, discoveryData);
      if (discoveryResponse) {
        console.log(discoveryData); // Log the discovery data to the console
      }
    } catch (error) {
      console.error("Error saving discovery:", error);
      alert("An error occurred while saving your discovery.");
    }
  };
  
  

  const handleStageClick = (e) => {
    if (!eraseMode) {
      const stage = e.target.getStage();
      const pointer = stage.getPointerPosition();
      if (!pointer) return;
      const { x, y } = pointer;

      setAtoms((prevAtoms) => [
        ...prevAtoms,
        {
          id: prevAtoms.length + 1,
          x,
          y,
          element: selectedElement,
        },
      ]);
    }
  };

  const handleDragMove = (e) => {
    const id = parseInt(e.target.id());
    const { x, y } = e.target.position();
    setAtoms((prevAtoms) =>
      prevAtoms.map((atom) => (atom.id === id ? { ...atom, x, y } : atom))
    );
  };

  const handleAtomClick = (id) => {
    if (eraseMode) {
      setAtoms(atoms.filter((atom) => atom.id !== id));
    }
  };

  const getBonds = () => {
    let bonds = [];
    for (let i = 0; i < atoms.length; i++) {
      for (let j = i + 1; j < atoms.length; j++) {
        const dx = atoms[i].x - atoms[j].x;
        const dy = atoms[i].y - atoms[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
          bonds.push({ start: atoms[i], end: atoms[j] });
        }
      }
    }
    return bonds;
  };

  const handleClear = () => {
    setAtoms([]);
    setMoleculeOutput("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        backgroundColor: "#0a0a0f",
        height: "100%",
        width: "100%",
        padding: 2,
        marginTop: "30px",
        flexWrap: "wrap",
      }}
    >
      {/* Simulation Section */}
      <Box sx={{ flex: 1, marginRight: "20px" }}>
        <Typography
          variant="h4"
          sx={{
            color: "#ffcc00",
            fontWeight: "bold",
            textAlign: "center",
            textShadow: "2px 2px 8px #ffcc00",
            marginBottom: "20px",
          }}
        >
          Chemistry Simulation
        </Typography>

        <Stage
          width={900}
          height={300}
          onClick={handleStageClick}
          style={{ border: "2px solid #ffcc00", borderRadius: "10px" }}
        >
          <Layer>
            {getBonds().map((bond, index) => (
              <Line
                key={index}
                points={[bond.start.x, bond.start.y, bond.end.x, bond.end.y]}
                stroke="#ffcc00"
                strokeWidth={4}
              />
            ))}
            {atoms.map((atom) => (
              <React.Fragment key={atom.id}>
                <Circle
                  id={String(atom.id)}
                  x={atom.x}
                  y={atom.y}
                  radius={24}
                  fill={getElementColor(atom.element)}
                  draggable
                  onDragMove={handleDragMove}
                  onClick={() => handleAtomClick(atom.id)}
                  stroke="#ffffff"
                  strokeWidth={3}
                  shadowBlur={10}
                  shadowColor="#ffcc00"
                />
                <Text
                  x={atom.x - 6}
                  y={atom.y - 6}
                  text={atom.element}
                  fontSize={18}
                  fill="black"
                  fontStyle="bold"
                />
              </React.Fragment>
            ))}
          </Layer>
        </Stage>

        <ElementTable
          selectedElement={selectedElement}
          setSelectedElement={setSelectedElement}
        />

        <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
          <ToggleButton
            value="eraseMode"
            selected={eraseMode}
            onChange={() => setEraseMode(!eraseMode)}
            sx={{
              backgroundColor: eraseMode ? "red" : "#444",
              color: "white !important",
              "&.Mui-selected": {
                backgroundColor: "red",
              },
              "&:hover": {
                backgroundColor: eraseMode ? "#ff3333" : "#666",
              },
            }}
          >
            Erase
          </ToggleButton>
          <Button
            variant="contained"
            color="error"
            onClick={handleClear}
            sx={{
              backgroundColor: "#ff3333",
              "&:hover": {
                backgroundColor: "#cc2929",
              },
            }}
          >
            Clear
          </Button>
        </Box>
      </Box>

      {/* Right Side - Output */}
      <Box sx={{ width: "350px", mt: 2 }}>
        <Box
          sx={{
            mt: 2,
            p: 2,
            backgroundColor: "#1a1a1d",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px rgba(255, 204, 0, 0.6)",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: moleculeOutput.startsWith("NAME") ? "#ffcc00" : "red",
              whiteSpace: "pre-line",
              fontFamily: "monospace",
              fontSize: "14px",
            }}
          >
            {moleculeOutput}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ChemistrySimulation;
