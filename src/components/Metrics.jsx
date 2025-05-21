export default function Metrics({
  timer,
  visitedNodes,
  pathLength,
  totalCost,
}) {
  const formattedTimer = (timer / 1000).toFixed(2);

  return (
    <div className="flex items-center justify-center gap-6 text-gray-600 text-sm font-medium">
      <span>Time: {formattedTimer}s</span>
      <span>Visited Nodes: {visitedNodes}</span>
      <span>Path Length: {pathLength}</span>
      <span>Total Cost: {totalCost}</span>
    </div>
  );
}
