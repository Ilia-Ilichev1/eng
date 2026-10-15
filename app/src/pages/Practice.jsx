import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import { get, post } from '../lib/api.js';
import { review as srsPreview } from '../lib/srs.js';

const RATINGS = [
  { value: 0, label: '0 - Forget' },
  { value: 1, label: '1 - Wrong' },
  { value: 2, label: '2 - Wrong-ish' },
  { value: 3, label: '3 - Hard' },
  { value: 4, label: '4 - Good' },
  { value: 5, label: '5 - Easy' },
];

export default function Practice() {
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    get('/reviews/due?limit=20')
      .then((data) => {
        if (!cancelled) {
          setQueue(data);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e.message);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  }
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }
  if (queue.length === 0) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Word Practice
        </Typography>
        <Alert severity="success">No words due for review right now. Come back later!</Alert>
      </Box>
    );
  }

  const current = queue[index];
  const dueDate = (progress) => progress?.due_date || new Date().toISOString().slice(0, 10);

  const rate = (quality) => {
    const nextPreview = srsPreview(
      {
        repetitions: current.progress?.repetitions || 0,
        interval_days: current.progress?.interval_days || 0,
        lapses: current.progress?.lapses || 0,
        ease_factor: current.progress?.ease_factor || 2.5,
      },
      quality
    );
    setPreview(nextPreview);
    post(`/words/${current.id}/review`, { quality })
      .then(() => {
        setSnackbar('Review saved');
        setQueue((prev) => prev.filter((w) => w.id !== current.id));
        setRevealed(false);
        setPreview(null);
      })
      .catch((e) => setSnackbar(e.message));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Word Practice
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {index + 1} of {queue.length} words remaining
      </Typography>
      <Card sx={{ maxWidth: 560 }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            {current.term}
          </Typography>
          {revealed && (
            <Box>
              <Typography variant="body1" gutterBottom>
                {current.translation}
              </Typography>
              {current.definition && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {current.definition}
                </Typography>
              )}
              {current.example && (
                <Typography variant="body2" color="text.secondary" fontStyle="italic" gutterBottom>
                  "{current.example}"
                </Typography>
              )}
              {preview && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Next review: {preview.due_date} (interval {preview.interval_days}d)
                </Typography>
              )}
              <Box sx={{ mt: 2 }}>
                <ButtonGroup orientation="vertical" fullWidth>
                  {RATINGS.map((r) => (
                    <Button key={r.value} onClick={() => rate(r.value)}>
                      {r.label}
                    </Button>
                  ))}
                </ButtonGroup>
              </Box>
            </Box>
          )}
          {!revealed && (
            <Button variant="contained" onClick={() => setRevealed(true)}>
              Reveal translation
            </Button>
          )}
        </CardContent>
      </Card>
      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={3000}
        onClose={() => setSnackbar('')}
        message={snackbar}
      />
    </Box>
  );
}