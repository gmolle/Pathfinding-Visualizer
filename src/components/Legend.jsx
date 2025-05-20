// Legend.jsx
export default function Legend() {
  return (
    <div className="flex gap-4 mb-4">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-green-500 border border-gray-300"></div>
        <span>Start</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-red-500 border border-gray-300"></div>
        <span>End</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-gray-900 border border-gray-300"></div>
        <span>Wall</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-gray-500 border border-gray-300"></div>
        <span>Weighted Node</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-blue-200 border border-gray-300"></div>
        <div className="w-4 h-4 bg-purple-400 border border-gray-300"></div>
        <span>Visited</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-yellow-300 border border-gray-300"></div>
        <span>Path</span>
      </div>
    </div>
  );
}
