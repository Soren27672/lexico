import React, { useState, useContext } from "react";
import { gameDataContext } from "../gameDataContext";
import ShopHighlight from "./ShopHighlight";

function ShopPage() {
    const [ displayed, setDisplayed ] = useState(null);
    const gameData = useContext(gameDataContext);

    let thumbnails = []
    for (const bonus in gameData.bonusData)

    return (
        <div id="shop-page">
            <h1>Let's make some upgrades!</h1>
            { displayed === null ? null : <ShopHighlight /> }
            { thumbnails }

        </div>
        
    )
}

export default ShopPage;