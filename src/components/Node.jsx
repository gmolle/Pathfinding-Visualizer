import { CircleArrowRight, Target, Weight } from "lucide-react";

export default function Node({
  node,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  isDraggingUpdate,
}) {
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

  const bgColor = isPath
    ? "bg-yellow-300"
    : isCurrent
    ? "bg-yellow-300"
    : isWall
    ? "bg-gray-900"
    : isVisited
    ? "bg-blue-200"
    : weight === 2
    ? "bg-indigo-200"
    : "bg-white";

  const cursor = isStart || isEnd ? "cursor-grab" : "cursor-default";
  const borderClass =
    isWall || isPath ? "" : "border-r border-b border-blue-300";
  const animationClass = isDraggingUpdate
    ? "" // Skip animations during dragging updates
    : isPath
    ? "animate-pop-in"
    : isCurrent
    ? "animate-pulse"
    : isVisited
    ? "animate-visited"
    : isWall || weight === 2
    ? "animate-pop-in"
    : "";

  return (
    <div
      className={`node w-full h-full ${bgColor} ${cursor} ${borderClass} ${animationClass} relative transition-all duration-100`}
      data-weight={weight}
      data-animation-key={animationKey}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp(row, col)}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {isEnd ? (
          <Target size={20} className="text-red-500" />
        ) : isStart ? (
          <CircleArrowRight size={22} className="text-green-300" />
        ) : weight > 1 ? (
          <Weight size={20} className="text-yellow-700" />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
