import { useState } from "react";
import Controls from "./Controls";
import { Menu, X } from "lucide-react";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="w-full bg-gray-800 py-6 px-4 shadow-md">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between w-full gap-4">
        <div className="flex items-center justify-between w-full lg:w-auto">
          <h1 className="text-2xl font-bold text-white text-center lg:text-left">
            Pathfinding Visualizer
          </h1>
          <button
            className="lg:hidden text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <div
          className={`w-full lg:w-auto bg-gray-800 lg:bg-transparent px-0 lg:px-0 pt-2 lg:pt-0 pb-0 lg:pb-0 transition-all duration-300 ease-in-out slide-down-menu overflow-hidden ${
            isMenuOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          } lg:max-h-none lg:opacity-100`}
        >
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
      </div>
    </nav>
  );
}
