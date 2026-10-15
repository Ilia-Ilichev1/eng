import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { get } from '../lib/api.js';

export default function Lessons() {
  const [lessons, setLessons] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    get('/lessons')
      .then((data) => {
        if (!cancelled) {
          setLessons(data);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e.message);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }
  if (!lessons) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Lessons
      </Typography>
      <List>
        {lessons.map((lesson) => (
          <ListItem key={lesson.id} disablePadding sx={{ mb: 1 }}>
            <ListItemButton component={Link} to={`/lessons/${lesson.id}`}>
              <ListItemText
                primary={lesson.title}
                secondary={lesson.description}
              />
              <Chip label={lesson.level} size="small" />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}