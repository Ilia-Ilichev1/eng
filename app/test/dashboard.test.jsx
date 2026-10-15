import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Dashboard from '../src/pages/Dashboard.jsx';
import { theme } from '../src/theme.js';

function renderWithRouter(ui) {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </MemoryRouter>
  );
}

describe('Dashboard page', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders stats from API', async () => {
    global.fetch.mockImplementation((url) => {
      if (url === '/api/stats') {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            lessons_total: 4,
            lessons_completed: 1,
            attempts_total: 10,
            accuracy: 80,
            due_reviews: 3,
            streak: 2,
          }),
        });
      }
      if (url === '/api/lessons') {
        return Promise.resolve({
          ok: true,
          json: async () => [
            { id: 2, title: 'Everyday Verbs', description: 'Practice verbs', level: 'A1', order: 2 },
          ],
        });
      }
      return Promise.reject(new Error('unexpected url'));
    });
    renderWithRouter(<Dashboard />);
    expect(await screen.findByText('Dashboard')).toBeInTheDocument();
    expect(await screen.findByText('1 / 4')).toBeInTheDocument();
    expect(await screen.findByText('80%')).toBeInTheDocument();
    expect(await screen.findByText('3')).toBeInTheDocument();
    expect(await screen.findByText('Continue learning')).toBeInTheDocument();
    expect(await screen.findByText('Everyday Verbs — Practice verbs')).toBeInTheDocument();
  });
});