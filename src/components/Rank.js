import formatDuration from "format-duration";
import React from "react";
import { roundTo } from "round-to";

function Rank({ userObj }) {
    console.log(userObj)
    const { name, points, time } = userObj;

    return (
        <div className="rank">
            <strong>{name}</strong>
            <p>{`${points} points in ${formatDuration(time)}`}</p>
            <em>{`${roundTo(points / (time / 60000),2)} points per minute`}</em>
        </div>
    )
}

export default Rank;