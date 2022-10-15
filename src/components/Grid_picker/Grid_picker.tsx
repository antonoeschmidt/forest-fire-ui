import React, { useState } from "react";
import { Slider, Button, Box } from "@mui/material";

type Props = {
  maxIndex: number;
  loadGrid: (index: number) => void;
};

const GridPicker = (props: Props) => {
  const [currentIndex, setIndex] = useState<number>(0);

  return (
    <Box width="500px">
      <Slider
        min={0}
        max={props.maxIndex}
        onChange={(e: any) => setIndex(e.target.value)}
        disabled={props.maxIndex < 1}
      ></Slider>

      <Box className="settings">
        <p>Current index: {currentIndex}</p>
        <Button
          style={{ marginLeft: "20px" }}
          variant="contained"
          onClick={(e) => props.loadGrid(currentIndex)}
        >
          Set grid
        </Button>
      </Box>
    </Box>
  );
};

export default GridPicker;
