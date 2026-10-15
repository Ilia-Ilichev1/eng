import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { get } from '../lib/api.js';

export default function Dictionary() {
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('');
  const [words, setWords] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (query) {
      params.set('q', query);
    }
    if (level) {
      params.set('level', level);
    }
    const qs = params.toString();
    get(`/dictionary${qs ? `?${qs}` : ''}`)
      .then((data) => {
        if (!cancelled) {
          setWords(data);
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
  }, [query, level]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dictionary
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Search words"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ maxWidth: 320 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        {['A1', 'A2'].map((lv) => (
          <Chip
            key={lv}
            label={lv}
            clickable
            color={level === lv ? 'primary' : 'default'}
            onClick={() => setLevel(level === lv ? '' : lv)}
          />
        ))}
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
      {!error && !words && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>
      )}
      {!error && words && words.length === 0 && (
        <Typography variant="body1" color="text.secondary">
          No words found.
        </Typography>
      )}
      {!error && words && words.length > 0 && (
        <Grid container spacing={2}>
          {words.map((w) => (
            <Grid item xs={12} sm={6} md={4} key={w.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" component="div">
                      {w.term}
                    </Typography>
                    <Chip label={w.level} size="small" />
                  </Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {w.translation}
                  </Typography>
                  {w.definition && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {w.definition}
                    </Typography>
                  )}
                  {w.example && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                      "{w.example}"
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {w.part_of_speech}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}