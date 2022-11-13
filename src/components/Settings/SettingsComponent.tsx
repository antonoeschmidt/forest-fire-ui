import { Button, FormControlLabel, Switch, TextField } from "@mui/material";
import React from "react";
import { Settings, SimulationData } from "../../pages/MainPage";
import "./SettingsComponent.css";

type Props = {
    startSimulation: () => void;
    establishConnection: () => void;
    startWebSocket: () => void;
    simulationData: SimulationData;
    setSimulationData: React.Dispatch<React.SetStateAction<SimulationData>>;
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
    createRandomGrid: () => void;
    showSimulation: boolean;
    setShowSimulation: React.Dispatch<React.SetStateAction<Boolean>>;
};

const SettingsComponent = (props: Props) => {
    const theme = { padding: "5px" };

    const parseToIntArray = (str: string) => {
        let arr = str.split(",");
        if (arr.length === 2) {
            return [Number(arr[0]), Number(arr[1])];
        } else {
            return null
        }
    };

    return (
        <div className="settings-new">
            <h3>Settings</h3>
            <TextField
                sx={theme}
                variant="outlined"
                label="Pixel size of grid"
                type="number"
                onChange={(e) =>
                    props.setSettings({
                        ...props.settings,
                        pixelSize: Number(e.target.value),
                    })
                }
                value={props.settings.pixelSize}
                InputLabelProps={{ shrink: true }}
            ></TextField>
            <TextField
                sx={theme}
                variant="outlined"
                label="No of rows"
                type="number"
                value={props.settings.gridSize}
                onChange={(e) => {
                    props.setSimulationData({
                        ...props.simulationData,
                        grid_size: Number(e.target.value),
                    });
                    props.setSettings({
                        ...props.settings,
                        gridSize: Number(e.target.value),
                    });
                }}
                InputLabelProps={{ shrink: true }}
            ></TextField>
            <TextField
                sx={theme}
                variant="outlined"
                label="Ignite point"
                type="text"
                defaultValue={`${props.simulationData.start_cell[0]},${props.simulationData.start_cell[1]}`}
                onChange={(e) => {
                    if (parseToIntArray(e.target.value)) {
                        props.setSimulationData({
                            ...props.simulationData,
                            start_cell: parseToIntArray(e.target.value),
                        })
                    }
                }
                }
                InputLabelProps={{ shrink: true }}
            ></TextField>
            <TextField
                sx={theme}
                variant="outlined"
                label="Wind"
                type="text"
                defaultValue={`${props.simulationData.wind[0]},${props.simulationData.wind[1]}`}
                onChange={(e) =>
                    {
                        if (parseToIntArray(e.target.value)) {
                            props.setSimulationData({
                                ...props.simulationData,
                                wind: parseToIntArray(e.target.value),
                            })
                        }
                    }
                }
                InputLabelProps={{ shrink: true }}
            ></TextField>
            <TextField
                sx={theme}
                variant="outlined"
                label="Number of iterations"
                type="number"
                value={props.simulationData.run_until.toString()}
                onChange={(e) =>
                    props.setSimulationData({
                        ...props.simulationData,
                        run_until: Number(e.target.value),
                    })
                }
                InputLabelProps={{ shrink: true }}
            ></TextField>
              <TextField
                sx={theme}
                variant="outlined"
                label="Seed"
                type="number"
                value={props.simulationData.seed.toString()}
                onChange={(e) =>
                    props.setSimulationData({
                        ...props.simulationData,
                        seed: Number(e.target.value),
                    })
                }
                InputLabelProps={{ shrink: true }}
            />
            <FormControlLabel
                control={
                    <Switch
                        defaultChecked
                        onChange={(e) =>
                            props.setSimulationData({
                                ...props.simulationData,
                                slow_simulation: e.target.checked,
                            })
                        }
                    />
                }
                label="Slow simulation"
            />
            <FormControlLabel
                control={
                    <Switch
                        defaultChecked
                        onChange={(e) =>
                            props.setShowSimulation(e.target.checked)
                        }
                    />
                }
                label="Show simulation"
            />
            <Button
                sx={theme}
                style={{ marginTop: "1em" }}
                variant="contained"
                onClick={() => props.startWebSocket()}
            >
                Start WebSocket
            </Button>
            <Button
                sx={theme}
                style={{ marginTop: "1em" }}
                variant="contained"
                onClick={() => props.establishConnection()}
            >
                Establish new connection
            </Button>
            <Button
                sx={theme}
                style={{ marginTop: "1em" }}
                variant="contained"
                onClick={() => props.startSimulation()}
            >
                Start simulation
            </Button>
            <Button
                sx={theme}
                style={{ marginTop: "1em" }}
                variant="contained"
                onClick={() => props.createRandomGrid()}
            >
                Test local grid
            </Button>
        </div>
    );
};

export default SettingsComponent;
