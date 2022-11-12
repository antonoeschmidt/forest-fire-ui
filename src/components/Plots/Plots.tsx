import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

type Props = {
    x: number[];
    y: number[];
};

const options = {
    title: "Burned forest",
    curveType: "function",
    legend: { position: "bottom" },
};

const Plots = (props: Props) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        if (!props.x || !props.y ) return

        let arr = [];
        arr.push(["Time", "Percentage of forest burned"]);

        for (let i = 0; i < props.x.length; i++) {
            arr.push([props.x[i], props.y[i]]);
        }

        setChartData(arr);
    }, [props.x, props.y]);

    return (
        <div>
            {chartData.length > 0 && <Chart
                chartType="LineChart"
                width="100%"
                height="400px"
                data={chartData}
                options={options}
            />}
            
        </div>
    );
};

export default Plots;
