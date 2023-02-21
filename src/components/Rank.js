import formatDuration from "format-duration";
import React from "react";
import { roundTo } from "round-to";

function Rank({ userObj, rank }) {
    const { name, points, time, date } = userObj;
    const pointRate = roundTo(points / (time / 60000),2);

    return (
        <div className="rank">
            <p>{rank}</p>
            <strong>{name}</strong>
            <p>{`${pointRate} points per minute`}</p>
            <em>{`${points} points in ${formatDuration(time)}`}</em>
            <p>{date}</p>
        </div>
    )
}

export default Rank;