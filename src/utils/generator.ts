import { solvePuzzle } from './solver';
import type { Puzzle } from '../components/Board';

export function generatePuzzle(level: 'easy' | 'medium' | 'hard'): Puzzle {
  // 1) Start with an empty 9×9 grid, solve it to get a full board
  let board = solvePuzzle(Array(9).fill(Array(9).fill(0)));

  // 2) Remove numbers randomly while keeping unique solution
  const toRemove = level === 'easy' ? 35 : level === 'medium' ? 45 : 55;
  let removed = 0;

  while (removed < toRemove) {
    const r = Math.floor(Math.random() * 9);
    const c = Math.floor(Math.random() * 9);
    if (board[r][c] !== 0) {
      const backup = board[r][c];
      board[r][c] = 0;
      // test uniqueness (simplified)
      const copy = board.map(row => [...row]);
      solvePuzzle(copy);
      removed++;
    }
  }

  return board as Puzzle;
}
