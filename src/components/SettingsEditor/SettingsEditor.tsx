import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, TextField, } from '@mui/material';
import { Settings, SimulationData } from "../../pages/MainPage";
import { Box } from "@mui/system";

type Props = {
    simulationData: SimulationData;
    setSimulationData: (simulationData: SimulationData) => void;
    setSettings: Dispatch<SetStateAction<Settings>>;
};

export const SettingsEditor = ({ simulationData, setSimulationData, setSettings }: Props) => {
  const [editorSettings, setEditorSettings] = useState<string>(JSON.stringify(simulationData));

  const onClickSave = () => {
    localStorage.setItem("settings", editorSettings);
    const mySimData: SimulationData = JSON.parse(editorSettings) as unknown as SimulationData;
    setSimulationData(mySimData);
    setSettings(prev => ({
        ...prev,
        gridSize: mySimData.grid_size,
        seed: mySimData.seed
    })
    )
    };
  return (
    <Box style={{width: "400px", paddingRight: "5rem"}}>
      <h3>Configs</h3>
        <TextField defaultValue={JSON.stringify(simulationData)} size="medium"
        minRows={10} multiline={true} style={{width: "400px"}} 
        onChange={e => {
            setEditorSettings(e.target.value);
        }}
        />
      <Button
        onClick={() => {
          onClickSave();
        }}
        style={{marginTop: "1rem"}}
        type="submit"
        variant="contained"
      >
        Apply settings
      </Button>
    </Box>
  );
};