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
            <Route exact path="/shop"><h1>Select a Bonus to see its details!</h1></Route>
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