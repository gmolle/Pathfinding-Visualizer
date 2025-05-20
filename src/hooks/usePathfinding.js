import { useState } from "react";
import { runAlgorithm, bfs } from "../utils/algorithms";
import { generateMaze, generateRandomScatter } from "../utils/maze";

const ROWS = 31;
const COLS = 51;

// Initialize grid
const createGrid = () => {
  const grid = [];
  for (let row = 0; row < ROWS; row++) {
    const currentRow = [];
    for (let col = 0; col < COLS; col++) {
      currentRow.push({
        row,
        col,
        isStart: row === 15 && col === 10,
        isEnd: row === 15 && col === 40,
        weight: 1,
        isWall: false,
        isVisited: false,
        isPath: false,
        isCurrent: false,
        animationKey: 0,
        distance: Infinity,
        fScore: Infinity,
        previousNode: null,
      });
    }
    grid.push(currentRow);
  }
  return grid;
};

export const usePathfinding = () => {
  const [grid, setGrid] = useState(createGrid());
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [mode, setMode] = useState(null); // null (walls), "weight", "eraser"
  const [prevMode, setPrevMode] = useState(null);
  const [algorithm, setAlgorithm] = useState("dijkstra");
  const [speed, setSpeed] = useState(100); // For pulse visibility
  const [mazeType, setMazeType] = useState("");
  const [dragging, setDragging] = useState(null); // null, "start", "end"
  const [isRunning, setIsRunning] = useState(false); // Track running state

  // Reset grid
  const resetGrid = () => {
    if (isRunning) return;
    setGrid(createGrid());
  };

  // Toggle weight mode (null <-> weight)
  const toggleWeightMode = () => {
    if (isRunning) return;
    setMode((prevMode) => (prevMode === "weight" ? null : "weight"));
  };

  // Toggle eraser mode (eraser <-> previous mode)
  const toggleEraserMode = () => {
    if (isRunning) return;
    setMode((currentMode) => {
      if (currentMode === "eraser") {
        return prevMode;
      } else {
        setPrevMode(currentMode);
        return "eraser";
      }
    });
  };

  // Handle mouse interactions
  const handleMouseDown = (row, col) => {
    if (isRunning) return;
    setMouseIsPressed(true);
    const newGrid = grid.map((r) => r.map((n) => ({ ...n })));
    const node = newGrid[row][col];

    if (node.isStart) {
      setDragging("start");
    } else if (node.isEnd) {
      setDragging("end");
    } else if (mode === "eraser") {
      node.isWall = false;
      node.weight = 1;
      node.animationKey += 1;
      setGrid(newGrid);
    } else if (mode === "weight" && !node.isStart && !node.isEnd) {
      node.weight = node.weight === 2 ? 1 : 2;
      node.isWall = false;
      node.animationKey += 1;
      setGrid(newGrid);
    } else if (!node.isStart && !node.isEnd) {
      node.isWall = !node.isWall;
      node.weight = 1;
      node.animationKey += 1;
      setGrid(newGrid);
    }
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed || isRunning) return;
    const newGrid = grid.map((r) => r.map((n) => ({ ...n })));
    const node = newGrid[row][col];

    if (
      dragging === "start" &&
      !node.isWall &&
      node.weight === 1 &&
      !node.isEnd
    ) {
      newGrid.forEach((r) => r.forEach((n) => (n.isStart = false)));
      node.isStart = true;
      node.weight = 1;
      node.isWall = false;
      setGrid(newGrid);
    } else if (
      dragging === "end" &&
      !node.isWall &&
      node.weight === 1 &&
      !node.isStart
    ) {
      newGrid.forEach((r) => r.forEach((n) => (n.isEnd = false)));
      node.isEnd = true;
      node.weight = 1;
      node.isWall = false;
      setGrid(newGrid);
    } else if (mode === "eraser" && !node.isStart && !node.isEnd) {
      node.isWall = false;
      node.weight = 1;
      node.animationKey += 1;
      setGrid(newGrid);
    } else if (
      mode === "weight" &&
      !node.isStart &&
      !node.isEnd &&
      !node.isWall &&
      node.weight !== 2
    ) {
      node.weight = 2;
      node.animationKey += 1;
      setGrid(newGrid);
    } else if (
      mode === null &&
      !node.isStart &&
      !node.isEnd &&
      !node.isWall &&
      node.weight === 1
    ) {
      node.isWall = true;
      node.weight = 1;
      node.animationKey += 1;
      setGrid(newGrid);
    }
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
    setDragging(null);
  };

  // Run algorithm with animations
  const runPathfindingAlgorithm = () => {
    if (isRunning) return;
    setIsRunning(true);
    const startNode = grid.flat().find((node) => node.isStart);
    const endNode = grid.flat().find((node) => node.isEnd);
    if (!startNode || !endNode) {
      setIsRunning(false);
      return;
    }

    const { visitedNodesInOrder, newGrid } = runAlgorithm(
      algorithm,
      grid,
      startNode,
      endNode
    );

    // Reset grid for animation
    setGrid(
      grid.map((row) =>
        row.map((node) => {
          if (node.isWall) return node;

          return {
            ...node,
            isVisited: false,
            isPath: false,
            isCurrent: false,
            animationKey: 0,
          };
        })
      )
    );

    // Number of nodes to highlight simultaneously
    const highlightWindow = 3;

    // Animate visited nodes with current node highlight
    visitedNodesInOrder.forEach((node, i) => {
      setTimeout(() => {
        setGrid((prevGrid) => {
          const updatedGrid = prevGrid.map((r) => r.map((n) => ({ ...n })));
          // Clear isCurrent for nodes outside the highlight window
          if (i >= highlightWindow) {
            const oldNode = visitedNodesInOrder[i - highlightWindow];
            if (!oldNode.isStart && !oldNode.isEnd) {
              updatedGrid[oldNode.row][oldNode.col].isCurrent = false;
              updatedGrid[oldNode.row][oldNode.col].animationKey += 1;
            }
          }
          // Set current node and visited status
          if (!node.isStart && !node.isEnd) {
            updatedGrid[node.row][node.col].isCurrent = true;
            updatedGrid[node.row][node.col].isVisited = true;
            updatedGrid[node.row][node.col].animationKey += 1;
          }
          return updatedGrid;
        });
      }, speed * i);
    });

    // Clear remaining isCurrent after visited nodes animation
    setTimeout(() => {
      setGrid((prevGrid) => {
        const updatedGrid = prevGrid.map((r) => r.map((n) => ({ ...n })));
        updatedGrid.forEach((r) => r.forEach((n) => (n.isCurrent = false)));
        return updatedGrid;
      });
    }, speed * visitedNodesInOrder.length);

    // Trace shortest path
    const shortestPath = [];
    let currentNode = newGrid[endNode.row][endNode.col];
    while (currentNode && currentNode.previousNode) {
      shortestPath.push(currentNode);
      currentNode = currentNode.previousNode;
    }

    // Animate shortest path
    shortestPath.reverse().forEach((node, i) => {
      setTimeout(() => {
        setGrid((prevGrid) => {
          const updatedGrid = prevGrid.map((r) => r.map((n) => ({ ...n })));
          if (!node.isStart && !node.isEnd) {
            updatedGrid[node.row][node.col].isPath = true;
            updatedGrid[node.row][node.col].animationKey += 1;
          }
          return updatedGrid;
        });
      }, speed * (i + visitedNodesInOrder.length));
    });

    // End running state after all animations
    setTimeout(() => {
      setIsRunning(false);
    }, speed * (visitedNodesInOrder.length + shortestPath.length));
  };

  // Generate maze
  const generatePathfindingMaze = async (mazeType) => {
    if (isRunning) return;
    setIsRunning(true);
    if (mazeType === "random-scatter") {
      await generateRandomScatter(grid, setGrid, bfs);
    } else {
      await generateMaze(mazeType, grid, setGrid, bfs);
    }
    setIsRunning(false);
  };

  return {
    grid,
    mode,
    algorithm,
    speed,
    mazeType,
    isRunning,
    resetGrid,
    toggleWeightMode,
    toggleEraserMode,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    setAlgorithm,
    setSpeed,
    setMazeType,
    runPathfindingAlgorithm,
    generatePathfindingMaze,
  };
};
