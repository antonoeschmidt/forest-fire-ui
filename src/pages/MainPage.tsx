import React, { useEffect, useRef, useState } from "react";
import Arrow from "../components/Arrow/Arrow";
import Grid from "../components/Grid/Grid";
import GridPicker from "../components/GridPicker/GridPicker";
import Plots from "../components/Plots/Plots";
import SettingsComponent from "../components/Settings/SettingsComponent";
import { connectWebsocket } from "../utils/webSocket";
import "./MainPage.css";

export type Settings = {
    gridSize: number;
    pixelSize: number;
    seed: number;
};

export type SimulationData = {
    grid_size: number;
    wind: Array<number>;
    start_cell: Array<Array<number>>;
    slow_simulation: boolean;
    run_until: number;
    seed: number;
};

export type EventData = {
    grid_size: number;
    grid: Array<number[]>;
    wind: Array<number>;
    drones: Array<number[]>;
    stats: { x: number[]; y: number[] };
};

const MainPage = () => {
    const prevGrids = useRef<EventData[]>([]);
    const [grid, setGrid] = useState<Array<number[]>>();
    const [gridSize, setGridSize] = useState<number>(15);
    const [pixelSize, setPixelSize] = useState<number>(500);
    const [seed, setSeed] = useState<number>(1);
    const [settings, setSettings] = useState<Settings>({ gridSize, pixelSize, seed });
    const [wind, setWind] = useState<Array<number>>();
    const [ignitionMap, setIgnitionMap] = useState<[number, number][]>([]);
    const [simulationData, setSimulationData] = useState<SimulationData>({
        grid_size: gridSize,
        wind: [1, 3],
        start_cell: [],
        slow_simulation: true,
        seed: 1,
        run_until: 25,
    });
    const [drones, setDrones] = useState<Array<number>[]>([]);
    const [showSimulation, setShowSimulation] = useState(true);
    const ws = useRef<WebSocket>();
    const [statData, setStatData] = useState<{ x: number[]; y: number[] }>();

    const loadGrid = (index: number): void => {
        const prevGrid = prevGrids.current[index];
        setGridSize(prevGrid.grid_size);
        setGrid(prevGrid.grid);
        setSettings((prev) => ({ ...prev, gridSize: prevGrid.grid_size }));
    };

    const igniteCallback = (x: number, y: number) => {
        if (grid[x][y] === 6) {

        } else if (grid[x][y] === 2) {
            setIgnitionMap(arr => arr.filter(elem => elem[0] !== x && elem[1] !== y))
            grid[x][y] = prevGrids.current.at(-2)['grid'][x][y]
        } else {
            setIgnitionMap(arr => [[x, y], ...arr])
            grid[x][y] = 2
        }

        setGrid(grid)

    }

    useEffect(() => {
        setSimulationData({ ...simulationData, start_cell: ignitionMap })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ignitionMap])

    const createRandomGrid = () => {
        let grid = [];
        for (let i = 0; i < settings.gridSize; i++) {
            grid.push(Array(settings.gridSize));
            for (let j = 0; j < settings.gridSize; j++) {
                grid[i][j] = 1;
            }
        }
        prevGrids.current.push({
            grid_size: settings.gridSize,
            grid: grid,
            wind: [0, 0],
            drones: [],
            stats: { x: [0], y: [0] },
        });
        setGrid(grid);
        setGridSize(settings.gridSize);
        setPixelSize(settings.pixelSize);
    };

    const onMessage = (event: MessageEvent): void => {
        let data = JSON.parse(event.data) as EventData;
        prevGrids.current.push({
            grid_size: data.grid_size,
            grid: data.grid,
            wind: data.wind,
            drones: data.drones,
            stats: data.stats,
        });
        setGridSize(data.grid_size);
        setGrid(data.grid);
        setWind(data.wind);
        setDrones(data.drones);
        setStatData(data.stats);
    };

    const onOpen = (event: Event): void => { };

    const onError = (event: Event): void => {
        createRandomGrid();
    };

    const establishConnection = () => {
        ws.current = connectWebsocket(
            "ws://localhost:8000",
            onMessage,
            onOpen,
            onError
        );
        getGrid();
        getGrid();
    };

    const getGrid = async () => {
        let res = await fetch("http://localhost:5000/grid", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(simulationData),
        });
        let data = await res.json();
        prevGrids.current.push({
            grid_size: settings.gridSize,
            grid: data.grid,
            wind: [0, 0],
            drones: [],
            stats: { x: [0], y: [0] },
        });
        setGridSize(data.grid_size);
        setGrid(data.grid);
        setWind(data.wind);
    }

    const startSimulation = async () => {
        console.log('Data', [simulationData])
        let res = await fetch("http://localhost:5000/run", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(simulationData),
        });
        let data = await res.json();
        console.log(data);
        prevGrids.current = []
    };

    const startWebSocket = async () => {
        let res = await fetch("http://localhost:5000/start-ws", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        let data = await res.json();
        console.log(data);
    };

    useEffect(() => {
        createRandomGrid();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{ height: "100vh", textAlign: "center" }}>
            <h1>Forest Fire Simulation</h1>
            <p style={{ fontSize: 20, margin: 0 }}>Wind direction</p>
            <Arrow wind={wind} />
            <div className="main-container">
                <div className="filler">
                    <Plots x={statData?.x} y={statData?.y} />
                </div>
                {grid && showSimulation ? (
                    <Grid
                        igniteCallback={igniteCallback}
                        drones={drones}
                        grid={grid}
                        gridSize={gridSize}
                        pixelSize={pixelSize}
                    />
                ) : (
                    <div
                        style={{
                            width: pixelSize,
                            height: pixelSize,
                            background: "white",
                            margin: "auto",
                            padding: "3em",
                        }}
                    ></div>
                )}
                <SettingsComponent
                    establishConnection={establishConnection}
                    startSimulation={startSimulation}
                    startWebSocket={startWebSocket}
                    simulationData={simulationData}
                    setSimulationData={setSimulationData}
                    settings={settings}
                    setSettings={setSettings}
                    createRandomGrid={createRandomGrid}
                    showSimulation={showSimulation}
                    setShowSimulation={setShowSimulation}
                    grid={() => { getGrid(); getGrid() }} // Then removing work ;)
                />
            </div>

            <div className="settings">
                <GridPicker
                    maxIndex={prevGrids.current.length - 2}
                    loadGrid={loadGrid}
                />
            </div>
        </div>
    );
};

export default MainPage;
