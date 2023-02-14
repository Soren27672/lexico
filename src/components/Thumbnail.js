import React, { useContext } from "react";
import { globalContext } from "../globalContext";

function Thumbnail({ bonus, handleClick }) {
    const { userData } = useContext(globalContext);

    return (
        <div onClick={handleClick}>
            <img src={bonus.image} />
            <p>{userData.bonusData[bonus.id - 1][bonus.thumbText]}</p>
        </div>
    )
}

export default Thumbnail;