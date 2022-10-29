import React, { useState } from "react";
import { Slider, Button, Box } from "@mui/material";

type Props = {
    maxIndex: number;
    loadGrid: (index: number) => void;
};

const GridPicker = (props: Props) => {
    const [currentIndex, setIndex] = useState<number>(0);
    const leftArrow = '\u2190'
    const rightArrow = '\u2192'

    return (
        <Box width="500px">
            <Slider
                min={0}
                max={props.maxIndex}
                onChange={(e: any) => {
                  setIndex(e.target.value)
                  props.loadGrid(currentIndex)
                }}
                disabled={props.maxIndex < 1}
                value={currentIndex}
            ></Slider>

            <Box className="settings">
                <p>Current step: {currentIndex}</p>
                <Button
                    variant="contained"
                    style={{ marginLeft: "20px" }}
                    onClick={() => {
                        props.loadGrid(currentIndex - 1);
                        setIndex(currentIndex - 1);
                    }}
                >
                    {leftArrow}
                </Button>
                <Button
                    variant="contained"
                    style={{ marginLeft: "20px" }}
                    onClick={() => {
                        props.loadGrid(currentIndex + 1);
                        setIndex(currentIndex + 1);
                    }}
                >
                    {rightArrow}
                </Button>
                
            </Box>
        </Box>
    );
};

export default GridPicker;
