import React, { useState, useEffect } from 'react';
import Cell from './Cell';

export type Puzzle = number[][];

export interface BoardProps {
  orig: Puzzle;
  puzzle: Puzzle;
  solution: number[][] | null;
  onChange: (r: number, c: number, v: number) => void;
}

const Board: React.FC<BoardProps> = ({ orig, puzzle, solution, onChange }) => {
  const display = solution || puzzle;
  const [conflicts, setConflicts] = useState<boolean[][]>(
    Array.from({ length: 9 }, () => Array(9).fill(false))
  );
  const [selected, setSelected] = useState<{ r: number; c: number }>({ r: -1, c: -1 });

  // conflict detection
  useEffect(() => {
    const grid = display;
    const newConf = Array.from({ length: 9 }, () => Array(9).fill(false));
    const mark = (cells: [number, number][]) => {
      const seen = new Map<number, [number, number][]>();
      cells.forEach(([r, c]) => {
        const v = grid[r][c];
        if (v !== 0) {
          if (!seen.has(v)) seen.set(v, []);
          seen.get(v)!.push([r, c]);
        }
      });
      for (const locs of seen.values()) {
        if (locs.length > 1) locs.forEach(([r, c]) => (newConf[r][c] = true));
      }
    };

    // rows & columns
    for (let i = 0; i < 9; i++) {
      mark(Array.from({ length: 9 }, (_, j) => [i, j] as [number, number]));
      mark(Array.from({ length: 9 }, (_, j) => [j, i] as [number, number]));
    }
    // boxes
    for (let br = 0; br < 3; br++) {
      for (let bc = 0; bc < 3; bc++) {
        const box: [number, number][] = [];
        for (let r = 0; r < 3; r++)
          for (let c = 0; c < 3; c++)
            box.push([br * 3 + r, bc * 3 + c]);
        mark(box);
      }
    }

    setConflicts(newConf);
  }, [display]);

  // navigate & select
  const navigate = (r: number, c: number) => {
    if (r >= 0 && r < 9 && c >= 0 && c < 9) {
      setSelected({ r, c });
      const idx = r * 9 + c + 1;
      const inp = document.querySelector<HTMLInputElement>(`.board .cell:nth-child(${idx}) input`);
      inp?.focus();
    }
  };

  return (
    <div className="board">
      {display.map((row, r) =>
        row.map((val, c) => (
          <Cell
            key={`${r}-${c}`}
            row={r}
            col={c}
            value={val}
            readOnly={Boolean(orig[r][c]) && !solution}
            conflict={conflicts[r][c]}
            isRow={r === selected.r}
            isCol={c === selected.c}
            isSelected={r === selected.r && c === selected.c}
            onChange={onChange}
            onNavigate={navigate}
            onFocusCell={(r, c) => setSelected({ r, c })}
          />
        ))
      )}
    </div>
  );
};

export default Board;
