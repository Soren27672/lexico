import React, { useContext } from "react";
import { globalContext } from "../globalContext";

function Thumbnail({ bonus }) {
    const { userData } = useContext(globalContext);

    return (
        <div>
            <img src="../public/logo192.png" />
            <p>{`${bonus.name} | ${userData.bonusData[bonus.thumbText]}`}</p>
        </div>
    )
}

export default Thumbnail;