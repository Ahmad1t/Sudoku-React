// src/utils/ocr.ts
import Tesseract from 'tesseract.js';
import type { Puzzle } from '../components/Board';

export async function ocrPuzzle(file: File): Promise<Puzzle> {
  // Load the image into an HTMLImageElement
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => { URL.revokeObjectURL(url); resolve(image); };
    image.onerror = reject;
    image.src = url;
  });

  // Center‐crop to square and draw on canvas
  const size = Math.min(img.width, img.height);
  const cellSize = Math.floor(size / 9);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const dx = (img.width - size) / 2;
  const dy = (img.height - size) / 2;
  ctx.drawImage(img, dx, dy, size, size, 0, 0, size, size);

  // Prepare empty grid
  const grid: Puzzle = Array.from({ length: 9 }, () => Array(9).fill(0));

  // OCR each cell
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const x = c * cellSize;
      const y = r * cellSize;
      const cellCanvas = document.createElement('canvas');
      cellCanvas.width = cellCanvas.height = cellSize;
      const cellCtx = cellCanvas.getContext('2d')!;
      cellCtx.drawImage(canvas, x, y, cellSize, cellSize, 0, 0, cellSize, cellSize);

      const { data: { text } } = await Tesseract.recognize(
        cellCanvas,
        { lang: 'eng' } as any,       // cast to any to allow other keys
        {
          logger: () => {},           // silent logger
          tessedit_char_whitelist: '123456789',
          tessedit_pageseg_mode: Tesseract.PSM.SINGLE_CHAR
        } as any
      );

      const match = text.trim().match(/[1-9]/);
      grid[r][c] = match ? parseInt(match[0], 10) : 0;
    }
  }

  return grid;
}
