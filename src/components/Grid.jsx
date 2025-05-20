import Node from "./Node";

export default function Grid({ grid, onMouseDown, onMouseEnter, onMouseUp }) {
  return (
    <div className="grid gap-0">
      {grid.map((row, rowIdx) => (
        <div key={rowIdx} className="flex">
          {row.map((node, nodeIdx) => (
            <Node
              key={nodeIdx}
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
