import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { get } from '../lib/api.js';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([get('/stats'), get('/lessons')])
      .then(([s, l]) => {
        if (!cancelled) {
          setStats(s);
          setLessons(l);
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
  if (!stats) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  }

  const nextLesson = lessons.find((l) => l.order === stats.lessons_completed + 1) || lessons[0];

  const cards = [
    { label: 'Lessons completed', value: `${stats.lessons_completed} / ${stats.lessons_total}` },
    { label: 'Attempts', value: stats.attempts_total },
    { label: 'Accuracy', value: `${stats.accuracy}%` },
    { label: 'Due reviews', value: stats.due_reviews },
    { label: 'Day streak', value: stats.streak },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {cards.map((c) => (
          <Grid item xs={6} sm={4} md={2} key={c.label}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {c.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {c.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {nextLesson && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">Continue learning</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {nextLesson.title} — {nextLesson.description}
            </Typography>
            <Button component={Link} to={`/lessons/${nextLesson.id}`} variant="contained">
              Open lesson
            </Button>
          </CardContent>
        </Card>
      )}
      {stats.due_reviews > 0 && (
        <Button component={Link} to="/practice" variant="outlined" color="secondary">
          {stats.due_reviews} word{stats.due_reviews === 1 ? '' : 's'} due for review
        </Button>
      )}
    </Box>
  );
}