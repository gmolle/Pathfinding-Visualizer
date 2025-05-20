// usePathfinding.js
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
  const [isRunning, setIsRunning] = useState(false);

  // Reset grid
  const resetGrid = () => {
    if (isRunning) return;
    setGrid(createGrid());
  };

  // Toggle weight mode
  const toggleWeightMode = () => {
    if (isRunning) return;
    setMode((prevMode) => (prevMode === "weight" ? null : "weight"));
  };

  // Toggle eraser mode
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

    // Filter out start node from visitedNodesInOrder to avoid animating it
    const filteredVisitedNodes = visitedNodesInOrder.filter(
      (node) => !node.isStart
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

    // Batching parameters
    const visitedBatchSize = 6;
    const pathBatchSize = 1;
    const visitedSleep = 50; // 50ms/batch, ~10ms/node
    const pathSleep = 50; // 50ms/node

    // Helper to check if a node is an immediate neighbor of the start node
    const isStartNeighbor = (node) => {
      return (
        node.row >= startNode.row - 1 &&
        node.row <= startNode.row + 1 &&
        node.col >= startNode.col - 1 &&
        node.col <= startNode.col + 1 &&
        !(node.row === startNode.row && node.col === startNode.col)
      );
    };

    // Trace shortest path (will be used when end node is found)
    const shortestPath = [];
    let currentNode = newGrid[endNode.row][endNode.col];
    while (currentNode && currentNode.previousNode) {
      shortestPath.push(currentNode);
      currentNode = currentNode.previousNode;
    }
    shortestPath.reverse();

    let endNodeFound = false;
    let endNodeBatchIndex = -1;

    // Animate visited nodes in batches
    for (let i = 0; i < filteredVisitedNodes.length; i += visitedBatchSize) {
      setTimeout(() => {
        setGrid((prevGrid) => {
          const updatedGrid = prevGrid.map((r) =>
            r.map((n) => ({
              ...n,
              isCurrent: false, // Clear isCurrent for all nodes
            }))
          );
          // Process batch of nodes
          for (
            let j = i;
            j < Math.min(i + visitedBatchSize, filteredVisitedNodes.length);
            j++
          ) {
            const node = filteredVisitedNodes[j];
            if (!node.isStart && !node.isEnd) {
              updatedGrid[node.row][node.col].isVisited = true;
              updatedGrid[node.row][node.col].animationKey += 1;
              // Set isCurrent for the last node in the batch (single highlight)
              if (
                j ===
                  Math.min(
                    i + visitedBatchSize - 1,
                    filteredVisitedNodes.length - 1
                  ) &&
                !isStartNeighbor(node)
              ) {
                updatedGrid[node.row][node.col].isCurrent = true;
              }
            }
            // Check if end node is in this batch
            if (node.isEnd && !endNodeFound) {
              endNodeFound = true;
              endNodeBatchIndex = i / visitedBatchSize;
            }
          }
          return updatedGrid;
        });
      }, visitedSleep * (i / visitedBatchSize));
    }

    // Clear any remaining isCurrent after visited nodes
    setTimeout(() => {
      setGrid((prevGrid) => {
        const updatedGrid = prevGrid.map((r) =>
          r.map((n) => ({
            ...n,
            isCurrent: false, // Ensure no isCurrent nodes remain
          }))
        );
        return updatedGrid;
      });
    }, visitedSleep * Math.ceil(filteredVisitedNodes.length / visitedBatchSize));

    // Animate shortest path in batches when end node is found
    if (shortestPath.length > 0) {
      for (let i = 0; i < shortestPath.length; i += pathBatchSize) {
        setTimeout(() => {
          setGrid((prevGrid) => {
            const updatedGrid = prevGrid.map((r) => r.map((n) => ({ ...n })));
            for (
              let j = i;
              j < Math.min(i + pathBatchSize, shortestPath.length);
              j++
            ) {
              const node = shortestPath[j];
              if (!node.isStart && !node.isEnd) {
                updatedGrid[node.row][node.col].isPath = true;
                updatedGrid[node.row][node.col].animationKey += 1;
              }
            }
            return updatedGrid;
          });
        }, (endNodeFound ? visitedSleep * (endNodeBatchIndex + 1) : visitedSleep * Math.ceil(filteredVisitedNodes.length / visitedBatchSize)) + pathSleep * (i / pathBatchSize));
      }
    }

    // End running state after all animations
    setTimeout(() => {
      setIsRunning(false);
    }, (endNodeFound ? visitedSleep * (endNodeBatchIndex + 1) : visitedSleep * Math.ceil(filteredVisitedNodes.length / visitedBatchSize)) + pathSleep * Math.ceil(shortestPath.length / pathBatchSize));
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
