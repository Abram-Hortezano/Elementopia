import React, { useState } from "react";
import {
  Box, Button, Dialog, DialogTitle, DialogContent
} from "@mui/material";
import LessonTable from "./LessonTable";
import CreateLesson from "./CreateLesson";

export default function CurriculumBuilder() {
    const [openCreateDialog, setOpenCreateDialog] = useState(false);

    const handleOpen = () => setOpenCreateDialog(true);
    const handleClose = () => setOpenCreateDialog(false);

 
  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      bgcolor: "#0d1117",
      color: "white",
      minHeight: "100vh",
      width: "100%",
      p: 4,
      gap: 4
    }}>
      <Button variant="contained" onClick={handleOpen}>
        Add Lesson
      </Button>

      <Dialog open={openCreateDialog} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Create New Lesson</DialogTitle>
        <DialogContent>
          <CreateLesson onClose={handleClose} />
        </DialogContent>
      </Dialog>

      <LessonTable />
    </Box>
  );
}
