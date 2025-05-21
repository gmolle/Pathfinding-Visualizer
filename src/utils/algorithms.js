// Heuristic for A* and Greedy Best-First
const heuristic = (node1, node2) =>
  Math.abs(node1.row - node2.row) + Math.abs(node1.col - node2.col);

// Greedy Best-First Search (Weighted, but heuristic-driven)
const greedyBestFirst = (grid, startNode, endNode) => {
  const newGrid = grid.map((row) =>
    row.map((node) => ({
      ...node,
      hScore: Infinity, // Heuristic score
      isVisited: false,
      isPath: false,
      previousNode: null,
    }))
  );
  const visitedNodesInOrder = [];
  startNode = newGrid[startNode.row][startNode.col];
  endNode = newGrid[endNode.row][endNode.col];
  startNode.hScore = heuristic(startNode, endNode);

  const unvisited = [];
  newGrid.forEach((row) => row.forEach((node) => unvisited.push(node)));

  while (unvisited.length) {
    unvisited.sort((a, b) => a.hScore - b.hScore);
    const closestNode = unvisited.shift();
    if (closestNode.isWall || closestNode.isVisited) continue;
    if (closestNode.hScore === Infinity) break;

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    if (closestNode === endNode) break;

    const { row, col } = closestNode;
    const neighbors = [];
    if (row > 0) neighbors.push(newGrid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(newGrid[row + 1][col]);
    if (col > 0) neighbors.push(newGrid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(newGrid[row][col + 1]);

    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.hScore = heuristic(neighbor, endNode);
        neighbor.previousNode = closestNode;
        // No distance calculation; GBFS relies solely on heuristic
      }
    }
  }
  return { visitedNodesInOrder, newGrid };
};

// Dijkstra's Algorithm (Weighted)
const dijkstra = (grid, startNode, endNode) => {
  const newGrid = grid.map((row) =>
    row.map((node) => ({
      ...node,
      distance: Infinity,
      isVisited: false,
      isPath: false,
      previousNode: null,
    }))
  );
  const visitedNodesInOrder = [];
  startNode = newGrid[startNode.row][startNode.col];
  endNode = newGrid[endNode.row][endNode.col];
  startNode.distance = 0;

  const unvisited = [];
  newGrid.forEach((row) => row.forEach((node) => unvisited.push(node)));

  while (unvisited.length) {
    unvisited.sort((a, b) => a.distance - b.distance);
    const closestNode = unvisited.shift();
    if (closestNode.isWall || closestNode.isVisited) continue;
    if (closestNode.distance === Infinity) break;

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    if (closestNode === endNode) break;

    const { row, col } = closestNode;
    const neighbors = [];
    if (row > 0) neighbors.push(newGrid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(newGrid[row + 1][col]);
    if (col > 0) neighbors.push(newGrid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(newGrid[row][col + 1]);

    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        const newDistance = closestNode.distance + neighbor.weight;
        if (newDistance < neighbor.distance) {
          neighbor.distance = newDistance;
          neighbor.previousNode = closestNode;
        }
      }
    }
  }
  return { visitedNodesInOrder, newGrid };
};

// A* Algorithm (Weighted)
const aStar = (grid, startNode, endNode) => {
  const newGrid = grid.map((row) =>
    row.map((node) => ({
      ...node,
      distance: Infinity,
      fScore: Infinity,
      isVisited: false,
      isPath: false,
      previousNode: null,
    }))
  );
  const visitedNodesInOrder = [];
  startNode = newGrid[startNode.row][startNode.col];
  endNode = newGrid[endNode.row][endNode.col];
  startNode.distance = 0;
  startNode.fScore = heuristic(startNode, endNode);

  const unvisited = [];
  newGrid.forEach((row) => row.forEach((node) => unvisited.push(node)));

  while (unvisited.length) {
    unvisited.sort((a, b) => a.fScore - b.fScore);
    const closestNode = unvisited.shift();
    if (closestNode.isWall || closestNode.isVisited) continue;
    if (closestNode.distance === Infinity) break;

    const neighbors = [];
    const { row, col } = closestNode;
    if (row > 0) neighbors.push(newGrid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(newGrid[row + 1][col]);
    if (col > 0) neighbors.push(newGrid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(newGrid[row][col + 1]);

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    if (closestNode === endNode) break;

    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        const newDistance = closestNode.distance + neighbor.weight;
        if (newDistance < neighbor.distance) {
          neighbor.distance = newDistance;
          neighbor.fScore = newDistance + heuristic(neighbor, endNode);
          neighbor.previousNode = closestNode;
        }
      }
    }
  }
  return { visitedNodesInOrder, newGrid };
};

// BFS Algorithm (Unweighted)
export const bfs = (grid, startNode, endNode) => {
  const newGrid = grid.map((row) =>
    row.map((node) => ({
      ...node,
      isVisited: false,
      isPath: false,
      previousNode: null,
    }))
  );
  const queue = [newGrid[startNode.row][startNode.col]];
  const visitedNodesInOrder = [];
  queue[0].isVisited = true;

  while (queue.length) {
    const currentNode = queue.shift();
    visitedNodesInOrder.push(currentNode);

    if (currentNode.isEnd) break;

    const { row, col } = currentNode;
    const neighbors = [];
    if (row > 0) neighbors.push(newGrid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(newGrid[row + 1][col]);
    if (col > 0) neighbors.push(newGrid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(newGrid[row][col + 1]);

    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.isVisited = true;
        neighbor.previousNode = currentNode;
        queue.push(neighbor);
      }
    }
  }
  return { visitedNodesInOrder, newGrid };
};

// BFS Algorithm (Unweighted)
export const dfs = (grid, startNode, endNode) => {
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

  return { visitedNodesInOrder, newGrid };
};

export const runAlgorithm = (algorithm, grid, startNode, endNode) => {
  switch (algorithm) {
    case "dijkstra":
      return dijkstra(grid, startNode, endNode);
    case "astar":
      return aStar(grid, startNode, endNode);
    case "bfs":
      return bfs(grid, startNode, endNode);
    case "greedy":
      return greedyBestFirst(grid, startNode, endNode);
    case "dfs":
      return dfs(grid, startNode, endNode);
    default:
      return { visitedNodesInOrder: [], newGrid: grid };
  }
};

export const runAlgorithmNoAnimation = (
  algorithm,
  grid,
  startNode,
  endNode
) => {
  // Create a deep copy of the grid, preserving walls and weights
  const newGrid = grid.map((row) =>
    row.map((node) => ({
      ...node,
      isVisited: false,
      isPath: false,
      isCurrent: false,
      animationKey: 0, // Reset to prevent animations
      distance: Infinity,
      fScore: Infinity,
      hScore: Infinity,
      previousNode: null,
    }))
  );

  // Ensure start and end nodes are correctly set
  newGrid[startNode.row][startNode.col].isStart = true;
  newGrid[startNode.row][startNode.col].distance = 0;
  newGrid[startNode.row][startNode.col].fScore =
    algorithm === "astar" ? heuristic(startNode, endNode) : 0;
  newGrid[startNode.row][startNode.col].hScore =
    algorithm === "greedy" ? heuristic(startNode, endNode) : Infinity;
  newGrid[endNode.row][endNode.col].isEnd = true;

  // Run the algorithm
  const { visitedNodesInOrder, newGrid: computedGrid } = runAlgorithm(
    algorithm,
    newGrid,
    newGrid[startNode.row][startNode.col],
    newGrid[endNode.row][endNode.col]
  );

  // Trace the shortest path and calculate total cost
  const shortestPath = [];
  let currentNode = computedGrid[endNode.row][endNode.col];
  let totalCost = 0;
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

  // Update grid with visited and path nodes, excluding start and end
  visitedNodesInOrder.forEach((node) => {
    if (!node.isStart && !node.isEnd) {
      computedGrid[node.row][node.col].isVisited = true;
      // Do not increment animationKey
    }
  });
  shortestPath.forEach((node) => {
    if (!node.isStart && !node.isEnd) {
      computedGrid[node.row][node.col].isPath = true;
      // Do not increment animationKey
    }
  });

  // Explicitly ensure start and end nodes are not marked as visited
  computedGrid[startNode.row][startNode.col].isVisited = false;
  computedGrid[endNode.row][endNode.col].isVisited = false;

  return {
    visitedNodesInOrder,
    newGrid: computedGrid,
    shortestPath,
    totalCost,
  };
};
