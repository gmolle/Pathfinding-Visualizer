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
    <div className="min-h-screen bg-white text-white p-0">
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
      <div className="">
        <Legend />
        <AlgorithmDescription algorithm={algorithm} />
        <div className="p-8 pt-0">
          <Grid
            grid={grid}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
            onMouseUp={handleMouseUp}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
