import React, { useEffect, useState } from "react";
import "./Grid.css";

type Props = {
  grid?: Array<Number[]>;
  gridSize: number;
  pixelSize: number;
  drones: Array<number>[];
  igniteCallback: (x: number, y: number) => void
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
  const [singleGridSize, setSingleGridSize] = useState(0)

  useEffect(() => {
    setSingleGridSize(props.pixelSize / props.gridSize);
     
  }, [props.gridSize, props.pixelSize]);

  const dronesOnCell = (x,y) => {
    return props.drones.filter(drone => x === Math.round(drone[0]) && y === Math.round(drone[1])).length;
  }

  const { igniteCallback } = props;
  
  return (
      <div
        className="grid"
        style={{ height: props.pixelSize, width: props.pixelSize }}
      >
        {props.grid.map((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <div
              onClick={() => { igniteCallback(rowIndex, cellIndex) }}
              key={`${rowIndex},${cellIndex}`}
              className={typesOfFields[`${cell}`]}
              style={{
                width: `${singleGridSize}px`,
                height: `${singleGridSize}px`,
              }}
            >
              {dronesOnCell(rowIndex, cellIndex) > 0 && dronesOnCell(rowIndex, cellIndex)}
            </div>
          ))
        )}
      </div>
  );
};

export default Grid;
