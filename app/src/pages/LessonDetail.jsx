import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import { get, post } from '../lib/api.js';

const EMPTY_STATE = { answered: false, correct: null, selected: '', text: '' };

export default function LessonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState(null);
  const [states, setStates] = useState({});
  const [attempts, setAttempts] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [snackbar, setSnackbar] = useState('');

  useEffect(() => {
    let cancelled = false;
    get(`/lessons/${id}`)
      .then((data) => {
        if (!cancelled) {
          setLesson(data);
          const initial = {};
          data.exercises.forEach((ex) => {
            initial[ex.id] = { ...EMPTY_STATE };
          });
          setStates(initial);
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
  }, [id]);

  if (error) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
        <Button sx={{ mt: 2 }} variant="outlined" onClick={() => navigate('/lessons')}>
          Back to lessons
        </Button>
      </Box>
    );
  }
  if (!lesson) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  }

  const checkAnswer = (ex, answer) => {
    const correct = String(answer).trim().toLowerCase() === String(ex.answer).trim().toLowerCase();
    setStates((prev) => ({
      ...prev,
      [ex.id]: { answered: true, correct, selected: answer, text: answer },
    }));
    setAttempts((prev) => [...prev, { exercise_id: ex.id, answer, is_correct: correct }]);
  };

  const submitAll = async () => {
    try {
      await post(`/lessons/${id}/attempts`, { attempts });
      setSubmitted(true);
      setSnackbar('Answers saved');
    } catch (e) {
      setSnackbar(e.message);
    }
  };

  return (
    <Box>
      <Button sx={{ mb: 2 }} variant="outlined" onClick={() => navigate('/lessons')}>
        Back to lessons
      </Button>
      <Typography variant="h4" gutterBottom>
        {lesson.title}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {lesson.description}
      </Typography>
      {lesson.exercises.map((ex, index) => (
        <Card key={ex.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Exercise {index + 1} ({ex.type.replace('_', ' ')})
            </Typography>
            <Typography variant="body1" gutterBottom>
              {ex.prompt}
            </Typography>
            {ex.type === 'mcq' && (
              <RadioGroup
                value={states[ex.id]?.selected || ''}
                onChange={(e) => checkAnswer(ex, e.target.value)}
              >
                {ex.options.map((opt) => (
                  <FormControlLabel key={opt.id} value={opt.text} control={<Radio />} label={opt.text} />
                ))}
              </RadioGroup>
            )}
            {ex.type === 'fill_blank' && (
              <TextField
                label="Your answer"
                value={states[ex.id]?.text || ''}
                onChange={(e) => checkAnswer(ex, e.target.value)}
                onBlur={() => {}}
                fullWidth
                sx={{ maxWidth: 400 }}
              />
            )}
            {ex.type === 'translation' && (
              <TextField
                label="Your translation"
                value={states[ex.id]?.text || ''}
                onChange={(e) => checkAnswer(ex, e.target.value)}
                fullWidth
                sx={{ maxWidth: 400 }}
              />
            )}
            {states[ex.id]?.answered && (
              <Box sx={{ mt: 2 }}>
                {states[ex.id].correct ? (
                  <Alert severity="success">Correct!</Alert>
                ) : (
                  <Alert severity="error">
                    Incorrect. Correct answer: {ex.answer}
                  </Alert>
                )}
                {ex.explanation && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {ex.explanation}
                  </Typography>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      ))}
      {!submitted && attempts.length > 0 && (
        <Button variant="contained" onClick={submitAll}>
          Save answers
        </Button>
      )}
      {submitted && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Lesson answers saved. Well done!
        </Alert>
      )}
      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={3000}
        onClose={() => setSnackbar('')}
        message={snackbar}
      />
    </Box>
  );
}