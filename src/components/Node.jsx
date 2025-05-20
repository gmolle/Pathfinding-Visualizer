export default function Node({ node, onMouseDown, onMouseEnter, onMouseUp }) {
  const {
    row,
    col,
    isStart,
    isEnd,
    weight,
    isWall,
    isPath,
    isVisited,
    isCurrent,
    animationKey,
  } = node;
  const bgColor = isCurrent
    ? "bg-purple-400"
    : isStart
    ? "bg-green-500"
    : isEnd
    ? "bg-red-500"
    : isWall
    ? "bg-gray-900"
    : isPath
    ? "bg-yellow-300"
    : isVisited
    ? "bg-cyan-300"
    : weight === 2
    ? "bg-gray-400"
    : "bg-white";
  const cursor = isStart || isEnd ? "cursor-grab" : "cursor-default";
  const borderClass =
    isWall || isPath ? "" : "border-r border-b border-blue-300";
  const animationClass = isCurrent
    ? "animate-pulse"
    : isWall || isPath || weight === 2
    ? "animate-pop-in"
    : "";

  return (
    <div
      className={`node w-6 h-6 ${bgColor} ${cursor} ${borderClass} ${animationClass}`}
      data-weight={weight}
      data-animation-key={animationKey}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp(row, col)}
    />
  );
}
