import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { globalContext } from "../globalContext";

function Thumbnail({ bonus, path }) {
    const { userData } = useContext(globalContext);

    return (
        <NavLink to={path}>
            <div className="thumbnail">
                <img src={'/'+bonus.image} alt={bonus.name} className="icon thumb" />
                <p>{userData.bonusData[bonus.id - 1][bonus.thumbText]}</p>
            </div>
        </NavLink>
    )
}

export default Thumbnail;