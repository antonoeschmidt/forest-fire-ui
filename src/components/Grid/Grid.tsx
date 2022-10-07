import React, { useCallback, useEffect, useState } from "react";
import "./Grid.css";

type Props = {
    grid?: Number[];
    height: number;
    width: number;
    gridSize: number;
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
            if (props.height !== props.grid.length) {
                alert("mismatch");
            }
            try {
                let initialRows = [];
                let singleGridSize = props.gridSize / props.height;
                let index = 0;
                for (let i = 0; i < props.height; i++) {
                    for (let j = 0; j < props.width; j++) {
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
        [props.grid.length, props.gridSize, props.height, props.width]
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
                style={{ height: props.gridSize, width: props.gridSize }}
            >
                {grid}
            </div>
        </div>
    );
};

export default Grid;
