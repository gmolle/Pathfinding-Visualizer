import { useState, useEffect } from "react";
import {
  runAlgorithm,
  runAlgorithmNoAnimation,
  bfs,
} from "../utils/algorithms";
import {
  generateMaze,
  generateRandomScatter,
  generateWeightRandomScatter,
} from "../utils/maze";

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
  const [algorithm, setAlgorithm] = useState("");
  const [speed, setSpeed] = useState(100); // Default 100ms
  const [mazeType, setMazeType] = useState("");
  const [dragging, setDragging] = useState(null); // null, "start", "end"
  const [isRunning, setIsRunning] = useState(false);
  const [timer, setTimer] = useState(0); // Timer in milliseconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [visitedNodes, setVisitedNodes] = useState(0);
  const [pathLength, setPathLength] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [hasPathfindingResult, setHasPathfindingResult] = useState(false);
  const [isDraggingUpdate, setIsDraggingUpdate] = useState(false);

  // Timer logic for animations
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      const startTime = Date.now();
      interval = setInterval(() => {
        setTimer(Date.now() - startTime);
      }, 10); // Update every 10ms for smooth display
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Reset grid
  const resetGrid = () => {
    if (isRunning) return;
    setGrid(createGrid());
    setTimer(0);
    setIsTimerRunning(false);
    setVisitedNodes(0);
    setPathLength(0);
    setTotalCost(0);
    setHasPathfindingResult(false);
    setIsDraggingUpdate(false);
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
      node.isVisited = false;
      node.weight = 1;
      node.isWall = false;
      if (hasPathfindingResult) {
        const startNode = newGrid[row][col];
        const endNode = newGrid.flat().find((n) => n.isEnd);
        if (startNode && endNode) {
          setIsDraggingUpdate(true);
          const {
            visitedNodesInOrder,
            newGrid: updatedGrid,
            shortestPath,
            totalCost,
          } = runAlgorithmNoAnimation(algorithm, newGrid, startNode, endNode);
          updatedGrid[startNode.row][startNode.col].isVisited = false;
          updatedGrid[endNode.row][endNode.col].isVisited = false;
          const visitedBatchSize = 6;
          const pathBatchSize = 1;
          const visitedSleep = speed;
          const pathSleep = 50;
          const filteredVisitedNodes = (visitedNodesInOrder || []).filter(
            (n) => !n.isStart && !n.isEnd
          );
          let endNodeFound = false;
          let endNodeBatchIndex = -1;
          filteredVisitedNodes.forEach((node, index) => {
            if (node.isEnd && !endNodeFound) {
              endNodeFound = true;
              endNodeBatchIndex = Math.floor(index / visitedBatchSize);
            }
          });
          const animationDuration =
            (endNodeFound
              ? visitedSleep * (endNodeBatchIndex + 1)
              : visitedSleep *
                Math.ceil(filteredVisitedNodes.length / visitedBatchSize)) +
            pathSleep * Math.ceil((shortestPath || []).length / pathBatchSize);
          setGrid(updatedGrid);
          setVisitedNodes(filteredVisitedNodes.length);
          setPathLength(
            shortestPath && shortestPath.length > 0
              ? shortestPath.length - 1
              : 0
          );
          setTotalCost(totalCost || 0);
          setTimer(animationDuration);
        }
      } else {
        setGrid(newGrid);
      }
    } else if (
      dragging === "end" &&
      !node.isWall &&
      node.weight === 1 &&
      !node.isStart
    ) {
      newGrid.forEach((r) => r.forEach((n) => (n.isEnd = false)));
      node.isEnd = true;
      node.isVisited = false;
      node.weight = 1;
      node.isWall = false;
      if (hasPathfindingResult) {
        const startNode = newGrid.flat().find((n) => n.isStart);
        const endNode = newGrid[row][col];
        if (startNode && endNode) {
          setIsDraggingUpdate(true);
          const {
            visitedNodesInOrder,
            newGrid: updatedGrid,
            shortestPath,
            totalCost,
          } = runAlgorithmNoAnimation(algorithm, newGrid, startNode, endNode);
          updatedGrid[startNode.row][startNode.col].isVisited = false;
          updatedGrid[endNode.row][endNode.col].isVisited = false;
          const visitedBatchSize = 6;
          const pathBatchSize = 1;
          const visitedSleep = speed;
          const pathSleep = 50;
          const filteredVisitedNodes = (visitedNodesInOrder || []).filter(
            (n) => !n.isStart && !n.isEnd
          );
          let endNodeFound = false;
          let endNodeBatchIndex = -1;
          filteredVisitedNodes.forEach((node, index) => {
            if (node.isEnd && !endNodeFound) {
              endNodeFound = true;
              endNodeBatchIndex = Math.floor(index / visitedBatchSize);
            }
          });
          const animationDuration =
            (endNodeFound
              ? visitedSleep * (endNodeBatchIndex + 1)
              : visitedSleep *
                Math.ceil(filteredVisitedNodes.length / visitedBatchSize)) +
            pathSleep * Math.ceil((shortestPath || []).length / pathBatchSize);
          setGrid(updatedGrid);
          setVisitedNodes(filteredVisitedNodes.length);
          setPathLength(
            shortestPath && shortestPath.length > 0
              ? shortestPath.length - 1
              : 0
          );
          setTotalCost(totalCost || 0);
          setTimer(animationDuration);
        }
      } else {
        setGrid(newGrid);
      }
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
    setTimer(0);
    setIsTimerRunning(true);
    setVisitedNodes(0);
    setPathLength(0);
    setTotalCost(0);
    setIsDraggingUpdate(false);
    const startNode = grid.flat().find((node) => node.isStart);
    const endNode = grid.flat().find((node) => node.isEnd);
    if (!startNode || !endNode) {
      setIsRunning(false);
      setIsTimerRunning(false);
      return;
    }

    const { visitedNodesInOrder, newGrid, shortestPath, totalCost } =
      runAlgorithm(algorithm, grid, startNode, endNode);

    // Handle invalid algorithm output
    if (!visitedNodesInOrder || !Array.isArray(visitedNodesInOrder)) {
      console.error(
        `Invalid visitedNodesInOrder for algorithm: ${algorithm}`,
        visitedNodesInOrder
      );
      setGrid(
        grid.map((row) =>
          row.map((node) => ({
            ...node,
            isVisited: false,
            isPath: false,
            isCurrent: false,
            animationKey: 0,
          }))
        )
      );
      setIsRunning(false);
      setIsTimerRunning(false);
      setHasPathfindingResult(false);
      return;
    }

    // Filter out start and end nodes
    const filteredVisitedNodes = visitedNodesInOrder.filter(
      (node) => !node.isStart && !node.isEnd
    );

    // Calculate metrics
    const visitedCount = filteredVisitedNodes.length;

    // Reset grid for animation, preserving walls and weights
    setGrid(
      grid.map((row) =>
        row.map((node) => {
          if (node.isWall || node.weight > 1) return node;
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
    const visitedSleep = speed;
    const pathSleep = 50;

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

    // Animate visited nodes
    let endNodeFound = false;
    let endNodeBatchIndex = -1;

    for (let i = 0; i < filteredVisitedNodes.length; i += visitedBatchSize) {
      setTimeout(() => {
        setGrid((prevGrid) => {
          const updatedGrid = prevGrid.map((r) =>
            r.map((n) => ({
              ...n,
              isCurrent: false,
            }))
          );
          for (
            let j = i;
            j < Math.min(i + visitedBatchSize, filteredVisitedNodes.length);
            j++
          ) {
            const node = filteredVisitedNodes[j];
            if (!node.isStart && !node.isEnd) {
              updatedGrid[node.row][node.col].isVisited = true;
              updatedGrid[node.row][node.col].animationKey += 1;
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
            if (node.isEnd && !endNodeFound) {
              endNodeFound = true;
              endNodeBatchIndex = Math.floor(i / visitedBatchSize);
            }
          }
          return updatedGrid;
        });
      }, visitedSleep * Math.floor(i / visitedBatchSize));
    }

    // Clear isCurrent
    setTimeout(() => {
      setGrid((prevGrid) => {
        const updatedGrid = prevGrid.map((r) =>
          r.map((n) => ({
            ...n,
            isCurrent: false,
          }))
        );
        return updatedGrid;
      });
    }, visitedSleep * Math.ceil(filteredVisitedNodes.length / visitedBatchSize));

    // Animate shortest path
    if (
      shortestPath &&
      Array.isArray(shortestPath) &&
      shortestPath.length > 0
    ) {
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
        }, (endNodeFound ? visitedSleep * (endNodeBatchIndex + 1) : visitedSleep * Math.ceil(filteredVisitedNodes.length / visitedBatchSize)) + pathSleep * Math.floor(i / pathBatchSize));
      }
    }

    // Update metrics
    setTimeout(() => {
      setVisitedNodes(visitedCount);
      setPathLength(
        shortestPath && shortestPath.length > 0 ? shortestPath.length - 1 : 0
      );
      setTotalCost(totalCost || 0);
      setIsRunning(false);
      setIsTimerRunning(false);
      setHasPathfindingResult(true);
    }, (endNodeFound ? visitedSleep * (endNodeBatchIndex + 1) : visitedSleep * Math.ceil(filteredVisitedNodes.length / visitedBatchSize)) + pathSleep * Math.ceil((shortestPath && Array.isArray(shortestPath) ? shortestPath.length : 0) / pathBatchSize));
  };

  // Generate maze
  const generatePathfindingMaze = async (mazeType) => {
    if (isRunning) return;
    setIsRunning(true);
    setTimer(0);
    setIsTimerRunning(false);
    setVisitedNodes(0);
    setPathLength(0);
    setTotalCost(0);
    setHasPathfindingResult(false);
    setIsDraggingUpdate(false);
    if (mazeType === "random-scatter") {
      await generateRandomScatter(grid, setGrid, bfs);
    } else if (mazeType === "weight-random-scatter") {
      await generateWeightRandomScatter(grid, setGrid, bfs);
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
    timer,
    visitedNodes,
    pathLength,
    totalCost,
    isDraggingUpdate,
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
