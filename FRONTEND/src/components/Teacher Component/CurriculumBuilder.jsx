import React, { useState } from "react";
import {
  Box, TextField, Button, Card, CardContent,
  Typography, List, ListItem, Divider
} from "@mui/material";

export default function CurriculumBuilder() {
  const [title, setTitle] = useState("");
  const [topicInput, setTopicInput] = useState("");
  const [subtopicInput, setSubtopicInput] = useState("");
  const [contentInput, setContentInput] = useState("");
  const [curriculum, setCurriculum] = useState([]);

  const [selectedTopicIndex, setSelectedTopicIndex] = useState(null);

  const addTopic = () => {
    if (!topicInput.trim()) return;
    setCurriculum(prev => [...prev, { topic: topicInput, subtopics: [] }]);
    setTopicInput("");
  };

  const addSubtopic = () => {
    if (selectedTopicIndex === null || !subtopicInput.trim()) return;

    const updated = [...curriculum];
    updated[selectedTopicIndex].subtopics.push({
      name: subtopicInput,
      content: contentInput,
    });

    setCurriculum(updated);
    setSubtopicInput("");
    setContentInput("");
  };

  return (
    <Box sx={{
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      bgcolor: "#0d1117",
      color: "white",
      minHeight: "100vh",
      width: "100%",
      p: 4,
      gap: 4
    }}>
      
      {/* Left Panel - Inputs */}
      <Box sx={{ flex: 1, minWidth: "320px" }}>
        <Typography variant="h4" mb={3} color="#ff9800" fontWeight="bold">
          🧪 Curriculum Builder
        </Typography>

        <Card sx={{ mb: 3, p: 3, bgcolor: "#1e1e2e", borderRadius: 3,color: "white", boxShadow: 3 }}>
          <Typography variant="h6" mb={2}>📝 Curriculum Info</Typography>
          <TextField
            label="Curriculum Title"
            variant="filled"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2, input: { color: "white" }, label: { color: "gray" } }}
          />

          <Divider sx={{ my: 2, borderColor: "#ff9800" }} />

          <Typography variant="h6" mt={2}>➕ Add Topic</Typography>
          <TextField
            label="Topic Title"
            variant="filled"
            fullWidth
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            sx={{ my: 1, input: { color: "white" }, label: { color: "gray" } }}
          />
          <Button variant="contained" onClick={addTopic} sx={{ bgcolor: "#ff9800", fontWeight: "bold" }}>
            Add Topic
          </Button>
        </Card>

        {curriculum.length > 0 && (
          <Card sx={{ p: 3, bgcolor: "#1e1e2e", borderRadius: 3,color: "white", boxShadow: 3 }}>
            <Typography variant="h6" mb={1}>📚 Select Topic to Add Subtopics</Typography>
            <List sx={{ mb: 2 }}>
              {curriculum.map((t, i) => (
                <ListItem
                  button
                  key={i}
                  selected={i === selectedTopicIndex}
                  onClick={() => setSelectedTopicIndex(i)}
                  sx={{
                    color: "white",
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: i === selectedTopicIndex ? "#ff980040" : "transparent",
                    ":hover": { backgroundColor: "#333" }
                  }}
                >
                  {t.topic}
                </ListItem>
              ))}
            </List>

            {selectedTopicIndex !== null && (
              <>
                <Typography variant="subtitle1" mt={2}>
                  Add Subtopic to: <strong>{curriculum[selectedTopicIndex].topic}</strong>
                </Typography>
                <TextField
                  label="Subtopic Title"
                  variant="filled"
                  fullWidth
                  value={subtopicInput}
                  onChange={(e) => setSubtopicInput(e.target.value)}
                  sx={{ mt: 1, mb: 1, input: { color: "white" }, label: { color: "gray" } }}
                />
                <TextField
                  label="Subtopic Content"
                  variant="filled"
                  fullWidth
                  multiline
                  rows={3}
                  value={contentInput}
                  onChange={(e) => setContentInput(e.target.value)}
                  sx={{ mb: 2, input: { color: "white" }, label: { color: "gray" } }}
                />
                <Button variant="outlined" onClick={addSubtopic} sx={{ color: "#ff9800", borderColor: "#ff9800" }}>
                  Add Subtopic
                </Button>
              </>
            )}
          </Card>
        )}
      </Box>

      {/* Right Panel - Preview */}
      <Box sx={{
        flex: 1,
        overflowY: "auto",
        maxHeight: "calc(100vh - 64px)",
        minWidth: "720px"
      }}>
        <Card sx={{
          bgcolor: "#1e1e2e",
          p: 3,
          borderRadius: 3,
          boxShadow: 3,
          color: "white",
          height: "100%"
        }}>
          <Typography variant="h6" mb={1}>📘 Curriculum Preview</Typography>
          <Typography variant="h5" color="#ff9800" fontWeight="bold" mb={3}>
            {title || "Untitled Curriculum"}
          </Typography>

          {curriculum.map((topic, i) => (
            <Box key={i} sx={{ mb: 3 }}>
              <Typography variant="h6" color="#fff" mb={1}>
                {i + 1}. {topic.topic}
              </Typography>
              <List>
                {topic.subtopics.map((sub, j) => (
                  <ListItem key={j} sx={{ color: "#b0bec5", flexDirection: "column", alignItems: "flex-start", mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">{sub.name}</Typography>
                    <Typography variant="body2" sx={{ color: "#9e9e9e" }}>{sub.content}</Typography>
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ borderColor: "#444" }} />
            </Box>
          ))}
        </Card>
      </Box>
    </Box>
  );
}
