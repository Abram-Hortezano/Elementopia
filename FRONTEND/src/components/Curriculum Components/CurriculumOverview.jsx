import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  Collapse,
  IconButton,
  LinearProgress,
} from "@mui/material";
import { ExpandLess, ExpandMore, Star } from "@mui/icons-material";
import StudentElementMatcher from "../games/StudentElementMatcher";
import StudentElementMatcher2 from "../games/StudentElementMatcher2";

const curriculum = [
  {
    topic: "Electronic Structure of Matter",
    subtopics: ["Ionic and Covalent Bonding", "Metallic Bonding"],
    content: [
      "Ionic Bonding: Ionic bonding occurs when electrons are transferred between atoms, resulting in positively and negatively charged ions. Example: NaCl.",
      "Metallic Bonding: Metallic bonding involves a sea of electrons shared among a lattice of metal atoms. Example: Copper.",
    ],
  },
  {
    topic: "The Variety of Carbon Compounds",
    subtopics: ["Carbon Atoms", "Organic Compounds"],
    content: [
      "Carbon atoms form four covalent bonds and can create chains/rings.",
      "Organic compounds contain carbon. Examples: alcohols, alkanes.",
    ],
  },
  {
    topic: "MOLE CONCEPT",
    subtopics: ["Mass", "Moles", "Percentage Composition of a Compound"],
    content: [
      "Mass is the amount of matter. Unit: grams.",
      "A mole is 6.022×10²³ particles. It’s a basic counting unit in chemistry.",
      "Percentage composition = mass % of each element in a compound.",
    ],
  },
];

// ... imports remain the same ...

export default function CurriculumOverview() {
  const [openTopic, setOpenTopic] = useState(null);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(null);
  const [currentSubtopicIndex, setCurrentSubtopicIndex] = useState(null);
  const [showGame, setShowGame] = useState(false);
  const [showSubtopicPage, setShowSubtopicPage] = useState(false);

  const STORAGE_KEY = "chemistry_progress";

  const activeSubtopic =
    currentTopicIndex !== null && currentSubtopicIndex !== null
      ? curriculum[currentTopicIndex].subtopics[currentSubtopicIndex]
      : null;

  const activeContent =
    currentTopicIndex !== null && currentSubtopicIndex !== null
      ? curriculum[currentTopicIndex].content[currentSubtopicIndex]
      : null;

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { topicIndex, subtopicIndex } = JSON.parse(saved);
      setCurrentTopicIndex(topicIndex);
      setCurrentSubtopicIndex(subtopicIndex);
    }
  }, []);

  useEffect(() => {
    if (currentTopicIndex !== null && currentSubtopicIndex !== null) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          topicIndex: currentTopicIndex,
          subtopicIndex: currentSubtopicIndex,
        })
      );
    }
  }, [currentTopicIndex, currentSubtopicIndex]);

  const totalSubtopics = curriculum.reduce(
    (total, topic) => total + topic.subtopics.length,
    0
  );

  const completedSubtopics =
    currentTopicIndex !== null && currentSubtopicIndex !== null
      ? curriculum
          .slice(0, currentTopicIndex)
          .reduce((total, topic) => total + topic.subtopics.length, 0) +
        currentSubtopicIndex +
        1
      : 0;

  const progressPercentage = (completedSubtopics / totalSubtopics) * 100;

  const handleStartLearning = () => {
    if (currentTopicIndex === null || currentSubtopicIndex === null) {
      setCurrentTopicIndex(0);
      setCurrentSubtopicIndex(0);
    }
    setShowSubtopicPage(true);
  };

  const handleNext = () => {
    const topic = curriculum[currentTopicIndex];

    if (
      (topic.topic === "Electronic Structure of Matter" &&
        currentSubtopicIndex === topic.subtopics.length - 1) ||
      (topic.topic === "The Variety of Carbon Compounds" &&
        currentSubtopicIndex === topic.subtopics.length - 1)
    ) {
      setShowGame(true);
      setShowSubtopicPage(false);
      return;
    }

    if (currentSubtopicIndex + 1 < topic.subtopics.length) {
      setCurrentSubtopicIndex(currentSubtopicIndex + 1);
    } else if (currentTopicIndex + 1 < curriculum.length) {
      setCurrentTopicIndex(currentTopicIndex + 1);
      setCurrentSubtopicIndex(0);
    } else {
      alert("🎉 You've completed all topics!");
      localStorage.removeItem(STORAGE_KEY);
      setCurrentTopicIndex(null);
      setCurrentSubtopicIndex(null);
      setShowSubtopicPage(false);
      return;
    }

    setShowGame(false);
    setShowSubtopicPage(true);
  };

  // -------------------------
  // FULLSCREEN SUBTOPIC VIEW
  // -------------------------
  if (showSubtopicPage && activeSubtopic) {
    return (
      <Box
        sx={{
          bgcolor: "#0d1117",
          color: "white",
          height: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 4,
        }}
      >
        <Card sx={{ bgcolor: "#1e1e2e", padding: 4, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight="bold" sx={{color: "white"}}>
            {activeSubtopic}
          </Typography>
          <Typography mt={3}sx={{color: "white"}}>{activeContent}</Typography>
          <Button
            variant="contained"
            sx={{
              mt: 4,
              bgcolor: "#ff9800",
              color: "black",
              fontWeight: "bold",
              borderRadius: 2,
              "&:hover": { bgcolor: "#ffb74d" },
            }}
            onClick={handleNext}
          >
            Next
          </Button>
        </Card>
      </Box>
    );
  }

  // ----------------------
  // GAME SCREEN
  // ----------------------
  if (showGame && currentTopicIndex !== null) {
    const topic = curriculum[currentTopicIndex];
    const GameComponent =
      topic.topic === "Electronic Structure of Matter"
        ? StudentElementMatcher
        : StudentElementMatcher2;

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          bgcolor: "#0d1117",
          color: "white",
          minHeight: "100vh",
          width: "100%",
          padding: 4,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <GameComponent />
        <Button
          variant="contained"
          sx={{
            mt: 4,
            ml: 2,
            bgcolor: "#ff9800",
            color: "black",
            fontWeight: "bold",
            borderRadius: 2,
            "&:hover": { bgcolor: "#ffb74d" },
          }}
          onClick={() => {
            setShowGame(false);
            setCurrentTopicIndex(currentTopicIndex + 1);
            setCurrentSubtopicIndex(0);
          }}
        >
          Continue
        </Button>
      </Box>
    );
  }

  // ---------------------
  // MAIN CURRICULUM PAGE
  // ---------------------
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: "#0d1117",
        color: "white",
        minHeight: "100vh",
        width: "100%",
        padding: 4,
      }}
    >
      {/* Progress bar at the top */}
      <Card
  sx={{
    bgcolor: "#1e1e2e",
    borderRadius: 3,
    padding: 2,
    marginBottom: 3,
    boxShadow: "0px 4px 10px rgba(255, 152, 0, 0.3)",
  }}
>
  <CardContent>
    <Typography variant="h6" fontWeight="bold">
      Progress
    </Typography>
    <Typography variant="body2" mt={1} color="gray">
      You’ve completed {completedSubtopics} of {totalSubtopics} subtopics
    </Typography>
    <Box
      sx={{
        mt: 2,
        height: 15,
        width: "100%",
        bgcolor: "#2e2e3e",
        borderRadius: 5,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          height: "100%",
          width: `${progressPercentage}%`,
          bgcolor: "linear-gradient(to right, #ff9800, #ffc107)",
          background: `linear-gradient(to right, #ff9800, #ffc107)`,
          transition: "width 0.3s ease-in-out",
        }}
      />
    </Box>
  </CardContent>
</Card>


      <Box sx={{ display: "flex", flex: 1 }}>
        <Box sx={{ flex: 2, paddingRight: 4 }}>
          <Card
            sx={{
              bgcolor: "#1e1e2e",
              color: "white",
              borderRadius: 3,
              padding: 3,
              boxShadow: "0px 4px 10px rgba(255, 152, 0, 0.4)",
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              CHEMISTRY
            </Typography>
            <Typography variant="body2" mt={1}>
              Explore atoms, bonding, and carbon compounds through interactive
              learning.
            </Typography>
            <Button
              variant="contained"
              sx={{
                mt: 2,
                bgcolor: "#ff9800",
                color: "black",
                fontWeight: "bold",
                borderRadius: 2,
                "&:hover": { bgcolor: "#ffb74d" },
              }}
              onClick={handleStartLearning}
            >
              {currentTopicIndex !== null ? "Resume Learning" : "Start Learning"}
            </Button>
          </Card>

          <Box mt={4}>
          {curriculum.map((item, index) => {
  const isActiveTopic = index === currentTopicIndex;
  return (
    <Card
      key={index}
      sx={{
        mb: 2,
        bgcolor: isActiveTopic ? "#ff9800" : "#1e1e2e",
        borderRadius: 2,
        transform: isActiveTopic ? "scale(1.02)" : "none",
        transition: "all 0.3s ease",
        boxShadow: isActiveTopic
          ? "0px 0px 15px rgba(255, 152, 0, 0.7)"
          : "none",
        color: isActiveTopic ? "#0d1117" : "white",
      }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          onClick={() => setOpenTopic(openTopic === index ? null : index)}
          sx={{ cursor: "pointer" }}
        >
          <Typography
            variant="h6"
            fontWeight={isActiveTopic ? "bold" : "normal"}
          >
            {item.topic}
          </Typography>
          <IconButton>
            {openTopic === index ? (
              <ExpandLess sx={{ color: isActiveTopic ? "#0d1117" : "white" }} />
            ) : (
              <ExpandMore sx={{ color: isActiveTopic ? "#0d1117" : "white" }} />
            )}
          </IconButton>
        </Box>
        <Collapse in={openTopic === index}>
          <List sx={{ pl: 2 }}>
            {item.subtopics.map((sub, subIdx) => {
              const isCurrent =
                index === currentTopicIndex &&
                subIdx === currentSubtopicIndex;
              return (
                <ListItem
                  key={subIdx}
                  sx={{
                    bgcolor: isCurrent ? "#ffe082" : "#2e2e3e",
                    borderRadius: 2,
                    my: 1,
                    px: 1,
                    py: 1,
                    color: isCurrent ? "#0d1117" : "#b0bec5",
                    fontWeight: isCurrent ? "bold" : "normal",
                    "&:hover": {
                      bgcolor: "#ff9800",
                      color: "#0d1117",
                    },
                  }}
                >
                  <Star
                    sx={{
                      color: isCurrent ? "#0d1117" : "#ff9800",
                      mr: 1,
                    }}
                  />
                  {sub}
                </ListItem>
              );
            })}
          </List>
        </Collapse>
      </CardContent>
    </Card>
  );
})}

          </Box>
        </Box>
      </Box>
    </Box>
  );
}