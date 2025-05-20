import { Weight } from "lucide-react";

export default function Controls({
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
    if (newAlgorithm === "bfs" && mode === "weight") {
      toggleWeightMode();
    }
    setAlgorithm(newAlgorithm);
  };
  return (
    <div className="flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-4 w-full max-w-7xl">
      <select
        className={`text-white px-3 py-2 rounded  transition-colors focus-visible:outline-none ${
          isRunning
            ? "opacity-50 cursor-not-allowed"
            : "hover:text-sky-400 cursor-pointer"
        }`}
        value={algorithm}
        onChange={(e) => handleAlgorithmChange(e)}
        disabled={isRunning}
      >
        <option value="dijkstra" className="bg-gray-700 text-white">
          Dijkstra's Algorithm
        </option>
        <option value="astar" className="bg-gray-700 text-white">
          A* Search
        </option>
        <option value="bfs" className="bg-gray-700 text-white">
          Breadth-First Search
        </option>
      </select>
      <button
        className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
          isRunning
            ? "bg-gray-600 text-white cursor-not-allowed opacity-50"
            : "bg-sky-400 hover:bg-sky-600 text-white cursor-pointer"
        }`}
        onClick={runPathfindingAlgorithm}
        disabled={isRunning}
      >
        Visualize
      </button>
      <div className="flex items-center gap-2 relative text-white px-3 py-2">
        <label htmlFor="speed" className={isRunning ? "opacity-50" : ""}>
          Speed:
        </label>
        <input
          id="speed"
          type="range"
          min="1"
          max="200"
          value={speed}
          onChange={(e) => !isRunning && setSpeed(Number(e.target.value))}
          className={`w-22 cursor-grab accent-sky-400 ${
            isRunning ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isRunning}
        />
        <span
          className={`absolute -top-3 right-3 ${isRunning ? "opacity-50" : ""}`}
        >
          {speed}ms
        </span>
      </div>
      <select
        className={`text-white px-3 py-2 rounded  transition-colors focus-visible:outline-none ${
          isRunning
            ? "opacity-50 cursor-not-allowed"
            : "hover:text-sky-400 cursor-pointer"
        }`}
        value={mazeType}
        onChange={(e) => !isRunning && setMazeType(e.target.value)}
        disabled={isRunning}
      >
        <option value="" className="bg-gray-700 text-white">
          Select Pattern
        </option>
        <option value="none" className="bg-gray-700 text-white">
          Recursive Maze
        </option>
        <option value="horizontal" className="bg-gray-700 text-white">
          Horizontal Skew
        </option>
        <option value="vertical" className="bg-gray-700 text-white">
          Vertical Skew
        </option>
      </select>
      <button
        className={`px-4 py-2 font-semibold rounded-lg transition-colors text-white  ${
          mazeType === ""
            ? "bg-gray-600 text-white cursor-not-allowed opacity-50"
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
        className={`flex items-center gap-2 px-4 py-2 font-semibold transition-colors   ${
          isRunning || algorithm == "bfs"
            ? "opacity-50 cursor-not-allowed text-white"
            : mode === "weight"
            ? "text-sky-400 hover:text-sky-600 cursor-pointer"
            : "text-white hover:text-sky-400 cursor-pointer"
        }`}
        onClick={toggleWeightMode}
        disabled={isRunning || algorithm == "bfs"}
      >
        {mode === "weight" ? "Weight Mode: ON" : "Weight Mode: OFF"}
        <Weight size={20} />
      </button>
      <button
        className={`px-4 py-2 font-semibold transition-colors cursor-pointer ${
          isRunning
            ? "opacity-50 cursor-not-allowed text-white"
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
        className={`px-4 py-2 text-white font-semibold  transition-colors  ${
          isRunning
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:text-sky-400"
        }`}
        onClick={resetGrid}
        disabled={isRunning}
      >
        Reset Grid
      </button>
    </div>
  );
}
