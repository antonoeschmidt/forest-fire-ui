import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import Grid from "../components/Grid/Grid";

type Settings = {
    gridSize: number;
    height: number;
    width: number;
};

const MainPage = () => {
    const [grid, setGrid] = useState<Number[]>();
    const [height, setHeight] = useState(20);
    const [width, setWidth] = useState(20);
    const [gridSize, setgridSize] = useState(500);
    const [settings, setSettings] = useState<Settings>();

    const onClickUpdate = () => {
        setGrid(null);
        setHeight(settings.height);
        setWidth(settings.width);
        setgridSize(settings.gridSize);
    };

    useEffect(() => {
        let grid = [];
        for (let i = 0; i < height; i++) {
            grid.push(Array(height));
            for (let j = 0; j < height; j++) {
                grid[i][j] = Math.round(Math.random() * 2);
            }
        }

        setGrid(grid);
    }, [height]);

    return (
        <div>
            <h1>Forest Fire Simulation</h1>
            <div className="settings">
                <TextField
                    variant="outlined"
                    label="Pixel size of grid"
                    type="number"
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            gridSize: Number(e.target.value),
                        })
                    }
                ></TextField>
                <TextField
                    variant="outlined"
                    label="No of rows"
                    type="number"
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            width: Number(e.target.value),
                            height: Number(e.target.value),
                        })
                    }
                ></TextField>
                <Button variant="contained" onClick={() => onClickUpdate()}>
                    Update
                </Button>
            </div>
            <br />
            {grid && (
                <Grid
                    grid={grid}
                    gridSize={gridSize}
                    width={width}
                    height={height}
                />
            )}
        </div>
    );
};

export default MainPage;
