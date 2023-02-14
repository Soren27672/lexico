import React, { useContext } from "react";
import { globalContext } from "../globalContext";

function ShopHighlight({ bonus }) {
    /* const upgradeActive = userData.points.net >=  */
    const { userData } = useContext(globalContext);
    const userBonusData = userData.bonusData[bonus.id - 1];
    const upgradePrice = Math.ceil(bonus.price.base * (bonus.price.growthRate ** userBonusData.level));
    let nextValue;
    if (bonus.progression === "sequence") nextValue = bonus.sequence[userBonusData.level + 1];
    if (bonus.progression === "increment") nextValue = userBonusData.level + 1;
    if (bonus.progression === "recursive") {
        nextValue = bonus.recursion.base * (bonus.recursion.growthRate ** userBonusData.level);
    }

    return (
        <div id="shop-highlight">
            <img src={bonus.image} />
            <h1>{bonus.name}</h1>
            <p>{bonus.description}</p>
            <strong>{upgradePrice}</strong>
            <button onClick={() => console.log('Hello')}>Upgrade</button>
            <em>{`(to ${nextValue})`}</em>
        </div>
    )
}

export default ShopHighlight;