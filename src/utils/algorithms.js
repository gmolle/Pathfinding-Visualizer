// src/utils/algorithms.js
// Heuristic for A*
const heuristic = (node1, node2) =>
  Math.abs(node1.row - node2.row) + Math.abs(node1.col - node2.col);

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

export const runAlgorithm = (algorithm, grid, startNode, endNode) => {
  switch (algorithm) {
    case "dijkstra":
      return dijkstra(grid, startNode, endNode);
    case "astar":
      return aStar(grid, startNode, endNode);
    case "bfs":
      return bfs(grid, startNode, endNode);
    default:
      return { visitedNodesInOrder: [], newGrid: grid };
  }
};
