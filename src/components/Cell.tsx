import React from 'react';

interface CellProps {
  row: number;
  col: number;
  value: number;
  readOnly: boolean;
  conflict: boolean;
  isRow: boolean;
  isCol: boolean;
  isSelected: boolean;
  onChange: (r: number, c: number, v: number) => void;
  onFocusCell: (r: number, c: number) => void;
  onNavigate: (r: number, c: number) => void;
}

const Cell: React.FC<CellProps> = ({
  row, col, value, readOnly, conflict,
  isRow, isCol, isSelected,
  onChange, onFocusCell, onNavigate
}) => {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value) || 0;
    if (!readOnly && v >= 0 && v <= 9) {
      onChange(row, col, v);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':    onNavigate(row - 1, col); break;
      case 'ArrowDown':  onNavigate(row + 1, col); break;
      case 'ArrowLeft':  onNavigate(row, col - 1); break;
      case 'ArrowRight': onNavigate(row, col + 1); break;
      default: return;
    }
    e.preventDefault();
  };

  const classes = ['cell'];
  if (readOnly)   classes.push('prefilled');
  if (conflict)   classes.push('conflict');
  if (isRow)      classes.push('row-highlight');
  if (isCol)      classes.push('col-highlight');
  if (isSelected) classes.push('selected');

  return (
    <div className={classes.join(' ')}>
      <input
        type="text"
        maxLength={1}
        value={value || ''}
        readOnly={readOnly}
        onChange={handleInput}
        onKeyDown={handleKey}
        onFocus={() => onFocusCell(row, col)}
      />
    </div>
  );
};

export default Cell;
