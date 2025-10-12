import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Divider,
} from '@mui/material';
import LessonService from '../../services/LessonService';

export default function EditLesson({ lesson, onClose, onUpdate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [room, setRoom] = useState('');
  const [numberOfStudents, setNumberOfStudents] = useState('');
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessonDetails = async () => {
      try {
        const fullLesson = await LessonService.getLessonById(lesson.id);

        setTitle(fullLesson.title || '');
        setDescription(fullLesson.description || '');
        setRoom(fullLesson.room || '');
        setNumberOfStudents(fullLesson.numberOfStudents || '');
        setTopics(fullLesson.topics || []);
      } catch (error) {
        console.error('Error fetching full lesson:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessonDetails();
  }, [lesson.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedLesson = {
        ...lesson,
        title,
        description,
        room,
        numberOfStudents: parseInt(numberOfStudents, 10),
        topics,
      };

      await LessonService.updateLesson(lesson.id, updatedLesson);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleTopicChange = (index, field, value) => {
    const updated = [...topics];
    updated[index][field] = value;
    setTopics(updated);
  };

  const handleSubtopicChange = (topicIndex, subIndex, field, value) => {
    const updated = [...topics];
    updated[topicIndex].subtopics[subIndex][field] = value;
    setTopics(updated);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Paper
      elevation={8}
      sx={{
        p: 4,
        width: 'auto',
        height: '90vh',
        mx: 'auto',
        overflowY: 'auto',
        background: 'linear-gradient(to bottom right, #1e1e2f, #2b2d42)',
        color: '#fff',
        border: '2px solid #ff4081',
        borderRadius: '16px',
        boxShadow: '0 0 30px #ff4081',
        fontFamily: `'Orbitron', sans-serif`,
      }}
    >
      <Typography variant="h3" gutterBottom sx={{ color: '#ff4081', fontWeight: 700 }}>
        🎮 Edit Lesson
      </Typography>

      <Box component="form" onSubmit={handleSubmit} autoComplete="off">
        <TextField
          label="Lesson Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          sx={{ input: { color: '#fff' }, label: { color: '#ccc' } }}
        />

        <TextField
          label="Description"
          fullWidth
          margin="normal"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ textarea: { color: '#fff' }, label: { color: '#ccc' } }}
        />

        <TextField
          label="Room"
          fullWidth
          margin="normal"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          sx={{ input: { color: '#fff' }, label: { color: '#ccc' } }}
        />

        <TextField
          label="Number of Students"
          type="number"
          fullWidth
          margin="normal"
          value={numberOfStudents}
          onChange={(e) => setNumberOfStudents(e.target.value)}
          sx={{ input: { color: '#fff' }, label: { color: '#ccc' } }}
        />

        <Divider sx={{ my: 4, borderColor: '#ff4081' }} />
        <Typography variant="h4" sx={{ color: '#00e676', fontWeight: 600 }}>🎯 Topics & Subtopics</Typography>

        {topics.map((topic, topicIndex) => (
          <Box
            key={topic.id || topicIndex}
            sx={{
              mt: 3,
              p: 3,
              border: '2px dashed #00e676',
              borderRadius: 4,
              backgroundColor: '#121212',
            }}
          >
            <TextField
              label={`📝 Topic #${topicIndex + 1}`}
              fullWidth
              margin="normal"
              value={topic.title}
              onChange={(e) => handleTopicChange(topicIndex, 'title', e.target.value)}
              sx={{ input: { color: '#fff' }, label: { color: '#ccc' } }}
            />

            {topic.subtopics?.map((sub, subIndex) => (
              <Box key={sub.id || subIndex} sx={{ pl: 2, mt: 2 }}>
                <TextField
                  label={`🔹 Subtopic Title #${subIndex + 1}`}
                  fullWidth
                  margin="normal"
                  value={sub.title}
                  onChange={(e) =>
                    handleSubtopicChange(topicIndex, subIndex, 'title', e.target.value)
                  }
                  sx={{ input: { color: '#fff' }, label: { color: '#ccc' } }}
                />
                <TextField
                  label="Subtopic Content"
                  fullWidth
                  multiline
                  rows={3}
                  margin="normal"
                  value={sub.content}
                  onChange={(e) =>
                    handleSubtopicChange(topicIndex, subIndex, 'content', e.target.value)
                  }
                  sx={{ textarea: { color: '#fff' }, label: { color: '#ccc' } }}
                />
              </Box>
            ))}
          </Box>
        ))}

        <Box mt={5} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderColor: '#ff4081',
              color: '#ff4081',
              '&:hover': {
                backgroundColor: '#ff4081',
                color: '#fff',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              background: 'linear-gradient(to right, #00e676, #1de9b6)',
              color: '#000',
              fontWeight: 600,
              boxShadow: '0 0 10px #00e676',
              '&:hover': {
                background: '#00c853',
                color: '#fff',
              },
            }}
          >
            Save Lesson
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
