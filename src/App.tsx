import React, { useState } from 'react';
import Board, { type Puzzle } from './components/Board';
import { generatePuzzle } from './utils/generator';
import { solvePuzzle } from './utils/solver';
import { ocrPuzzle } from './utils/ocr';
import './index.css';

const App: React.FC = () => {
  const [orig, setOrig] = useState<Puzzle>(generatePuzzle('easy'));
  const [puzzle, setPuzzle] = useState<Puzzle>(orig.map(r => [...r]));
  const [solution, setSolution] = useState<number[][] | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);

  // User edits a cell
  const handleChange = (r: number, c: number, v: number) => {
    const next = puzzle.map(row => [...row]);
    next[r][c] = v;
    setPuzzle(next);
    setSolution(null);
  };
  
  // New puzzle
  const handleNew = (level: 'easy' | 'medium' | 'hard') => {
    const p = generatePuzzle(level);
    setOrig(p);
    setPuzzle(p.map(r => [...r]));
    setSolution(null);
    setOcrError(null);
  };

  // Solve & Check & Hint remain unchanged
  const handleSolve = () => setSolution(solvePuzzle(orig));
  const handleCheck = () => setPuzzle(puzzle.map(r => [...r]));
  const handleHint = () => {
    if (!solution) return setSolution(solvePuzzle(orig));
    const sol = solution;
    const empties: [number, number][] = [];
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++)
        if (orig[r][c] === 0 && puzzle[r][c] === 0)
          empties.push([r, c]);
    if (!empties.length) return;
    const [hr, hc] = empties[Math.floor(Math.random() * empties.length)];
    const next = puzzle.map(row => [...row]);
    next[hr][hc] = sol[hr][hc];
    setPuzzle(next);
    setSolution(null);
  };

  

const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  setOcrLoading(true);
  setOcrError(null);
  try {
    const grid = await ocrPuzzle(file);

    const hasAny = grid.flat().some(v => v !== 0);
    if (!hasAny) {
      throw new Error('no digits found');
    }

    setOrig(grid);
    setPuzzle(grid.map(r => [...r]));
    setSolution(null);
  } catch (err) {
    setOcrError(
      'No digits were detected. Please upload a clearer, high-contrast puzzle photo.'
    );
  } finally {
    setOcrLoading(false);
  }
};

  return (
    <div className="app-container">
      <header>
        <h1>Sudoku Challenge</h1>
        <p>Fill the grid to solve.</p>
      </header>

      <div style={{ position: 'relative' }}>
        <Board orig={orig} puzzle={puzzle} solution={solution} onChange={handleChange} />
        {ocrLoading && (
          <div className="loading-overlay">
            Reading…
          </div>
        )}
      </div>

      <div className="controls">
        <select onChange={e => handleNew(e.target.value as any)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button onClick={() => handleNew('easy')}>New</button>
        <button onClick={handleSolve}>Solve</button>
        <button onClick={handleCheck}>Check</button>
        <button onClick={handleHint}>Hint</button>
        <label style={{ position: 'relative', overflow: 'hidden' }}>
        </label>
      </div>

    </div>
  );
};

export default App;
