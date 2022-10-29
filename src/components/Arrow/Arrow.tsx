import React, { useCallback, useEffect, useState } from "react";
import "./Arrow.css";

type Props = {
    wind: Array<number>;
};

class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /* Length of a vector Formula: sqrt(x^2 + y^2) */
    len = (): number => {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    };
}

const Arrow = (props: Props) => {
    const [rotation, setRotation] = useState(0);

    const calculateAngle = useCallback(() => {
        const basisVector = new Vector(0, 1);
        const windVector = new Vector(props.wind[0], props.wind[1]);

        // Formula: cos(v) = dotproduct(a,b) / (len(a) * len(b))
        const dotProduct =
            basisVector.x * windVector.x + basisVector.y * windVector.y;
        const lengthsProduct = basisVector.len() * windVector.len();
        const cos = dotProduct / lengthsProduct;
        const angle = Math.acos(cos) * (180 / Math.PI); // Converts radians to degrees

        setRotation(windVector.x > 0 ? -angle : angle);
    }, [props.wind]);

    useEffect(() => {
        if (props.wind) {
            calculateAngle();
        }
    }, [calculateAngle, props.wind]);

    return (
        <div className="arrow" style={{ transform: `rotate(${rotation}deg)` }}>
            <div className="arrow-body" />
            <div className="arrow-head" />
        </div>
    );
};

export default Arrow;
