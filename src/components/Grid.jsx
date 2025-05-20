import Node from "./Node";

export default function Grid({ grid, onMouseDown, onMouseEnter, onMouseUp }) {
  return (
    <div className="grid gap-0 border-l border-t border-blue-300">
      {grid.map((row, rowIdx) => (
        <div key={rowIdx} className="flex">
          {row.map((node, nodeIdx) => (
            <Node
              key={`${nodeIdx}-${node.isWall}-${node.isPath}-${node.weight}-${node.isVisited}-${node.isCurrent}-${node.animationKey}`}
              node={node}
              onMouseDown={onMouseDown}
              onMouseEnter={onMouseEnter}
              onMouseUp={onMouseUp}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
