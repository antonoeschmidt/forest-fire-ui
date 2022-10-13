import React, { useCallback, useEffect, useState } from "react";
import "./Grid.css";

type Props = {
    grid?: Number[];
    gridSize: number;
    pixelSize: number;
};

const typesOfFields = {
    0: "grid-item",
    1: "grid-item-fire",
    2: "grid-item-forest",
};

const Grid = (props: Props) => {
    const [grid, setGrid] = useState([]);

    const drawGrid = useCallback(
        (grid?: Number[]) => {
            if (props.gridSize !== props.grid.length) {
                alert("mismatch");
            }
            try {
                let initialRows = [];
                let singleGridSize = props.pixelSize / props.gridSize;
                let index = 0;
                for (let i = 0; i < props.gridSize; i++) {
                    for (let j = 0; j < props.gridSize; j++) {
                        index++;
                        initialRows.push(
                            <div
                                key={index}
                                className={
                                    grid
                                        ? typesOfFields[grid[i][j]]
                                        : "grid-item"
                                }
                                style={{
                                    width: `${singleGridSize}px`,
                                    height: `${singleGridSize}px`,
                                }}
                            />
                        );
                    }
                }
                setGrid(initialRows);
            } catch (err) {
                console.error("Error in grid provided");
                console.error(err);
            }
        },
        [props.grid.length, props.pixelSize, props.gridSize]
    );

    const createGrid = useCallback(() => {
        drawGrid(props.grid);
    }, [drawGrid, props.grid]);

    useEffect(() => {
        createGrid();
    }, [createGrid]);

    return (
        <div>
            <div
                className="grid"
                style={{ height: props.pixelSize, width: props.pixelSize }}
            >
                {grid}
            </div>
        </div>
    );
};

export default Grid;
