const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// Random Scatter: 20% inner walls, instant pop-in, no borders
export const generateRandomScatter = async (grid, setGrid, bfs) => {
  const ROWS = grid.length;
  const COLS = grid[0].length;

  // Reset grid: clear walls and weights, preserve start/end
  let newGrid = grid.map((row) =>
    row.map((node) => ({
      ...node,
      isWall: false,
      weight: node.isStart || node.isEnd ? 1 : 1,
      isVisited: false,
      isPath: false,
      animationKey: node.animationKey + 1,
    }))
  );

  // Set 20% inner walls instantly
  newGrid = newGrid.map((row, rowIndex) =>
    row.map((node, colIndex) => ({
      ...node,
      isWall:
        !node.isStart &&
        !node.isEnd &&
        rowIndex > 0 &&
        rowIndex < ROWS - 1 &&
        colIndex > 0 &&
        colIndex < COLS - 1 &&
        Math.random() < 0.2,
      animationKey: node.isWall ? node.animationKey + 1 : node.animationKey,
    }))
  );
  setGrid(newGrid);

  // Verify solvability
  const { visitedNodesInOrder } = bfs(
    newGrid,
    newGrid[15][10],
    newGrid[15][40]
  );
  if (!visitedNodesInOrder.some((node) => node.isEnd)) {
    // Fallback: Regenerate with 20% inner walls, no borders
    newGrid = newGrid.map((row, rowIndex) =>
      row.map((node, colIndex) => ({
        ...node,
        isWall:
          node.isStart || node.isEnd
            ? false
            : rowIndex > 0 &&
              rowIndex < ROWS - 1 &&
              colIndex > 0 &&
              colIndex < COLS - 1 &&
              Math.random() < 0.2,
        weight: node.isStart || node.isEnd ? 1 : 1,
        animationKey: node.isWall ? node.animationKey + 1 : node.animationKey,
      }))
    );
    setGrid(newGrid);
  }
};

// Maze Generation: Recursive division with skew
export const generateMaze = async (skew, grid, setGrid, bfs) => {
  const ROWS = grid.length;
  const COLS = grid[0].length;

  // Reset grid: clear walls and weights, preserve start/end
  let newGrid = grid.map((row) =>
    row.map((node) => ({
      ...node,
      isWall: false,
      weight: node.isStart || node.isEnd ? 1 : 1,
      isVisited: false,
      isPath: false,
      animationKey: node.animationKey + 1,
    }))
  );

  // Animate border walls
  // 1. Top border: Left to right, batch 20 nodes
  for (let col = 0; col < COLS; col += 20) {
    newGrid = newGrid.map((r) => r.map((n) => ({ ...n })));
    for (let i = col; i < Math.min(col + 20, COLS); i++) {
      if (!newGrid[0][i].isStart && !newGrid[0][i].isEnd) {
        newGrid[0][i].isWall = true;
        newGrid[0][i].animationKey += 1;
      }
    }
    setGrid(newGrid);
    await sleep(20); // ~1ms/node, 20 nodes
  }

  // 2. Left and right borders: Down simultaneously, batch 10 rows
  for (let row = 1; row < ROWS - 1; row += 10) {
    newGrid = newGrid.map((r) => r.map((n) => ({ ...n })));
    for (let r = row; r < Math.min(row + 10, ROWS - 1); r++) {
      // Left border
      if (!newGrid[r][0].isStart && !newGrid[r][0].isEnd) {
        newGrid[r][0].isWall = true;
        newGrid[r][0].animationKey += 1;
      }
      // Right border
      if (!newGrid[r][COLS - 1].isStart && !newGrid[r][COLS - 1].isEnd) {
        newGrid[r][COLS - 1].isWall = true;
        newGrid[r][COLS - 1].animationKey += 1;
      }
    }
    setGrid(newGrid);
    await sleep(20); // ~1ms/node, 10 rows ≈ 20 nodes
  }

  // 3. Bottom border: Left and right to middle, batch 20 nodes
  const middleCol = Math.floor(COLS / 2); // COLS = 51, middleCol = 25
  for (let offset = 0; offset <= middleCol; offset += 10) {
    newGrid = newGrid.map((r) => r.map((n) => ({ ...n })));
    for (let i = offset; i < Math.min(offset + 10, middleCol + 1); i++) {
      // Left side: col from 0 to 25
      const leftCol = i;
      if (
        leftCol <= middleCol &&
        !newGrid[ROWS - 1][leftCol].isStart &&
        !newGrid[ROWS - 1][leftCol].isEnd
      ) {
        newGrid[ROWS - 1][leftCol].isWall = true;
        newGrid[ROWS - 1][leftCol].animationKey += 1;
      }
      // Right side: col from 50 to 25
      const rightCol = COLS - 1 - i;
      if (
        rightCol >= middleCol &&
        !newGrid[ROWS - 1][rightCol].isStart &&
        !newGrid[ROWS - 1][rightCol].isEnd
      ) {
        newGrid[ROWS - 1][rightCol].isWall = true;
        newGrid[ROWS - 1][rightCol].animationKey += 1;
      }
    }
    setGrid(newGrid);
    await sleep(20); // ~1ms/node, ~20 nodes
  }

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
    console.log(
      `recursiveDivide: rowStart=${rowStart}, rowEnd=${rowEnd}, colStart=${colStart}, colEnd=${colEnd}`
    );
    const width = colEnd - colStart + 1;
    const height = rowEnd - rowStart + 1;

    if (width < 3 || height < 3) {
      return;
    }

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
      if (possibleWallRows.length === 0) {
        return;
      }

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
      if (possibleWallCols.length === 0) {
        return;
      }

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
  const { visitedNodesInOrder } = bfs(
    newGrid,
    newGrid[15][10],
    newGrid[15][40]
  );
  if (!visitedNodesInOrder.some((node) => node.isEnd)) {
    console.log(`Maze not solvable, falling back to random scatter`);
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
        animationKey: node.animationKey + 1,
      }))
    );
    setGrid(newGrid);
  }
};
