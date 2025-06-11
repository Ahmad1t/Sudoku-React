import type { Puzzle } from '../components/Board';

export function solvePuzzle(grid: Puzzle): number[][] {
  const board = grid.map(row => [...row]);

  const isValid = (r: number, c: number, v: number) => {
    for (let i = 0; i < 9; i++) {
      if (board[r][i] === v || board[i][c] === v) return false;
      const br = Math.floor(r/3)*3 + Math.floor(i/3);
      const bc = Math.floor(c/3)*3 + (i%3);
      if (board[br][bc] === v) return false;
    }
    return true;
  };

  const backtrack = (): boolean => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0) {
          for (let v = 1; v <= 9; v++) {
            if (isValid(r, c, v)) {
              board[r][c] = v;
              if (backtrack()) return true;
              board[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  backtrack();
  return board;
}
