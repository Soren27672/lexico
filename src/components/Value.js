import React, { useContext } from "react";
import { globalContext } from "../globalContext";

function Value({ puzzleData }) {
    const { userData } = useContext(globalContext);

    return (
        <p>{`Initial: ${puzzleData.value} | Strikes: ${Math.max(puzzleData.strikes - userData.bonusData[1].level,0)} | Lifesavers Used: ${Math.min(userData.bonusData[1].level,puzzleData.strikes)} | Rapid Input Bonuses: ${puzzleData.rapidInputs} | Final: ${puzzleData.finalValue}`}</p>
    )
}

export default Value;