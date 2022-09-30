import { Button, TextField } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import "./Grid.css";

type Settings = {
    gridSize: number;
    height: number;
    width: number;
};

const Grid = () => {
    const [rows, setRows] = useState([]);
    const [height, setHeight] = useState(20);
    const [width, setWidth] = useState(20);
    const [gridSize, setgridSize] = useState(500);
    const [settings, setSettings] = useState<Settings>();

    const onUpdate = () => {
        if (settings.height !== settings.width) {
            alert("Height and Width must be equal");
            return;
        }
        setHeight(settings.height);
        setWidth(settings.width);
        setgridSize(settings.gridSize);
    };

    const createGrid = useCallback(() => {
        if (height !== width) {
            alert("Height and Width must be equal");
            return;
        }
        let initialRows = [];
        let singleGridSize = gridSize / height;
        for (let i = 0; i < height; i++) {
            initialRows.push(
                Array.from(Array(width), () => (
                    <div
                        key={Math.random()}
                        id={`${i}`}
                        className="grid-item"
                        style={{
                            width: `${singleGridSize}px`,
                            height: `${singleGridSize}px`,
                        }}
                    />
                ))
            );
        }
        setRows(initialRows);
    }, [gridSize, height, width]);

    useEffect(() => {
        createGrid();
    }, [height, createGrid]);

    return (
        <div>
            <div className="settings">
                <TextField
                    variant="outlined"
                    label="Grid size in px"
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
                    label="Height"
                    type="number"
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            height: Number(e.target.value),
                        })
                    }
                ></TextField>
                <TextField
                    variant="outlined"
                    label="Width"
                    type="number"
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            width: Number(e.target.value),
                        })
                    }
                ></TextField>
                <Button variant="contained" onClick={() => onUpdate()}>
                    Update
                </Button>
            </div>
            <br />
            <div className="grid" style={{ height: gridSize, width: gridSize }}>
                {rows}
            </div>
        </div>
    );
};

export default Grid;
