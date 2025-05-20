export default function AlgorithmDescription({ algorithm }) {
  let description = "";
  switch (algorithm) {
    case "dijkstra":
      description =
        "Dijkstra’s Algorithm explores all possible paths to find the shortest one, considering node weights. It is <strong>weighted</strong> and <em>guarantees the shortest path</em> by total weight.";
      break;
    case "astar":
      description =
        "A* Algorithm uses a heuristic to efficiently search for the shortest path, incorporating node weights. It is <strong>weighted</strong> and <em>guarantees the shortest path</em> with an admissible heuristic.";
      break;
    case "bfs":
      description =
        "Breadth-First Search explores nodes level by level, ignoring weights. It is <strong>unweighted</strong> and <em>guarantees the shortest path</em> by number of nodes.";
      break;
    default:
      description = "Select an algorithm to see its description.";
  }

  return (
    <div className="text-center max-w-2xl mx-auto mb-4 px-4 text-gray-700">
      <p dangerouslySetInnerHTML={{ __html: description }} />
    </div>
  );
}
