import { usePathfinding } from "./hooks/usePathfinding";
import Navbar from "./components/Navbar";
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
    isRunning,
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
    <div className="min-h-screen flex flex-col items-center">
      <Navbar
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
      <div className="mt-6">
        <Legend />
        <AlgorithmDescription algorithm={algorithm} />
        <Grid
          grid={grid}
          onMouseDown={handleMouseDown}
          onMouseEnter={handleMouseEnter}
          onMouseUp={handleMouseUp}
        />
      </div>
    </div>
  );
}

export default App;
