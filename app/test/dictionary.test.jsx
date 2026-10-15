import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Dictionary from '../src/pages/Dictionary.jsx';
import { theme } from '../src/theme.js';

function renderWithRouter(ui) {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </MemoryRouter>
  );
}

describe('Dictionary page', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders search results from API', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          term: 'apple',
          translation: 'яблоко',
          definition: 'a round red or green fruit',
          example: 'An apple a day keeps the doctor away.',
          part_of_speech: 'noun',
          level: 'A1',
          tags: ['food', 'fruit'],
        },
      ],
    });
    renderWithRouter(<Dictionary />);
    expect(await screen.findByText('Dictionary')).toBeInTheDocument();
    expect(await screen.findByText('apple')).toBeInTheDocument();
    expect(await screen.findByText('яблоко')).toBeInTheDocument();
  });

  it('sends query parameter when searching', async () => {
    let calledUrl = '';
    global.fetch.mockImplementation((url) => {
      calledUrl = url;
      return Promise.resolve({ ok: true, json: async () => [] });
    });
    renderWithRouter(<Dictionary />);
    const input = screen.getByLabelText('Search words');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'apple' } });
      await new Promise((r) => setTimeout(r, 0));
    });
    await vi.waitFor(() => {
      expect(calledUrl).toContain('q=apple');
    });
  });
});