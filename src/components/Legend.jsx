import { CircleArrowRight, Target, Weight } from "lucide-react";

export default function Legend() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-1 lg:gap-0 py-6 px-3 text-black text-base place-items-center max-w-6xl mx-auto">
      <div className="flex items-center gap-2">
        <CircleArrowRight size={30} className="text-green-300" />
        <span>Start</span>
      </div>
      <div className="flex items-center gap-2">
        <Target size={30} className="text-red-500" />
        <span>End</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-gray-900"></div>
        <span>Wall</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-6 h-6 bg-indigo-200">
          <Weight size={20} className="text-yellow-700" />
        </div>
        <span>Weighted Node</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-white border border-blue-300"></div>
        <span>Unvisited</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-6 h-6 bg-blue-200"></div>
          <div className="w-6 h-6 bg-purple-400"></div>
        </div>
        <span>Visited</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-yellow-300"></div>
        <span>Path</span>
      </div>
    </div>
  );
}
