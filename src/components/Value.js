import React from "react";

function Value({ puzzleData }) {

    return (
        <p>{`Initial: ${puzzleData.value} | Strikes: ${puzzleData.strikes} | Final: ${puzzleData.finalValue}`}</p>
    )
}

export default Value;