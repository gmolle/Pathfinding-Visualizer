import Node from "./Node";

export default function Grid({ grid, onMouseDown, onMouseEnter, onMouseUp }) {
  return (
    <div className="w-full h-[74vh] overflow-hidden border-t border-l border-blue-300 ">
      <div
        className="w-full h-full grid"
        style={{
          gridTemplateColumns: `repeat(51, minmax(0, 1fr))`,
        }}
      >
        {grid.map((row, rowIdx) => (
          <div key={rowIdx} className="contents">
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
    </div>
  );
}
