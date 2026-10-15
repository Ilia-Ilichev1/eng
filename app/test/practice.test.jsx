import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Practice from '../src/pages/Practice.jsx';
import { theme } from '../src/theme.js';

function renderWithRouter(ui) {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </MemoryRouter>
  );
}

describe('Practice page', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders due word flashcard and reveals translation', async () => {
    global.fetch.mockImplementation((url) => {
      if (url.startsWith('/api/reviews/due')) {
        return Promise.resolve({
          ok: true,
          json: async () => [
            {
              id: 1,
              term: 'hello',
              translation: 'привет',
              definition: 'a word used as a greeting',
              example: 'Hello, how are you?',
              part_of_speech: 'interjection',
              level: 'A1',
              tags: ['greetings'],
              progress: null,
            },
          ],
        });
      }
      if (url.startsWith('/api/words/')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ repetitions: 1, interval_days: 1, ease_factor: 2.6 }),
        });
      }
      return Promise.reject(new Error('unexpected url'));
    });
    renderWithRouter(<Practice />);
    expect(await screen.findByText('hello')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Reveal translation'));
    expect(await screen.findByText('привет')).toBeInTheDocument();
    fireEvent.click(screen.getByText('5 - Easy'));
    expect(await screen.findByText('No words due for review right now. Come back later!')).toBeInTheDocument();
  });
});