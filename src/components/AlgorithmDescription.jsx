export default function AlgorithmDescription({ algorithm }) {
  let description = "";
  switch (algorithm) {
    case "dijkstra":
      description =
        "Dijkstra’s Algorithm is a <strong><em>weighted</em></strong> algorithm and it <strong><em>guarantees</em></strong> the shortest path";
      break;
    case "astar":
      description =
        "A* Search is a <strong><em>weighted</em></strong> algorithm and it <strong><em>guarantees</em></strong> the shortest path";
      break;
    case "bfs":
      description =
        "Breadth-First Search (BFS) is an <strong><em>unweighted</em></strong> algorithm and it <strong><em>guarantees</em></strong> the shortest path";
      break;
    default:
      description = "Select an algorithm to see its description.";
  }

  return (
    <div className="text-center max-w-4xl mx-auto mb-4 px-4 text-gray-700">
      <p dangerouslySetInnerHTML={{ __html: description }} />
    </div>
  );
}
