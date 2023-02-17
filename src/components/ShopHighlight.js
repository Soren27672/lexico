import React, { useContext } from "react";
import { globalContext } from "../globalContext";

function ShopHighlight({ bonus }) {
    /* const upgradeActive = userData.points.net >=  */
    const { progression, sequence, recursion, price, image, name, description, id } = bonus
    const { userData, setUserData } = useContext(globalContext);
    const userBonusData = userData.bonusData[id - 1];
    const upgradePrice = Math.ceil(price.base * (price.growthRate ** userBonusData.level));

    function handleUpgradeClick() {
        if ((userData.points.net >= upgradePrice) && (userBonusData.level < bonus.limit)) {
            console.log('Upgrade allowed');

            const updatedBonusArray = userData.bonusData.map((bonus,index) => {
                return index === id - 1
                    ? {...bonus,
                        level: bonus.level + 1
                    }
                    : bonus
            })

            setUserData(data => {
                return {...data,
                    bonusData: updatedBonusArray,
                    points: {...data.points,
                        spent: data.points.spent + upgradePrice}
                }
            })
        } else console.log('Insufficient funds');
    }
    

    let nextValue;
    if (progression === "sequence") nextValue = sequence[userBonusData.level + 1];
    if (progression === "increment") nextValue = userBonusData.level + 1;
    if (progression === "recursive") {
        nextValue = Math.ceil(recursion.base * (recursion.growthRate ** (userBonusData.level + 1)));
    }

    return (
        <div id="shop-highlight">
            <img src={image} alt={name}/>
            <h1>{name}</h1>
            <p>{description}</p>
            <strong>{upgradePrice}</strong>
            <button onClick={handleUpgradeClick}>Upgrade</button>
            <em>{`(to ${nextValue})`}</em>
        </div>
    )
}

export default ShopHighlight;