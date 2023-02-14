import React from "react";

function ShopHighlight({ bonus }) {

    return (
        <div id="shop-highlight">
            <img src={bonus.image} />
            <h1>{bonus.name}</h1>
            <p>{bonus.description}</p>
            <strong>{bonus.price.base}</strong>
        </div>
    )
}

export default ShopHighlight;