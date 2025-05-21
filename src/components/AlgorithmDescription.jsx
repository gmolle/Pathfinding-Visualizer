import Metrics from "./Metrics";

export default function AlgorithmDescription({
  algorithm,
  timer,
  visitedNodes,
  pathLength,
  totalCost,
}) {
  const algorithms = {
    dijkstra: {
      name: "Dijkstra’s Algorithm",
      weighted: true,
      guaranteedShortest: true,
    },
    astar: {
      name: "A* Search",
      weighted: true,
      guaranteedShortest: true,
    },
    bfs: {
      name: "Breadth-First Search (BFS)",
      weighted: false,
      guaranteedShortest: true,
    },
    greedy: {
      name: "Greedy Best-First Search",
      weighted: true,
      guaranteedShortest: false,
    },
    dfs: {
      name: "Depth-First Search (DFS)",
      weighted: false,
      guaranteedShortest: false,
    },
    bidirectionalBFS: {
      name: "Bidirectional BFS",
      weighted: false,
      guaranteedShortest: true,
    },
  };

  const algo = algorithms[algorithm] || null;

  const getArticle = (isWeighted) => (isWeighted ? "a" : "an");

  return (
    <div className="text-center px-4 text-gray-700">
      <p className="mb-2">
        {algo ? (
          <>
            {algo.name} is {getArticle(algo.weighted)}{" "}
            <span className="font-bold italic">
              {algo.weighted ? "weighted" : "unweighted"}
            </span>{" "}
            algorithm and{" "}
            <span className="font-bold italic">
              {algo.guaranteedShortest ? "guarantees" : "does not guarantee"}
            </span>{" "}
            the shortest path.
          </>
        ) : (
          "Select an algorithm to see its description."
        )}
      </p>
      <Metrics
        timer={timer}
        visitedNodes={visitedNodes}
        pathLength={pathLength}
        totalCost={totalCost}
      />
    </div>
  );
}
