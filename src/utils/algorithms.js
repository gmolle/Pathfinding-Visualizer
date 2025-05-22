// Helper function to calculate heuristic
const heuristic = (nodeA, nodeB) => {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
};

// Helper function to get neighbors
const getNeighbors = (node, grid, allowDiagonal = false) => {
  const neighbors = [];
  const { row, col } = node;
  const directions = [
    { row: -1, col: 0 }, // up
    { row: 1, col: 0 }, // down
    { row: 0, col: -1 }, // left
    { row: 0, col: 1 }, // right
  ];

  if (allowDiagonal) {
    directions.push(
      { row: -1, col: -1 },
      { row: -1, col: 1 },
      { row: 1, col: -1 },
      { row: 1, col: 1 }
    );
  }

  for (const direction of directions) {
    const newRow = row + direction.row;
    const newCol = col + direction.col;
    if (
      newRow >= 0 &&
      newRow < grid.length &&
      newCol >= 0 &&
      newCol < grid[0].length &&
      !grid[newRow][newCol].isWall
    ) {
      neighbors.push(grid[newRow][newCol]);
    }
  }
  return neighbors;
};

// BFS
export const bfs = (grid, startNode, endNode) => {
  if (!startNode || !endNode || !grid || !grid.length || !grid[0].length) {
    return {
      visitedNodesInOrder: [],
      newGrid: grid,
      shortestPath: [],
      totalCost: 0,
    };
  }

  // Create a deep copy of the grid to avoid mutating input
  const workingGrid = grid.map((row) => row.map((node) => ({ ...node })));
  const localStartNode = workingGrid[startNode.row][startNode.col];
  const localEndNode = workingGrid[endNode.row][endNode.col];

  const visitedNodesInOrder = [];
  const queue = [localStartNode];
  const visited = new Set([`${localStartNode.row}-${localStartNode.col}`]);
  localStartNode.isVisited = true;
  visitedNodesInOrder.push(localStartNode);

  while (queue.length > 0) {
    const currentNode = queue.shift();
    if (currentNode === localEndNode) break;

    const neighbors = getNeighbors(currentNode, workingGrid);
    for (const neighbor of neighbors) {
      const key = `${neighbor.row}-${neighbor.col}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push(neighbor);
        neighbor.isVisited = true;
        neighbor.previousNode = currentNode;
        visitedNodesInOrder.push(neighbor);
      }
    }
  }

  // Reconstruct the shortest path
  const shortestPath = [];
  let totalCost = 0;
  let currentNode = workingGrid[endNode.row][endNode.col];
  if (!currentNode.previousNode && currentNode !== localStartNode) {
    // End node was not reached
    return {
      visitedNodesInOrder,
      newGrid: grid.map((row) => row.map((node) => ({ ...node }))),
      shortestPath: [],
      totalCost: 0,
    };
  }

  while (currentNode) {
    shortestPath.push(currentNode);
    totalCost += currentNode.weight || 1; // Default weight to 1 if not specified
    currentNode = currentNode.previousNode;
  }
  shortestPath.reverse();

  // Create a new grid for output and mark the path
  const newGrid = grid.map((row) =>
    row.map((node) => ({ ...node, isPath: false }))
  );
  shortestPath.forEach((node) => {
    if (!node.isStart && !node.isEnd) {
      newGrid[node.row][node.col].isPath = true;
    }
  });

  return { visitedNodesInOrder, newGrid, shortestPath, totalCost };
};

// Dijkstra
export const dijkstra = (grid, startNode, endNode) => {
  if (!startNode || !endNode || !grid || !grid.length || !grid[0].length) {
    return {
      visitedNodesInOrder: [],
      newGrid: grid,
      shortestPath: [],
      totalCost: 0,
    };
  }

  const visitedNodesInOrder = [];
  const unvisitedNodes = grid.flat();
  startNode.distance = 0;
  const visited = new Set();

  while (unvisitedNodes.length > 0) {
    unvisitedNodes.sort((a, b) => a.distance - b.distance);
    const closestNode = unvisitedNodes.shift();

    if (closestNode.isWall) continue;
    if (closestNode.distance === Infinity) break;

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    visited.add(`${closestNode.row}-${closestNode.col}`);

    if (closestNode === endNode) break;

    const neighbors = getNeighbors(closestNode, grid);
    for (const neighbor of neighbors) {
      if (!visited.has(`${neighbor.row}-${neighbor.col}`)) {
        const newDistance = closestNode.distance + neighbor.weight;
        if (newDistance < neighbor.distance) {
          neighbor.distance = newDistance;
          neighbor.previousNode = closestNode;
        }
      }
    }
  }

  const newGrid = grid.map((row) => row.map((node) => ({ ...node })));
  const shortestPath = [];
  let totalCost = 0;
  let currentNode = newGrid[endNode.row][endNode.col];
  while (currentNode && currentNode.previousNode) {
    shortestPath.push(currentNode);
    totalCost += currentNode.weight;
    currentNode = currentNode.previousNode;
  }
  if (currentNode && currentNode.isStart) {
    shortestPath.push(currentNode);
    totalCost += currentNode.weight;
  }
  shortestPath.reverse();

  shortestPath.forEach((node) => {
    if (!node.isStart && !node.isEnd) {
      newGrid[node.row][node.col].isPath = true;
    }
  });

  return { visitedNodesInOrder, newGrid, shortestPath, totalCost };
};

// Bidirectional BFS
export const bidirectionalBFS = (grid, startNode, endNode) => {
  if (!startNode || !endNode || !grid || !grid.length || !grid[0].length) {
    return {
      visitedNodesInOrder: [],
      newGrid: grid,
      shortestPath: [],
      totalCost: 0,
    };
  }

  if (startNode === endNode) {
    const newGrid = grid.map((row) => row.map((node) => ({ ...node })));
    return {
      visitedNodesInOrder: [startNode],
      newGrid,
      shortestPath: [startNode],
      totalCost: startNode.weight,
    };
  }

  const queueStart = [startNode];
  const queueEnd = [endNode];
  const visitedStart = new Set([`${startNode.row}-${startNode.col}`]);
  const visitedEnd = new Set([`${endNode.row}-${endNode.col}`]);
  const parentStart = new Map();
  const parentEnd = new Map();
  const visitedNodesInOrder = [startNode, endNode];

  const newGrid = grid.map((row) => row.map((node) => ({ ...node })));
  newGrid[startNode.row][startNode.col].isVisited = true;
  newGrid[endNode.row][endNode.col].isVisited = true;

  let intersectionNode = null;

  while (queueStart.length > 0 && queueEnd.length > 0) {
    const currentStart = queueStart.shift();
    const neighborsStart = getNeighbors(currentStart, newGrid);

    for (const neighbor of neighborsStart) {
      const key = `${neighbor.row}-${neighbor.col}`;
      if (!visitedStart.has(key)) {
        visitedStart.add(key);
        queueStart.push(neighbor);
        parentStart.set(key, currentStart);
        newGrid[neighbor.row][neighbor.col].isVisited = true;
        visitedNodesInOrder.push(neighbor);

        if (visitedEnd.has(key)) {
          intersectionNode = neighbor;
          break;
        }
      }
    }

    if (intersectionNode) break;

    const currentEnd = queueEnd.shift();
    const neighborsEnd = getNeighbors(currentEnd, newGrid);

    for (const neighbor of neighborsEnd) {
      const key = `${neighbor.row}-${neighbor.col}`;
      if (!visitedEnd.has(key)) {
        visitedEnd.add(key);
        queueEnd.push(neighbor);
        parentEnd.set(key, currentEnd);
        newGrid[neighbor.row][neighbor.col].isVisited = true;
        visitedNodesInOrder.push(neighbor);

        if (visitedStart.has(key)) {
          intersectionNode = neighbor;
          break;
        }
      }
    }

    if (intersectionNode) break;
  }

  let shortestPath = [];
  let totalCost = 0;

  if (intersectionNode) {
    let current = intersectionNode;
    while (current && current !== startNode) {
      const key = `${current.row}-${current.col}`;
      shortestPath.push(current);
      totalCost += current.weight;
      const parent = parentStart.get(key);
      if (!parent) break;
      current = parent;
    }
    if (current === startNode) {
      shortestPath.push(startNode);
      totalCost += startNode.weight;
    }
    shortestPath.reverse();

    current = parentEnd.get(`${intersectionNode.row}-${intersectionNode.col}`);
    while (current && current !== endNode) {
      const key = `${current.row}-${current.col}`;
      shortestPath.push(current);
      totalCost += current.weight;
      const parent = parentEnd.get(key);
      if (!parent) break;
      current = parent;
    }
    if (current === endNode) {
      shortestPath.push(endNode);
      totalCost += endNode.weight;
    }

    shortestPath.forEach((node) => {
      if (!node.isStart && !node.isEnd) {
        newGrid[node.row][node.col].isPath = true;
      }
    });
  }

  return { visitedNodesInOrder, newGrid, shortestPath, totalCost };
};

// Greedy Best-First
export const greedyBestFirst = (grid, startNode, endNode) => {
  if (!startNode || !endNode || !grid || !grid.length || !grid[0].length) {
    return {
      visitedNodesInOrder: [],
      newGrid: grid,
      shortestPath: [],
      totalCost: 0,
    };
  }

  const visitedNodesInOrder = [];
  const openSet = [];
  startNode.hScore = heuristic(startNode, endNode);
  openSet.push(startNode);
  const visited = new Set();

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.hScore - b.hScore);
    const currentNode = openSet.shift();

    if (currentNode.isWall) continue;
    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);
    visited.add(`${currentNode.row}-${currentNode.col}`);

    if (currentNode === endNode) break;

    const neighbors = getNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      const key = `${neighbor.row}-${neighbor.col}`;
      if (!visited.has(key)) {
        visited.add(key);
        neighbor.hScore = heuristic(neighbor, endNode);
        neighbor.previousNode = currentNode;
        openSet.push(neighbor);
      }
    }
  }

  const newGrid = grid.map((row) => row.map((node) => ({ ...node })));
  const shortestPath = [];
  let totalCost = 0;
  let currentNode = newGrid[endNode.row][endNode.col];
  while (currentNode && currentNode.previousNode) {
    shortestPath.push(currentNode);
    totalCost += currentNode.weight;
    currentNode = currentNode.previousNode;
  }
  if (currentNode && currentNode.isStart) {
    shortestPath.push(currentNode);
    totalCost += currentNode.weight;
  }
  shortestPath.reverse();

  shortestPath.forEach((node) => {
    if (!node.isStart && !node.isEnd) {
      newGrid[node.row][node.col].isPath = true;
    }
  });

  return { visitedNodesInOrder, newGrid, shortestPath, totalCost };
};

// DFS
export const dfs = (grid, startNode, endNode) => {
  if (!startNode || !endNode || !grid || !grid.length || !grid[0].length) {
    return {
      visitedNodesInOrder: [],
      newGrid: grid,
      shortestPath: [],
      totalCost: 0,
    };
  }

  // Create a deep copy of the grid
  const newGrid = grid.map((row) =>
    row.map((node) => ({
      ...node,
      isVisited: false,
      isPath: false,
      previousNode: null,
    }))
  );

  const stack = [newGrid[startNode.row][startNode.col]];
  const visitedNodesInOrder = [];

  while (stack.length) {
    const currentNode = stack.pop();

    if (currentNode.isVisited) continue; // Skip if already visited

    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);

    if (currentNode === newGrid[endNode.row][endNode.col]) break;

    const { row, col } = currentNode;
    const neighbors = [];

    // Maintain original neighbor order: left, down, right, up
    if (col > 0) neighbors.push(newGrid[row][col - 1]);
    if (row < grid.length - 1) neighbors.push(newGrid[row + 1][col]);
    if (col < grid[0].length - 1) neighbors.push(newGrid[row][col + 1]);
    if (row > 0) neighbors.push(newGrid[row - 1][col]);

    for (const neighbor of neighbors) {
      if (!neighbor.isWall && !neighbor.isVisited) {
        neighbor.previousNode = currentNode;
        stack.push(neighbor);
      }
    }
  }

  // Reconstruct the shortest path
  const shortestPath = [];
  let totalCost = 0;
  let currentNode = newGrid[endNode.row][endNode.col];
  if (
    !currentNode.previousNode &&
    currentNode !== newGrid[startNode.row][startNode.col]
  ) {
    // End node was not reached
    return {
      visitedNodesInOrder,
      newGrid,
      shortestPath: [],
      totalCost: 0,
    };
  }

  while (currentNode) {
    shortestPath.push(currentNode);
    totalCost += currentNode.weight || 1; // Default weight to 1 if not specified
    currentNode = currentNode.previousNode;
  }
  shortestPath.reverse();

  // Mark the path on the grid
  shortestPath.forEach((node) => {
    if (!node.isStart && !node.isEnd) {
      newGrid[node.row][node.col].isPath = true;
    }
  });

  return { visitedNodesInOrder, newGrid, shortestPath, totalCost };
};

// A*
export const aStar = (grid, startNode, endNode) => {
  if (!startNode || !endNode || !grid || !grid.length || !grid[0].length) {
    return {
      visitedNodesInOrder: [],
      newGrid: grid,
      shortestPath: [],
      totalCost: 0,
    };
  }

  // Create a deep copy of the grid for computations
  const workingGrid = grid.map((row) =>
    row.map((node) => ({
      ...node,
      gScore: Infinity,
      fScore: Infinity,
      isVisited: false,
      previousNode: null,
    }))
  );
  const localStartNode = workingGrid[startNode.row][startNode.col];
  const localEndNode = workingGrid[endNode.row][endNode.col];

  const visitedNodesInOrder = [];
  const openSet = [];
  localStartNode.gScore = 0;
  localStartNode.fScore = heuristic(localStartNode, endNode);
  openSet.push(localStartNode);
  const visited = new Set();

  // Create output grid
  const newGrid = grid.map((row) =>
    row.map((node) => ({ ...node, isPath: false, isVisited: false }))
  );

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.fScore - b.fScore);
    const currentNode = openSet.shift();

    if (currentNode.isWall) continue;
    if (!currentNode.isVisited) {
      currentNode.isVisited = true;
      // Set isVisited on newGrid and add to visitedNodesInOrder
      newGrid[currentNode.row][currentNode.col].isVisited = true;
      visitedNodesInOrder.push(newGrid[currentNode.row][currentNode.col]);
      visited.add(`${currentNode.row}-${currentNode.col}`);
    }

    if (currentNode === localEndNode) break;

    const neighbors = getNeighbors(currentNode, workingGrid);
    for (const neighbor of neighbors) {
      const key = `${neighbor.row}-${neighbor.col}`;
      if (!visited.has(key)) {
        const tentativeGScore = currentNode.gScore + (neighbor.weight || 1);
        if (tentativeGScore < neighbor.gScore) {
          neighbor.previousNode = currentNode;
          neighbor.gScore = tentativeGScore;
          neighbor.fScore = tentativeGScore + heuristic(neighbor, localEndNode);
          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          }
        }
      }
    }
  }

  // Reconstruct path
  const shortestPath = [];
  let totalCost = 0;
  let currentNode = workingGrid[endNode.row][endNode.col];
  if (!currentNode.previousNode && currentNode !== localStartNode) {
    // End node not reached
    return {
      visitedNodesInOrder,
      newGrid,
      shortestPath: [],
      totalCost: 0,
    };
  }

  while (currentNode) {
    shortestPath.push(newGrid[currentNode.row][currentNode.col]);
    totalCost += currentNode.weight || 1;
    currentNode = currentNode.previousNode;
  }
  shortestPath.reverse();

  shortestPath.forEach((node) => {
    if (!node.isStart && !node.isEnd) {
      newGrid[node.row][node.col].isPath = true;
    }
  });

  return { visitedNodesInOrder, newGrid, shortestPath, totalCost };
};

export const runAlgorithm = (algorithm, grid, startNode, endNode) => {
  switch (algorithm) {
    case "greedy":
      return greedyBestFirst(grid, startNode, endNode);
    case "dijkstra":
      return dijkstra(grid, startNode, endNode);
    case "astar":
      return aStar(grid, startNode, endNode);
    case "bfs":
      return bfs(grid, startNode, endNode);
    case "dfs":
      return dfs(grid, startNode, endNode);
    case "bidirectionalBFS":
      return bidirectionalBFS(grid, startNode, endNode);
    default:
      return {
        visitedNodesInOrder: [],
        newGrid: grid,
        shortestPath: [],
        totalCost: 0,
      };
  }
};

export const runAlgorithmNoAnimation = (
  algorithm,
  grid,
  startNode,
  endNode
) => {
  const newGrid = grid.map((row) =>
    row.map((node) => ({
      ...node,
      isVisited: false,
      isPath: false,
      isCurrent: false,
      animationKey: 0,
      distance: Infinity,
      fScore: Infinity,
      hScore: Infinity,
      gScore: Infinity,
      previousNode: null,
    }))
  );

  newGrid[startNode.row][startNode.col].isStart = true;
  newGrid[startNode.row][startNode.col].distance = 0;
  newGrid[startNode.row][startNode.col].fScore =
    algorithm === "astar" ? heuristic(startNode, endNode) : 0;
  newGrid[startNode.row][startNode.col].hScore =
    algorithm === "greedy" ? heuristic(startNode, endNode) : Infinity;
  newGrid[endNode.row][endNode.col].isEnd = true;

  const {
    visitedNodesInOrder,
    newGrid: computedGrid,
    shortestPath,
    totalCost,
  } = runAlgorithm(
    algorithm,
    newGrid,
    newGrid[startNode.row][startNode.col],
    newGrid[endNode.row][endNode.col]
  );

  computedGrid[startNode.row][startNode.col].isVisited = false;
  computedGrid[endNode.row][endNode.col].isVisited = false;

  return {
    visitedNodesInOrder: visitedNodesInOrder || [],
    newGrid: computedGrid,
    shortestPath: shortestPath || [],
    totalCost: totalCost || 0,
  };
};
