import React from "react";
import "./Grid.css";

type Props = {
  grid?: Array<Number[]>;
  gridSize: number;
  pixelSize: number;
};

const typesOfFields = {
  0: "grid-item",
  1: "grid-item-fire",
  2: "grid-item-forest",
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
