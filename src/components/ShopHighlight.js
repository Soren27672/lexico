import React from "react";
import { useRouteMatch } from "react-router-dom";

function ShopHighlight() {
    const match = useRouteMatch();

    return (
        <div id="shop-highlight">
            <h1>Shop Highlight!</h1>
        </div>
    )
}

export default ShopHighlight;