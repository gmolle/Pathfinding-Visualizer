import Controls from "./Controls";

export default function Navbar({
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
  return (
    <nav className="w-full bg-gray-800 p-4 shadow-md">
      <div className="flex flex-col xl:flex-row lg:items-center justify-between w-full gap-4">
        <h1 className="text-3xl font-bold text-white">
          Pathfinding Visualizer
        </h1>
        <Controls
          algorithm={algorithm}
          mode={mode}
          mazeType={mazeType}
          speed={speed}
          isRunning={isRunning}
          setAlgorithm={setAlgorithm}
          setMazeType={setMazeType}
          setSpeed={setSpeed}
          toggleWeightMode={toggleWeightMode}
          toggleEraserMode={toggleEraserMode}
          runPathfindingAlgorithm={runPathfindingAlgorithm}
          generatePathfindingMaze={generatePathfindingMaze}
          resetGrid={resetGrid}
        />
      </div>
    </nav>
  );
}
