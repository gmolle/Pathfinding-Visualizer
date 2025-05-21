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
  };

  const algo = algorithms[algorithm] || null;

  return (
    <div className="text-center px-4 text-gray-700">
      <p className="mb-2">
        {algo ? (
          <>
            {algo.name} is a{" "}
            <span className="font-bold italic">
              {algo.weighted ? "weighted" : "unweighted"}
            </span>{" "}
            algorithm and it{" "}
            <span className="font-bold italic">
              {algo.guaranteedShortest ? "guarantees" : "does not guarantee"}
            </span>{" "}
            the shortest path
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
