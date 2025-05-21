import { memo } from "react";
import { Weight } from "lucide-react";

function Controls({
  algorithm,
  mode,
  mazeType,
  speed,
  isRunning,
  setAlgorithm,
  setMazeType,
  setSpeed,
  toggleWeightMode,
  toggleEraserMode,
  runPathfindingAlgorithm,
  generatePathfindingMaze,
  resetGrid,
}) {
  const handleAlgorithmChange = (e) => {
    if (isRunning) return;
    const newAlgorithm = e.target.value;
    if (
      (newAlgorithm === "bfs" ||
        newAlgorithm === "greedy" ||
        newAlgorithm === "dfs" ||
        newAlgorithm === "bidirectionalBFS") &&
      mode === "weight"
    ) {
      toggleWeightMode();
    }
    setAlgorithm(newAlgorithm);
  };

  const handleMazeTypeChange = (e) => {
    if (isRunning) return;
    setMazeType(e.target.value);
  };

  return (
    <div className="flex flex-col md:flex-row md:flex-wrap xl:flex-nowrap items-center justify-center gap-2 w-full">
      <select
        className={`text-white px-2 py-1 text-sm rounded transition-colors focus-visible:outline-none flex-shrink-0 ${
          isRunning
            ? "opacity-50 cursor-not-allowed"
            : "hover:text-sky-400 cursor-pointer"
        }`}
        value={algorithm}
        onChange={handleAlgorithmChange}
        disabled={isRunning}
      >
        <option value="dijkstra" className="bg-gray-700 text-white">
          Dijkstra's
        </option>
        <option value="astar" className="bg-gray-700 text-white">
          A* Search
        </option>
        <option value="bfs" className="bg-gray-700 text-white">
          Breadth-First Search
        </option>
        <option value="greedy" className="bg-gray-700 text-white">
          Greedy Best-First
        </option>
        <option value="dfs" className="bg-gray-700 text-white">
          Depth-First Search
        </option>
        <option value="bidirectionalBFS" className="bg-gray-700 text-white">
          Bidirectional BFS
        </option>
      </select>
      <button
        className={`px-3 py-1 text-sm font-semibold rounded-lg transition-colors flex-shrink-0 ${
          isRunning
            ? "bg-gray-600 text-white cursor-not-allowed opacity-50"
            : "bg-sky-400 hover:bg-sky-600 text-white cursor-pointer"
        }`}
        onClick={runPathfindingAlgorithm}
        disabled={isRunning}
      >
        Visualize
      </button>
      <div className="relative flex-shrink-0 px-2 py-3">
        <div className="flex items-center gap-1 text-white text-sm">
          <label htmlFor="speed" className={isRunning ? "opacity-50" : ""}>
            Speed:
          </label>
          <input
            id="speed"
            type="range"
            min="5"
            max="200"
            value={speed}
            onChange={(e) => !isRunning && setSpeed(Number(e.target.value))}
            className={`w-16 cursor-grab accent-sky-400 ${
              isRunning ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isRunning}
          />
          <span
            className={`absolute -top-1 right-2 text-xs ${
              isRunning ? "opacity-50" : ""
            }`}
          >
            {speed}ms
          </span>
        </div>
      </div>
      <select
        className={`text-white px-2 py-1 text-sm rounded transition-colors focus-visible:outline-none flex-shrink-0 ${
          isRunning
            ? "opacity-50 cursor-not-allowed"
            : "hover:text-sky-400 cursor-pointer"
        }`}
        value={mazeType}
        onChange={handleMazeTypeChange}
        disabled={isRunning}
      >
        <option value="" className="bg-gray-700 text-white">
          Select Pattern
        </option>
        <option value="none" className="bg-gray-700 text-white">
          Recursive Division
        </option>
        <option value="horizontal" className="bg-gray-700 text-white">
          Horizontal Skew
        </option>
        <option value="vertical" className="bg-gray-700 text-white">
          Vertical Skew
        </option>
        <option value="random-scatter" className="bg-gray-700 text-white">
          Random Scatter
        </option>
        <option value="weight-recursive" className="bg-gray-700 text-white">
          Weight Recursive
        </option>
        <option
          value="weight-random-scatter"
          className="bg-gray-700 text-white"
        >
          Weight Scatter
        </option>
      </select>
      <button
        className={`px-3 py-1 text-sm font-semibold rounded-lg transition-colors text-white flex-shrink-0 ${
          mazeType === ""
            ? "bg-gray-600 cursor-not-allowed opacity-50"
            : isRunning
            ? "bg-indigo-600 opacity-50 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
        }`}
        onClick={() => generatePathfindingMaze(mazeType)}
        disabled={mazeType === "" || isRunning}
      >
        Generate
      </button>
      <button
        className={`flex items-center gap-1 px-3 py-1 text-sm font-semibold transition-colors flex-shrink-0 ${
          isRunning ||
          algorithm === "bfs" ||
          algorithm === "greedy" ||
          algorithm === "dfs" ||
          algorithm === "bidirectionalBFS"
            ? "opacity-50 cursor-not-allowed text-white"
            : mode === "weight"
            ? "text-sky-400 hover:text-sky-600 cursor-pointer"
            : "text-white hover:text-sky-400 cursor-pointer"
        }`}
        onClick={toggleWeightMode}
        disabled={
          isRunning ||
          algorithm === "bfs" ||
          algorithm === "greedy" ||
          algorithm === "dfs" ||
          algorithm === "bidirectionalBFS"
        }
      >
        {mode === "weight" ? "Weight Mode: ON" : "Weight Mode: OFF"}
        <Weight size={16} />
      </button>
      <button
        className={`px-3 py-1 text-sm font-semibold transition-colors flex-shrink-0 ${
          isRunning
            ? "opacity-50 cursor-not-allowed text-white "
            : mode === "eraser"
            ? "text-sky-400 hover:text-sky-600 cursor-pointer"
            : "text-white hover:text-sky-400 cursor-pointer"
        }`}
        onClick={toggleEraserMode}
        disabled={isRunning}
      >
        {mode === "eraser" ? "Eraser: ON" : "Eraser: OFF"}
      </button>
      <button
        className={`px-3 py-1 text-sm font-semibold transition-colors flex-shrink-0 ${
          isRunning
            ? "opacity-50 cursor-not-allowed text-white"
            : "cursor-pointer hover:text-sky-400 text-white"
        }`}
        onClick={resetGrid}
        disabled={isRunning}
      >
        Reset
      </button>
    </div>
  );
}

export default memo(Controls);
