import { Button, TextField } from "@mui/material";
import React from "react";
import { SimulationData } from "../../pages/MainPage";
import "./SettingsComponent.css";

type Props = {
    startSimulation: () => void;
    establishConnection: () => void;
    startWebSocket: () => void;
    simulationData: SimulationData;
    setSimulationData: React.Dispatch<React.SetStateAction<SimulationData>>;
    setGridSize: React.Dispatch<React.SetStateAction<Number>>;
    setPixelSize: React.Dispatch<React.SetStateAction<Number>>;
};

const SettingsComponent = (props: Props) => {
    const theme = { padding: "5px" };

    const parseToIntArray = (str: string) => {
        let arr = str.split(".");
        return [Number(arr[0]), Number(arr[1])] 
    }

    return (
        <div className="settings-new">
            <h3>Settings</h3>
            <TextField
                sx={theme}
                variant="outlined"
                label="Pixel size of grid"
                type="number"
                onChange={(e) =>
                    props.setPixelSize(Number(e.target.value))
                }
            ></TextField>
            <TextField
                sx={theme}
                variant="outlined"
                label="No of rows"
                type="number"
                // value={props.simulationData.grid_size.toString()}
                onChange={(e) =>
                    {
                        props.setSimulationData({
                        ...props.simulationData,
                        grid_size: Number(e.target.value),
                    })
                    props.setGridSize(Number(e.target.value))
                }
                }
            ></TextField>
            <TextField
                sx={theme}
                variant="outlined"
                label="Ignite point"
                type="number"
                // value={props.simulationData.grid_size.toString()}
                onChange={(e) =>
                    props.setSimulationData({
                        ...props.simulationData,
                      start_cell: parseToIntArray(e.target.value)
                    })
                }
            ></TextField>
            <TextField
                sx={theme}
                variant="outlined"
                label="Wind"
                type="number"
                onChange={(e) =>
                    props.setSimulationData({
                        ...props.simulationData,
                      wind: parseToIntArray(e.target.value)
                    })
                }
            ></TextField>
            <TextField
                sx={theme}
                variant="outlined"
                label="Number of iterations"
                type="number"
                // value={props.simulationData.run_until.toString()}
                onChange={(e) =>
                    props.setSimulationData({
                        ...props.simulationData,
                        run_until: Number(e.target.value)
                    })
                }
            ></TextField>
            <TextField
                sx={theme}
                variant="outlined"
                label="Slow simulation"
                type="string"
                // value={props.simulationData.slow_simulation.toString()}
                onChange={(e) =>
                    props.setSimulationData({
                        ...props.simulationData,
                        slow_simulation: Boolean(e.target.value)
                    })
                }
            ></TextField>
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
        </div>
    );
};

export default SettingsComponent;
