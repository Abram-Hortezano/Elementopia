import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Collapse,
  IconButton,
  List,
  ListItem,
  LinearProgress,
} from '@mui/material';
import { ExpandLess, ExpandMore, Star, Lock } from '@mui/icons-material';
import LessonService from '../../services/LessonService';

export default function LessonOverview({ lesson }) {
  const [fullLesson, setFullLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openTopic, setOpenTopic] = useState(null);

  useEffect(() => {
    const fetchLessonDetails = async () => {
      try {
        const data = await LessonService.getLessonById(lesson.id);
        setFullLesson(data);
      } catch (error) {
        console.error('Failed to load lesson details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessonDetails();
  }, [lesson.id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#0d1117">
        <CircularProgress />
      </Box>
    );
  }

  if (!fullLesson) {
    return (
      <Typography variant="body1" color="error">
        Failed to load lesson details.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', bgcolor: '#0d1117', color: 'white', minHeight: '100vh', p: 4 }}>
      {/* Left Side - Lesson Details */}
      <Box sx={{ flex: 2, pr: 4 }}>
        <Card sx={{ bgcolor: '#1e1e2e', color: 'white', borderRadius: 3, boxShadow: '0px 4px 10px rgba(255, 152, 0, 0.4)', mb: 2 }}>
          <CardContent>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {fullLesson.title}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {fullLesson.description}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>Room:</strong> {fullLesson.room || 'N/A'} <br />
              <strong>Number of Students:</strong> {fullLesson.numberOfStudents || 'N/A'}
            </Typography>
          </CardContent>
        </Card>

        {/* Topics and Subtopics */}
        {fullLesson.topics?.map((topic, topicIndex) => (
          <Card
            key={topic.id || topicIndex}
            sx={{
              mb: 2,
              bgcolor: '#1e1e2e',
              borderRadius: 2,
              boxShadow: '0px 4px 6px rgba(255, 152, 0, 0.4)',
              color: '#f5f5f5',
            }}
          >
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                onClick={() => setOpenTopic(openTopic === topicIndex ? null : topicIndex)}
                sx={{ cursor: 'pointer' }}
              >
                <Typography variant="h6">{`Topic ${topicIndex + 1}: ${topic.title}`}</Typography>
                <IconButton>
                  {openTopic === topicIndex ? (
                    <ExpandLess sx={{ color: 'white' }} />
                  ) : (
                    <ExpandMore sx={{ color: 'white' }} />
                  )}
                </IconButton>
              </Box>

              <Collapse in={openTopic === topicIndex} timeout="auto" unmountOnExit>
                <List sx={{ pl: 2 }}>
                  {topic.subtopics?.map((sub, subIndex) => (
                    <ListItem key={sub.id || subIndex} sx={{ display: 'block' }}>
                      <Typography variant="subtitle1">{`Subtopic ${subIndex + 1}: ${sub.title}`}</Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line', color: '#b0bec5' }}>
                        {sub.content}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Right Side - Progress/Achievements (Optional/Mimic) */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '20%' }}>
        <Card sx={{ bgcolor: '#1e1e2e', borderRadius: 3, boxShadow: '0px 4px 6px rgba(255, 152, 0, 0.4)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#f5f5f5' }}>
              Progress
            </Typography>
            <Typography variant="body2" sx={{ color: '#f5f5f5' }}>
              Topic Completion
            </Typography>
            <LinearProgress variant="determinate" value={0} sx={{ mt: 1, bgcolor: '#424242', height: 10, borderRadius: 5 }} />
            <Typography variant="body2" mt={1} sx={{ color: '#f5f5f5' }}>
              Exercises
            </Typography>
            <LinearProgress variant="determinate" value={0} sx={{ mt: 1, bgcolor: '#424242', height: 10, borderRadius: 5 }} />
            <Typography variant="body2" mt={1} sx={{ color: '#f5f5f5' }}>
              EXP Earned
            </Typography>
            <LinearProgress variant="determinate" value={0} sx={{ mt: 1, bgcolor: '#424242', height: 10, borderRadius: 5 }} />
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: '#1e1e2e', borderRadius: 3, boxShadow: '0px 4px 6px rgba(255, 152, 0, 0.4)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#f5f5f5' }}>
              Achievement
            </Typography>
            <Box display="flex" justifyContent="center" gap={1} mt={1}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} sx={{ color: '#ff9800' }} />
              ))}
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: '#1e1e2e', borderRadius: 3, boxShadow: '0px 4px 6px rgba(255, 152, 0, 0.4)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#f5f5f5' }}>
              Discovery
            </Typography>
            <Box display="flex" justifyContent="center" gap={1} mt={1}>
              {[...Array(3)].map((_, i) => (
                <Lock key={i} sx={{ color: '#ff9800' }} />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
