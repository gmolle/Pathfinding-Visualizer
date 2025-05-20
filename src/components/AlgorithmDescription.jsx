export default function AlgorithmDescription({ algorithm }) {
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
  };

  const algo = algorithms[algorithm] || null;

  return (
    <div className="text-center max-w-4xl mx-auto mb-4 px-4 text-gray-700">
      <p>
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
    </div>
  );
}
