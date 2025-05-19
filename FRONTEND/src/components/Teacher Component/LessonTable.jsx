import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Typography,
  Box, Modal, Link, CircularProgress
} from '@mui/material';
import LessonService from '../../services/LessonService';
import EditLesson from './EditLesson';
import LessonOverview from './LessonOverview';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: '#1e1e2f',
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
  width: { xs: '95%', sm: '85%', md: '70%' },
  maxHeight: '90vh',
  width: "90vw",
  overflowY: 'auto',
  color: '#f0f0f0',
};

export default function BasicTable() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLesson, setEditingLesson] = useState(null);
  const [viewingLesson, setViewingLesson] = useState(null);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const data = await LessonService.getAllLessons();
      setLessons(data);
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (lesson) => setEditingLesson(lesson);

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this lesson?");
    if (!confirmDelete) return;

    try {
      await LessonService.deleteLesson(id);
      setLessons((prev) => prev.filter((lesson) => lesson.id !== id));
    } catch (error) {
      console.error("Failed to delete lesson:", error);
    }
  };

  return (
    <Box p={2} sx={{ backgroundColor: '#121212', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#00ffea', fontFamily: '"Orbitron", sans-serif', fontWeight: 700 }}>
      Lessons Dashboard
      </Typography>

      <TableContainer component={Paper} sx={{ backgroundColor: '#1f1f2e', maxHeight: 500, borderRadius: 2 }}>
        <Table stickyHeader>
          <TableHead sx={{ backgroundColor: '#27273a' }}>
            <TableRow>
              <TableCell sx={{ color: '#000000', fontWeight: 'bold' }}>Lesson Title</TableCell>
              <TableCell align="center" sx={{ color: '#000000', fontWeight: 'bold' }}>Room</TableCell>
              <TableCell align="center" sx={{ color: '#000000', fontWeight: 'bold' }}>No. of Students</TableCell>
              <TableCell align="center" sx={{ color: '#000000', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress size={30} sx={{ color: '#00ffea' }} />
                </TableCell>
              </TableRow>
            ) : lessons.length > 0 ? (
              lessons.map((lesson) => (
                <TableRow key={lesson.id} hover sx={{ '&:hover': { backgroundColor: '#2b2b3f' } }}>
                  <TableCell sx={{ color: '#ffffff' }}>
                    <Link
                      component="button"
                      underline="hover"
                      onClick={() => setViewingLesson(lesson)}
                      sx={{
                        color: '#00d0ff',
                        fontWeight: 600,
                        '&:hover': { color: '#00ffea' },
                        fontFamily: '"Orbitron", sans-serif',
                      }}
                    >
                      {lesson.title}
                    </Link>
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#cccccc' }}>{lesson.room || 'N/A'}</TableCell>
                  <TableCell align="center" sx={{ color: '#cccccc' }}>{lesson.numberOfStudents ?? 'N/A'}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        mr: 1,
                        backgroundColor: '#008cff',
                        '&:hover': { backgroundColor: '#00b4ff' },
                        fontWeight: 'bold',
                        fontFamily: '"Orbitron", sans-serif'
                      }}
                      onClick={() => handleEdit(lesson)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: '#ff4c4c',
                        '&:hover': { backgroundColor: '#ff1f1f' },
                        fontWeight: 'bold',
                        fontFamily: '"Orbitron", sans-serif'
                      }}
                      onClick={() => handleDelete(lesson.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ color: '#777' }}>
                  No lessons available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Lesson Modal */}
      <Modal
        open={Boolean(editingLesson)}
        onClose={() => setEditingLesson(null)}
        aria-labelledby="edit-lesson-modal"
      >
        <Box sx={modalStyle}>
          {editingLesson && (
            <EditLesson
              lesson={editingLesson}
              onClose={() => setEditingLesson(null)}
              onUpdate={fetchLessons}
            />
          )}
        </Box>
      </Modal>

      {/* View Lesson Modal */}
      <Modal
        open={Boolean(viewingLesson)}
        onClose={() => setViewingLesson(null)}
        aria-labelledby="view-lesson-modal"
      >
        <Box sx={modalStyle}>
          {viewingLesson && (
            <LessonOverview
              lesson={viewingLesson}
              onClose={() => setViewingLesson(null)}
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
}
