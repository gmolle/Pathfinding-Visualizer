import { useState } from "react";
import { runAlgorithm, bfs } from "../utils/algorithms";
import { generateMaze } from "../utils/maze";

const ROWS = 21;
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
        isStart: row === 10 && col === 5,
        isEnd: row === 10 && col === 45,
        weight: 1,
        isWall: false,
        isVisited: false,
        isPath: false,
        isCurrent: false, // New property for current node highlight
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
  const [speed, setSpeed] = useState(10);
  const [mazeType, setMazeType] = useState("");
  const [dragging, setDragging] = useState(null); // null, "start", "end"

  // Reset grid
  const resetGrid = () => setGrid(createGrid());

  // Toggle weight mode (null <-> weight)
  const toggleWeightMode = () => {
    setMode((prevMode) => (prevMode === "weight" ? null : "weight"));
  };

  // Toggle eraser mode (eraser <-> previous mode)
  const toggleEraserMode = () => {
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
      setGrid(newGrid);
    } else if (mode === "weight" && !node.isStart && !node.isEnd) {
      node.weight = node.weight === 2 ? 1 : 2;
      node.isWall = false;
      setGrid(newGrid);
    } else if (!node.isStart && !node.isEnd) {
      node.isWall = !node.isWall;
      node.weight = 1;
      setGrid(newGrid);
    }
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed) return;
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
      setGrid(newGrid);
    } else if (
      mode === "weight" &&
      !node.isStart &&
      !node.isEnd &&
      !node.isWall &&
      node.weight !== 2
    ) {
      node.weight = 2;
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
      setGrid(newGrid);
    }
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
    setDragging(null);
  };

  // Run algorithm with animations
  const runPathfindingAlgorithm = () => {
    const startNode = grid.flat().find((node) => node.isStart);
    const endNode = grid.flat().find((node) => node.isEnd);
    if (!startNode || !endNode) return;

    const { visitedNodesInOrder, newGrid } = runAlgorithm(
      algorithm,
      grid,
      startNode,
      endNode
    );

    // Reset grid for animation
    setGrid(
      grid.map((row) =>
        row.map((node) => ({
          ...node,
          isVisited: false,
          isPath: false,
          isCurrent: false, // Reset isCurrent
        }))
      )
    );

    // Animate visited nodes with current node highlight
    visitedNodesInOrder.forEach((node, i) => {
      setTimeout(() => {
        setGrid((prevGrid) => {
          const updatedGrid = prevGrid.map((r) => r.map((n) => ({ ...n })));
          // Clear previous current node
          updatedGrid.forEach((r) => r.forEach((n) => (n.isCurrent = false)));
          // Set current node and visited status
          if (!node.isStart && !node.isEnd) {
            updatedGrid[node.row][node.col].isCurrent = true;
            updatedGrid[node.row][node.col].isVisited = true;
          }
          return updatedGrid;
        });
        // Clear isCurrent after a short delay
        setTimeout(() => {
          setGrid((prevGrid) => {
            const updatedGrid = prevGrid.map((r) => r.map((n) => ({ ...n })));
            if (!node.isStart && !node.isEnd) {
              updatedGrid[node.row][node.col].isCurrent = false;
            }
            return updatedGrid;
          });
        }, speed * 0.8); // Clear isCurrent before next node (80% of speed)
      }, speed * i);
    });

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
          }
          return updatedGrid;
        });
      }, speed * (i + visitedNodesInOrder.length));
    });
  };

  // Generate maze
  const generatePathfindingMaze = (skew) => {
    generateMaze(skew, grid, setGrid, bfs);
  };

  return {
    grid,
    mode,
    algorithm,
    speed,
    mazeType,
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
