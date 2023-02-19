import React, { useState, useContext } from "react";
import { Route } from "react-router-dom";
import { globalContext } from "../globalContext";
import ShopHighlight from "./ShopHighlight";
import Thumbnail from "./Thumbnail";

function ShopPage({ sendMessage }) {
    const [ displayed, setDisplayed ] = useState(null);
    const { gameData } = useContext(globalContext);

    let thumbnails = []
    for (const bonus in gameData.bonusData) {
        thumbnails.push(
            <Thumbnail path={`/shop/${bonus}`} bonus={gameData.bonusData[bonus]} key={gameData.bonusData[bonus].id}/>
        )
    }

    return (
        <div id="shop-page">
            <h1>Let's make some upgrades!</h1>
            <Route path="/shop/:bonus">
                <ShopHighlight sendMessage={sendMessage}/>
            </Route>
            <div id="thumbnails">
            { thumbnails }
            </div>
        </div>
        
    )
}

export default ShopPage;