const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export const generateRandomScatter = async (grid, setGrid, bfs) => {
  const ROWS = grid.length;
  const COLS = grid[0].length;

  let newGrid = grid.map((row, rowIndex) =>
    row.map((node, colIndex) => {
      const isInner =
        rowIndex > 0 &&
        rowIndex < ROWS - 1 &&
        colIndex > 0 &&
        colIndex < COLS - 1;
      return {
        ...node,
        isWall: !node.isStart && !node.isEnd && isInner && Math.random() < 0.2,
        weight: node.isStart || node.isEnd ? 1 : 1,
        isVisited: false,
        isPath: false,
        animationKey: node.animationKey + 1,
      };
    })
  );

  // Verify solvability
  const { visitedNodesInOrder } = bfs(
    newGrid,
    newGrid[15][10],
    newGrid[15][40]
  );
  if (!visitedNodesInOrder.some((node) => node.isEnd)) {
    // Regenerate walls only for inner nodes if unsolvable
    newGrid = newGrid.map((row, rowIndex) =>
      row.map((node, colIndex) => {
        const isInner =
          rowIndex > 0 &&
          rowIndex < ROWS - 1 &&
          colIndex > 0 &&
          colIndex < COLS - 1;
        return {
          ...node,
          isWall:
            node.isStart || node.isEnd ? false : isInner && Math.random() < 0.2,
          animationKey: isInner ? node.animationKey + 1 : node.animationKey,
        };
      })
    );
  }

  setGrid(newGrid);
};

export const generateWeightRandomScatter = async (grid, setGrid, bfs) => {
  const ROWS = grid.length;
  const COLS = grid[0].length;

  let newGrid = grid.map((row, rowIndex) =>
    row.map((node, colIndex) => {
      const isInner =
        rowIndex > 0 &&
        rowIndex < ROWS - 1 &&
        colIndex > 0 &&
        colIndex < COLS - 1;
      return {
        ...node,
        isWall: false, // Ensure no walls
        weight:
          node.isStart || node.isEnd
            ? 1
            : isInner && Math.random() < 0.2
            ? 2
            : 1,
        isVisited: false,
        isPath: false,
        animationKey: node.animationKey + 1,
      };
    })
  );

  // Verify solvability
  const { visitedNodesInOrder } = bfs(
    newGrid,
    newGrid[15][10],
    newGrid[15][40]
  );
  if (!visitedNodesInOrder.some((node) => node.isEnd)) {
    // Fall back to wall-based random scatter (matching generateRandomScatter)
    console.log(
      `Weight scatter maze not solvable, falling back to random scatter`
    );
    newGrid = newGrid.map((row, rowIndex) =>
      row.map((node, colIndex) => {
        const isInner =
          rowIndex > 0 &&
          rowIndex < ROWS - 1 &&
          colIndex > 0 &&
          colIndex < COLS - 1;
        return {
          ...node,
          isWall:
            node.isStart || node.isEnd ? false : isInner && Math.random() < 0.2,
          weight: node.isStart || node.isEnd ? 1 : 1, // Reset weights
          animationKey: isInner ? node.animationKey + 1 : node.animationKey,
        };
      })
    );
  }

  setGrid(newGrid);
};

export const generateMaze = async (skew, grid, setGrid, bfs) => {
  const ROWS = grid.length;
  const COLS = grid[0].length;

  // Initialize grid
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

  // Flag to determine if we're generating a weight-based maze
  const isWeightMaze = skew === "weight-recursive";

  // 1. Top border: Left to right
  for (let col = 0; col < COLS; col += 6) {
    newGrid = newGrid.map((r) => r.map((n) => ({ ...n })));
    for (let i = col; i < Math.min(col + 6, COLS); i++) {
      if (!newGrid[0][i].isStart && !newGrid[0][i].isEnd) {
        if (isWeightMaze) {
          newGrid[0][i].weight = 2;
        } else {
          newGrid[0][i].isWall = true;
        }
        newGrid[0][i].animationKey += 1;
      }
    }
    setGrid(newGrid);
    await sleep(10);
  }

  // 2. Left and right borders: Top to bottom simultaneously
  for (let row = 1; row < ROWS - 1; row += 4) {
    newGrid = newGrid.map((r) => r.map((n) => ({ ...n })));
    for (let r = row; r < Math.min(row + 4, ROWS - 1); r++) {
      if (!newGrid[r][0].isStart && !newGrid[r][0].isEnd) {
        if (isWeightMaze) {
          newGrid[r][0].weight = 2;
        } else {
          newGrid[r][0].isWall = true;
        }
        newGrid[r][0].animationKey += 1;
      }
      if (!newGrid[r][COLS - 1].isStart && !newGrid[r][COLS - 1].isEnd) {
        if (isWeightMaze) {
          newGrid[r][COLS - 1].weight = 2;
        } else {
          newGrid[r][COLS - 1].isWall = true;
        }
        newGrid[r][COLS - 1].animationKey += 1;
      }
    }
    setGrid(newGrid);
    await sleep(10);
  }

  // 3. Bottom border: Left and right to middle
  const middleCol = Math.floor(COLS / 2);
  for (let offset = 0; offset <= middleCol; offset += 3) {
    newGrid = newGrid.map((r) => r.map((n) => ({ ...n })));
    for (let i = offset; i < Math.min(offset + 3, middleCol + 1); i++) {
      const leftCol = i;
      const rightCol = COLS - 1 - i;
      if (
        leftCol <= middleCol &&
        !newGrid[ROWS - 1][leftCol].isStart &&
        !newGrid[ROWS - 1][leftCol].isEnd
      ) {
        if (isWeightMaze) {
          newGrid[ROWS - 1][leftCol].weight = 2;
        } else {
          newGrid[ROWS - 1][leftCol].isWall = true;
        }
        newGrid[ROWS - 1][leftCol].animationKey += 1;
      }
      if (
        rightCol >= middleCol &&
        !newGrid[ROWS - 1][rightCol].isStart &&
        !newGrid[ROWS - 1][rightCol].isEnd
      ) {
        if (isWeightMaze) {
          newGrid[ROWS - 1][rightCol].weight = 2;
        } else {
          newGrid[ROWS - 1][rightCol].isWall = true;
        }
        newGrid[ROWS - 1][rightCol].animationKey += 1;
      }
    }
    setGrid(newGrid);
    await sleep(10);
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
    for (let i = start; i <= end; i += 2) {
      if (i % 2 === 0) evens.push(i);
    }
    return evens;
  }

  function getOddInRange(start, end) {
    const odds = [];
    for (let i = start; i <= end; i += 2) {
      if (i % 2 !== 0) odds.push(i);
    }
    return odds;
  }

  async function recursiveDivide(rowStart, rowEnd, colStart, colEnd) {
    const width = colEnd - colStart + 1;
    const height = rowEnd - rowStart + 1;

    if (width < 3 || height < 3) {
      return;
    }

    let horizontal = width < height;
    if (skew === "vertical") {
      horizontal = Math.random() < 0.48; // 48% chance of horizontal wall
    } else if (skew === "horizontal") {
      horizontal = Math.random() < 0.52; // 52% chance of horizontal wall
    } else if (skew === "weight-recursive") {
      horizontal = width < height; // Same as "none" (unskewed)
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

      const updates = [];
      for (let col = colStart; col <= colEnd; col++) {
        if (
          col !== gapCol &&
          !newGrid[wallRow][col].isStart &&
          !newGrid[wallRow][col].isEnd
        ) {
          updates.push([wallRow, col]);
        }
      }

      for (let i = 0; i < updates.length; i += 4) {
        newGrid = newGrid.map((r) => r.map((n) => ({ ...n })));
        for (let j = i; j < Math.min(i + 4, updates.length); j++) {
          const [row, col] = updates[j];
          if (isWeightMaze) {
            newGrid[row][col].weight = 2;
          } else {
            newGrid[row][col].isWall = true;
          }
          newGrid[row][col].animationKey += 1;
        }
        setGrid(newGrid);
        await sleep(3);
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

      const updates = [];
      for (let row = rowStart; row <= rowEnd; row++) {
        if (
          row !== gapRow &&
          !newGrid[row][wallCol].isStart &&
          !newGrid[row][wallCol].isEnd
        ) {
          updates.push([row, wallCol]);
        }
      }

      for (let i = 0; i < updates.length; i += 4) {
        newGrid = newGrid.map((r) => r.map((n) => ({ ...n })));
        for (let j = i; j < Math.min(i + 4, updates.length); j++) {
          const [row, col] = updates[j];
          if (isWeightMaze) {
            newGrid[row][col].weight = 2;
          } else {
            newGrid[row][col].isWall = true;
          }
          newGrid[row][col].animationKey += 1;
        }
        setGrid(newGrid);
        await sleep(3);
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
        weight: node.isStart || node.isEnd ? 1 : isWeightMaze ? 1 : node.weight,
        animationKey: node.animationKey + 1,
      }))
    );
    setGrid(newGrid);
  } else {
    setGrid(newGrid);
  }
};
