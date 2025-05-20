// Node.jsx
export default function Node({ node, onMouseDown, onMouseEnter, onMouseUp }) {
  const { row, col, isStart, isEnd, weight, isWall, isVisited, isPath } = node;
  const bgColor = isStart
    ? "bg-green-500"
    : isEnd
    ? "bg-red-500"
    : isWall
    ? "bg-gray-800"
    : isPath
    ? "bg-yellow-400"
    : isVisited
    ? "bg-blue-200"
    : weight === 2
    ? "bg-gray-400"
    : "bg-white";
  const cursor = isStart || isEnd ? "cursor-grab" : "cursor-default";

  return (
    <div
      className={`node w-6 h-6 border border-gray-300 ${bgColor} ${cursor}`}
      data-weight={weight}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp(row, col)}
    />
  );
}
