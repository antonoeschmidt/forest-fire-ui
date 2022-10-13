import { Button, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Grid from "../components/Grid/Grid";
import { connectWebsocket } from "../utils/webSocket";

type Settings = {
    gridSize: number;
    pixelSize: number;
};

type EventData = {
    grid_size: number;
    grid: Number[];
};

const MainPage = () => {
    const [grid, setGrid] = useState<Number[]>();
    const [gridSize, setGridSize] = useState(20);
    const [pixelSize, setPixelSize] = useState(500);
    const [connection, setConnection] = useState(false);
    const [settings, setSettings] = useState<Settings>({ gridSize, pixelSize });
    const ws = useRef<WebSocket>();

    const onClickUpdate = () => {
        if (settings.gridSize === 0 || settings.pixelSize === 0) {
            alert("Please enter both fields");
            return;
        }
        setGrid(null);
        createRandomGrid();
    };

    const createRandomGrid = () => {
        let grid = [];
        for (let i = 0; i < settings.gridSize; i++) {
            grid.push(Array(settings.gridSize));
            for (let j = 0; j < settings.gridSize; j++) {
                grid[i][j] = Math.round(Math.random() * 2);
            }
        }
        setGrid(grid);
        setGridSize(settings.gridSize);
        setPixelSize(settings.pixelSize);
    };

    const onMessage = (event: MessageEvent): void => {
        let data = JSON.parse(event.data) as EventData;
        setGridSize(data.grid_size);
        setGrid(data.grid);
    };

    const onOpen = (event: Event): void => {
        setConnection(true);
    };

    const onError = (event: Event): void => {
        setConnection(false);
        createRandomGrid();
    };

    useEffect(() => {
        ws.current = connectWebsocket(
            "ws://localhost:8000",
            onMessage,
            onOpen,
            onError
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <h1>Forest Fire Simulation</h1>
            {!connection && (
                <div className="settings">
                    <TextField
                        variant="outlined"
                        label="Pixel size of grid"
                        type="number"
                        value={settings.pixelSize.toString()}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                pixelSize: Number(e.target.value),
                            })
                        }
                    ></TextField>
                    <TextField
                        variant="outlined"
                        label="No of rows"
                        type="number"
                        value={settings.gridSize.toString()}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                gridSize: Number(e.target.value),
                            })
                        }
                    ></TextField>
                    <Button variant="contained" onClick={() => onClickUpdate()}>
                        Update
                    </Button>
                </div>
            )}

            <br />
            {grid && (
                <Grid grid={grid} gridSize={gridSize} pixelSize={pixelSize} />
            )}
        </div>
    );
};

export default MainPage;
