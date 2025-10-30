import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from "@mui/material";
import LessonTable from "./LessonTable";
import CreateLesson from "./CreateLesson";

export default function CurriculumBuilder() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const handleOpen = () => setOpenCreateDialog(true);
  const handleClose = () => setOpenCreateDialog(false);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: "#0d1117",
        color: "#f0f6fc",
        minHeight: "100vh",
        width: "100%",
        p: 4,
        gap: 4,
        fontFamily: "'Orbitron', sans-serif",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: 700, textShadow: "0 0 10px #00e5ff" }}>
          🎮 Curriculum Builder
        </Typography>

        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            bgcolor: "#00e5ff",
            color: "#000",
            fontWeight: 700,
            borderRadius: "8px",
            boxShadow: "0 0 10px #00e5ff",
            '&:hover': {
              bgcolor: "#00bcd4",
              boxShadow: "0 0 15px #00e5ff",
            },
          }}
        >
          ➕ Add Lesson
        </Button>
      </Box>

<Dialog
  open={openCreateDialog}
  onClose={handleClose}
  fullWidth
  maxWidth="lg"
  slotProps={{
    paper: {
      sx: {
        bgcolor: "#161b22",
        color: "#f0f6fc",
        border: "2px solid #00e5ff",
        borderRadius: 2,
        height: "auto",
        padding: "5px"
      },
    },
  }}
>
  <DialogTitle sx={{ fontWeight: 700, textShadow: "0 0 6px #00e5ff" }}>
    Create New Lesson
  </DialogTitle>
  <DialogContent>
    <CreateLesson onClose={handleClose} />
  </DialogContent>
</Dialog>


      <LessonTable />
    </Box>
  );
}
