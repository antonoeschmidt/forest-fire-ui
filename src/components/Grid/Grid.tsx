import React from "react";
import "./Grid.css";

type Props = {
  grid?: Array<Number[]>;
  gridSize: number;
  pixelSize: number;
};

const typesOfFields = {
  1: "grid-item",
  2: "grid-item-fire",
  3: "grid-item-forest-low",
  4: "grid-item-forest-medium",
  5: "grid-item-forest-high",
  6: "grid-item-forest-water",
  7: "grid-item-forest-rock",
};

const Grid = (props: Props) => {
  let singleGridSize = props.pixelSize / props.gridSize;

  return (
    <div>
      <div
        className="grid"
        style={{ height: props.pixelSize, width: props.pixelSize }}
      >
        {props.grid.map((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <div
              key={`${rowIndex},${cellIndex}`}
              className={typesOfFields[`${cell}`]}
              style={{
                width: `${singleGridSize}px`,
                height: `${singleGridSize}px`,
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Grid;
