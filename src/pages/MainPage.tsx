import React, { useEffect, useRef, useState } from "react";
import Arrow from "../components/Arrow/Arrow";
import Grid from "../components/Grid/Grid";
import GridPicker from "../components/GridPicker/GridPicker";
import { SettingsEditor } from "../components/SettingsEditor/SettingsEditor";
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
  run_until: number;
  seed: number;
  slow_simulation: boolean;
  number_of_drones: number;
  drone_base_location: {x: Number, y: number};
  veg_low_burn_time: number;
  veg_medium_burn_time: number;
  veg_high_burn_time: number;
  spread_after: number;
  drone_speed: number;
};

export type Cell = {
  vegetation: number;
  nOfDrones: number;
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

  const loadedSettings =
    localStorage.getItem("settings") != null &&
    (JSON.parse(localStorage.getItem("settings")) as unknown as SimulationData);

  const baseSimData = {
    grid_size: 50,
    wind: [1, 3],
    start_cell: [],
    slow_simulation: true,
    seed: 1,
    run_until: 25,
    number_of_drones: 20,
    drone_base_location: {x: 2, y: 2},
    veg_low_burn_time: 10,
    veg_medium_burn_time: 15,
    veg_high_burn_time: 20,
    spread_after: 5,
    ignition_points: [[1,1], [40,40]],
    drone_speed: 4
  };

  const myGridSize = loadedSettings ? loadedSettings.grid_size : 15;
  const mySeed = loadedSettings ? loadedSettings.seed : 1;

  const [grid, setGrid] = useState<Array<number[]>>();
  const [gridSize, setGridSize] = useState<number>(myGridSize);
  const [pixelSize, setPixelSize] = useState<number>(500);
  const [seed, setSeed] = useState<number>(mySeed);
  const [settings, setSettings] = useState<Settings>({
    gridSize: myGridSize,
    pixelSize,
    seed: mySeed,
  });
  const [wind, setWind] = useState<Array<number>>();
  const [ignitionMap, setIgnitionMap] = useState<[number, number][]>([]);

  const [simulationData, setSimulationData] = useState<SimulationData>(loadedSettings ? loadedSettings : baseSimData);
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

  useEffect(() => {
    setGridSize(settings.gridSize);
  }, [settings]);

  const igniteCallback = (x: number, y: number) => {
    if (grid[x][y] === 6) {
    } else if (grid[x][y] === 2) {
      setIgnitionMap((arr) =>
        arr.filter((elem) => elem[0] !== x && elem[1] !== y)
      );
      grid[x][y] = prevGrids.current.at(-2)["grid"][x][y];
    } else {
      setIgnitionMap((arr) => [[x, y], ...arr]);
      grid[x][y] = 2;
    }

    setGrid(grid);
  };

  useEffect(() => {
    setSeed(1);
    setSimulationData({ ...simulationData, start_cell: ignitionMap });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ignitionMap]);

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

  const onOpen = (event: Event): void => {};

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
    setIgnitionMap([]);
  };

  const startSimulation = async () => {
    console.log("Data", [simulationData]);
    let res = await fetch("http://localhost:5000/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(simulationData),
    });
    let data = await res.json();
    console.log(data);
    prevGrids.current = [];
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
        <div>
          <SettingsEditor
            simulationData={simulationData}
            setSimulationData={setSimulationData}
            setSettings={setSettings}
          />
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
            grid={() => {
              getGrid();
              getGrid();
            }} // Then removing work ;)
          />
        </div>
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
