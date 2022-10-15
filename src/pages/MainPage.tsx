import { Button, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Grid from "../components/Grid/Grid";
import GridPicker from "../components/Grid_picker/Grid_picker";
import { connectWebsocket } from "../utils/webSocket";

type Settings = {
    gridSize: number;
    pixelSize: number;
};

export type EventData = {
    grid_size: number;
    grid: Array<Number[]>;
};



const MainPage = () => {
    const prevGrids = useRef<EventData[]>([]);
    const [grid, setGrid] = useState<Array<Number[]>>();

    const [gridSize, setGridSize] = useState<number>(20);
    const [pixelSize, setPixelSize] = useState<number>(500);
    const [connection, setConnection] = useState(false);
    const [settings, setSettings] = useState<Settings>({ gridSize, pixelSize });
    const ws = useRef<WebSocket>();

    //TODO the method that opens the websocket connection and runs a new sim needs to set prevGrids.current = []

    const onClickUpdate = () => {
        if (settings.gridSize === 0 || settings.pixelSize === 0) {
            alert("Please enter both fields");
            return;
        }
        setGrid(null);
        createRandomGrid();
    };

    const loadGrid = (index: number): void => {
        const prevGrid = prevGrids.current[index];
        setGridSize(prevGrid.grid_size);
        setGrid(prevGrid.grid);
        setSettings(prev => ({...prev, gridSize: prevGrid.grid_size }))
    }

    const createRandomGrid = () => {
        let grid = [];
        for (let i = 0; i < settings.gridSize; i++) {
            grid.push(Array(settings.gridSize));
            for (let j = 0; j < settings.gridSize; j++) {
                grid[i][j] = Math.round(Math.random() * 2);
            }
        }
        prevGrids.current.push({grid_size: settings.gridSize, grid: grid});
        setGrid(grid);
        setGridSize(settings.gridSize);
        setPixelSize(settings.pixelSize);
    };

    const onMessage = (event: MessageEvent): void => {
        let data = JSON.parse(event.data) as EventData;
        prevGrids.current.push({grid_size: data.grid_size, grid: data.grid})
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
        <div style={{height: "100vh" }}>
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
            <div className="settings">
                <GridPicker maxIndex={prevGrids.current.length - 2} loadGrid={loadGrid}/>
            </div>
            <br />
            {grid && (
                <Grid grid={grid} gridSize={gridSize} pixelSize={pixelSize} />
            )}
        </div>
    );
};

export default MainPage;
