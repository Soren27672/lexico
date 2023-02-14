import React, { useState, useContext } from "react";
import { globalContext } from "../globalContext";
import ShopHighlight from "./ShopHighlight";
import Thumbnail from "./Thumbnail";

function ShopPage() {
    const [ displayed, setDisplayed ] = useState(null);
    const { gameData } = useContext(globalContext);

    let thumbnails = []
    for (const bonus of gameData.bonusData) {
        thumbnails.push(
            <Thumbnail handleClick={() => setDisplayed(bonus)} bonus={bonus} key={bonus.id}/>
        )
    }

    return (
        <div id="shop-page">
            <h1>Let's make some upgrades!</h1>
            { displayed === null ? null : <ShopHighlight bonus={displayed}/> }
            { thumbnails }

        </div>
        
    )
}

export default ShopPage;