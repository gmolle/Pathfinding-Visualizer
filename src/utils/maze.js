// src/utils/maze.js
export const generateMaze = async (skew, grid, setGrid, bfs) => {
  const ROWS = grid.length;
  const COLS = grid[0].length;

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  // Reset grid: borders as walls, rest clear, preserve start/end
  let newGrid = grid.map((row) =>
    row.map((node) => ({
      ...node,
      isWall: false,
      weight: node.isStart || node.isEnd ? 1 : 1,
      isVisited: false,
      isPath: false,
    }))
  );
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const isBorder =
        row === 0 || row === ROWS - 1 || col === 0 || col === COLS - 1;
      if (isBorder && !newGrid[row][col].isStart && !newGrid[row][col].isEnd) {
        newGrid[row][col].isWall = true;
      }
    }
  }
  setGrid(newGrid);

  function biasedRandomInt(start, end, biasToward = 0) {
    const range = end - start + 1;
    let rand = Math.random();
    if (biasToward === 0) {
      rand = Math.pow(rand, 2.5);
    } else if (biasToward === 1) {
      rand = 1 - Math.pow(1 - rand, 2.5);
    }
    return start + Math.floor(rand * range);
  }

  function getEvenInRange(start, end) {
    const evens = [];
    for (let i = start; i <= end; i++) {
      if (i % 2 === 0) evens.push(i);
    }
    return evens;
  }

  function getOddInRange(start, end) {
    const odds = [];
    for (let i = start; i <= end; i++) {
      if (i % 2 !== 0) odds.push(i);
    }
    return odds;
  }

  async function recursiveDivide(rowStart, rowEnd, colStart, colEnd) {
    const width = colEnd - colStart + 1;
    const height = rowEnd - rowStart + 1;

    if (width < 3 || height < 3) return;

    let horizontal;
    if (skew === "vertical") {
      horizontal = Math.random() < 0.3;
    } else if (skew === "horizontal") {
      horizontal = Math.random() < 0.7;
    } else {
      horizontal = width < height;
    }

    if (horizontal) {
      const possibleWallRows = getEvenInRange(rowStart + 1, rowEnd - 1);
      if (possibleWallRows.length === 0) return;

      let wallRow = biasedRandomInt(
        rowStart + 1,
        rowEnd - 1,
        skew === "vertical" ? 1 : 0
      );
      if (wallRow % 2 !== 0) {
        wallRow = wallRow === rowEnd - 1 ? wallRow - 1 : wallRow + 1;
      }

      const possibleGapCols = getOddInRange(colStart, colEnd);
      const gapCol =
        possibleGapCols[Math.floor(Math.random() * possibleGapCols.length)];

      // Animate wall placement
      for (let col = colStart; col <= colEnd; col++) {
        if (
          col !== gapCol &&
          !newGrid[wallRow][col].isStart &&
          !newGrid[wallRow][col].isEnd
        ) {
          newGrid = newGrid.map((r) => r.map((n) => ({ ...n })));
          newGrid[wallRow][col].isWall = true;
          newGrid[wallRow][col].weight = 1;
          setGrid(newGrid);
          await sleep(5);
        }
      }

      await recursiveDivide(rowStart, wallRow - 1, colStart, colEnd);
      await recursiveDivide(wallRow + 1, rowEnd, colStart, colEnd);
    } else {
      const possibleWallCols = getEvenInRange(colStart + 1, colEnd - 1);
      if (possibleWallCols.length === 0) return;

      let wallCol = biasedRandomInt(
        colStart + 1,
        colEnd - 1,
        skew === "horizontal" ? 1 : 0
      );
      if (wallCol % 2 !== 0) {
        wallCol = wallCol === colEnd - 1 ? wallCol - 1 : wallCol + 1;
      }

      const possibleGapRows = getOddInRange(rowStart, rowEnd);
      const gapRow =
        possibleGapRows[Math.floor(Math.random() * possibleGapRows.length)];

      // Animate wall placement
      for (let row = rowStart; row <= rowEnd; row++) {
        if (
          row !== gapRow &&
          !newGrid[row][wallCol].isStart &&
          !newGrid[row][wallCol].isEnd
        ) {
          newGrid = newGrid.map((r) => r.map((n) => ({ ...n })));
          newGrid[row][wallCol].isWall = true;
          newGrid[row][wallCol].weight = 1;
          setGrid(newGrid);
          await sleep(5);
        }
      }

      await recursiveDivide(rowStart, rowEnd, colStart, wallCol - 1);
      await recursiveDivide(rowStart, rowEnd, wallCol + 1, colEnd);
    }
  }

  await recursiveDivide(1, ROWS - 2, 1, COLS - 2);

  // Verify solvability
  const { visitedNodesInOrder } = bfs(newGrid, newGrid[10][5], newGrid[10][45]);
  if (!visitedNodesInOrder.some((node) => node.isEnd)) {
    newGrid = newGrid.map((row, rowIndex) =>
      row.map((node, colIndex) => ({
        ...node,
        isWall:
          node.isStart || node.isEnd
            ? false
            : rowIndex === 0 ||
              rowIndex === ROWS - 1 ||
              colIndex === 0 ||
              colIndex === COLS - 1
            ? true
            : Math.random() < 0.2,
        weight: node.isStart || node.isEnd ? 1 : 1,
      }))
    );
    setGrid(newGrid);
  }
};
