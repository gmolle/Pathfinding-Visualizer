import { CircleArrowRight, Target, Weight } from "lucide-react";

// Legend.jsx
export default function Legend() {
  return (
    <div className="flex gap-6 mb-4">
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
        <div className="flex items-center justify-center w-6 h-6 bg-indigo-200 ">
          <Weight size={20} className="text-yellow-700" />
        </div>
        <span>Weighted Node</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-white border border-blue-300"></div>
        <span>Unvisted</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-blue-200 "></div>
        <div className="w-6 h-6 bg-purple-400  "></div>
        <span>Visited</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-yellow-300 "></div>
        <span>Path</span>
      </div>
    </div>
  );
}
