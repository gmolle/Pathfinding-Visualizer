// src/hooks/usePathfinding.js
import { useState } from "react";
import { runAlgorithm, bfs } from "../utils/algorithms"; // Add bfs import
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
  const [mode, setMode] = useState(null); // null (walls), "weight"
  const [algorithm, setAlgorithm] = useState("dijkstra"); // "dijkstra", "astar", "bfs"
  const [speed, setSpeed] = useState(10); // Animation speed (ms)
  const [mazeType, setMazeType] = useState(""); // "none", "horizontal", "vertical"
  const [dragging, setDragging] = useState(null); // null, "start", "end"

  // Reset grid
  const resetGrid = () => setGrid(createGrid());

  // Toggle weight mode
  const toggleWeightMode = () => {
    setMode((prevMode) => (prevMode === "weight" ? null : "weight"));
  };

  // Handle mouse interactions
  const handleMouseDown = (row, col) => {
    setMouseIsPressed(true);
    const newGrid = grid.map((r) => r.map((n) => ({ ...n })));
    console.log(
      `MouseDown: row=${row}, col=${col}, mode=${mode}, dragging=${dragging}`
    );

    if (newGrid[row][col].isStart) {
      setDragging("start");
    } else if (newGrid[row][col].isEnd) {
      setDragging("end");
    } else if (
      mode === "weight" &&
      !newGrid[row][col].isStart &&
      !newGrid[row][col].isEnd &&
      !newGrid[row][col].isWall
    ) {
      newGrid[row][col].weight = newGrid[row][col].weight === 2 ? 1 : 2;
      setGrid(newGrid);
    } else if (
      !newGrid[row][col].isStart &&
      !newGrid[row][col].isEnd &&
      newGrid[row][col].weight === 1
    ) {
      newGrid[row][col].isWall = !newGrid[row][col].isWall;
      setGrid(newGrid);
    }
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed) return;
    console.log(
      `MouseEnter: row=${row}, col=${col}, mode=${mode}, dragging=${dragging}`
    );
    const newGrid = grid.map((r) => r.map((n) => ({ ...n })));

    if (
      dragging === "start" &&
      !newGrid[row][col].isWall &&
      newGrid[row][col].weight === 1 &&
      !newGrid[row][col].isEnd
    ) {
      newGrid.forEach((r) => r.forEach((node) => (node.isStart = false)));
      newGrid[row][col].isStart = true;
      newGrid[row][col].weight = 1;
      newGrid[row][col].isWall = false;
      setGrid(newGrid);
    } else if (
      dragging === "end" &&
      !newGrid[row][col].isWall &&
      newGrid[row][col].weight === 1 &&
      !newGrid[row][col].isStart
    ) {
      newGrid.forEach((r) => r.forEach((node) => (node.isEnd = false)));
      newGrid[row][col].isEnd = true;
      newGrid[row][col].weight = 1;
      newGrid[row][col].isWall = false;
      setGrid(newGrid);
    } else if (
      mode === "weight" &&
      !newGrid[row][col].isStart &&
      !newGrid[row][col].isEnd &&
      !newGrid[row][col].isWall
    ) {
      newGrid[row][col].weight = newGrid[row][col].weight === 2 ? 1 : 2;
      setGrid(newGrid);
    } else if (
      !newGrid[row][col].isStart &&
      !newGrid[row][col].isEnd &&
      newGrid[row][col].weight === 1
    ) {
      newGrid[row][col].isWall = !newGrid[row][col].isWall;
      newGrid[row][col].weight = 1;
      setGrid(newGrid);
    }
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
    setDragging(null);
    console.log("MouseUp");
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
        }))
      )
    );

    // Animate visited nodes
    visitedNodesInOrder.forEach((node, i) => {
      setTimeout(() => {
        setGrid((prevGrid) => {
          const updatedGrid = prevGrid.map((r) => r.map((n) => ({ ...n })));
          if (!node.isStart && !node.isEnd) {
            updatedGrid[node.row][node.col].isVisited = true;
          }
          return updatedGrid;
        });
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
    generateMaze(skew, grid, setGrid, bfs); // Pass bfs
  };

  return {
    grid,
    mode,
    algorithm,
    speed,
    mazeType,
    resetGrid,
    toggleWeightMode,
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
