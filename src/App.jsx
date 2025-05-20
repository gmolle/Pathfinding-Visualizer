import { usePathfinding } from "./hooks/usePathfinding";
import Grid from "./components/Grid";
import Legend from "./components/Legend";
import AlgorithmDescription from "./components/AlgorithmDescription";
import "./App.css";

function App() {
  const {
    grid,
    mode,
    algorithm,
    speed,
    mazeType,
    resetGrid,
    toggleWeightMode,
    toggleEraserMode,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    setAlgorithm,
    setSpeed,
    setMazeType,
    runPathfindingAlgorithm,
    generatePathfindingMaze,
  } = usePathfinding();

  return (
    <div className="container min-h-screen flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">Pathfinding Visualizer</h1>
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="px-4 py-2 bg-white border rounded shadow-sm"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
        >
          <option value="dijkstra">Dijkstra's</option>
          <option value="astar">A*</option>
          <option value="bfs">BFS</option>
        </select>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 shadow-sm"
          onClick={runPathfindingAlgorithm}
        >
          Visualize
        </button>
        <select
          className="px-4 py-2 bg-white border rounded shadow-sm"
          value={mazeType}
          onChange={(e) => {
            setMazeType(e.target.value);
          }}
        >
          <option value="">Select Pattern</option>
          <option value="none">Recursive Maze</option>
          <option value="horizontal">Horizontal Skew</option>
          <option value="vertical">Vertical Skew</option>
        </select>
        <button
          className={`${
            mazeType === ""
              ? "px-4 py-2 bg-gray-500 text-white rounded shadow-sm"
              : "px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 shadow-sm"
          }`}
          disabled={mazeType === ""}
          onClick={() => generatePathfindingMaze(mazeType)}
        >
          Generate Pattern
        </button>
        <div className="flex items-center gap-2">
          <label htmlFor="speed">Speed: </label>
          <input
            id="speed"
            type="range"
            min="1"
            max="50"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-32"
          />
        </div>
        <button
          className={`px-4 py-2 text-white rounded shadow-sm ${
            mode === "weight"
              ? "bg-blue-700 border-2 border-blue-900"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={toggleWeightMode}
        >
          {mode === "weight" ? "Place Walls" : "Place Weights"}
        </button>
        <button
          className={`px-4 py-2 text-white rounded shadow-sm ${
            mode === "eraser"
              ? "bg-red-700 border-2 border-red-900"
              : "bg-red-500 hover:bg-red-600"
          }`}
          onClick={toggleEraserMode}
        >
          {mode === "eraser" ? "Stop Erasing" : "Eraser"}
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 shadow-sm"
          onClick={resetGrid}
        >
          Clear Board
        </button>
      </div>
      <Legend />
      <AlgorithmDescription algorithm={algorithm} />
      <Grid
        grid={grid}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
}

export default App;
