import React, { useContext } from "react";
import { roundTo } from "round-to";
import { globalContext } from "../globalContext";

function Value({ puzzleData }) {
    const { userData, gameData } = useContext(globalContext);

    const luckyLettersDiv = (
        <div id="lucky-letters">
            <p>{`${puzzleData.luckyLetters} ×`}</p>
            <img src={`/${gameData.bonusData[0].image}`} alt="Lucky Letter" className="icon mini"/>
            <p>{`»  +${puzzleData.luckyLetters * gameData.bonusData[0].value}`}</p>
        </div>
    )

    const rapidInputsDiv = (
        <div id="rapid-inputs">
            <p>{`${puzzleData.rapidInputs} ×`}</p>
            <img src={`/${gameData.bonusData[2].image}`} alt="Rapid Input" className="icon mini"/>
            <p>{`»  +${puzzleData.rapidInputs * userData.bonusData[2].reward}`}</p>
        </div>
    )

    const strikesDiv = (
        <div id="strikes">
            <p>{`${puzzleData.strikes} ×`}</p>
            <img src={'/strike.png'} alt="Strike" className="icon mini"/>
            <p>{`»  -${Math.round(puzzleData.strikes * gameData.valueData.strike * 100)}%`}</p>
        </div>
    )

    const lifesaversDiv = (
        <div id="lifesavers">
            <p>{Math.min(puzzleData.strikes,puzzleData.lifesavers) + ' ×'}</p>
            <img src={`/${gameData.bonusData[1].image}`} className="icon mini"/>
            <p>{`»  +${Math.round(Math.min(puzzleData.strikes,puzzleData.lifesavers) * gameData.valueData.strike * 100)}%`}</p>
        </div>
    )

    return (
        <div id="value">
            <div id="initial"><p>{puzzleData.value}</p></div>
            {puzzleData.luckyLetters > 0 ? luckyLettersDiv : null}
            {puzzleData.rapidInputs > 0 ? rapidInputsDiv : null}
            {puzzleData.strikes > 0 ? strikesDiv : null}
            {(puzzleData.strikes > 0) && (puzzleData.lifesavers > 0) ? lifesaversDiv : null}
            <div id="final"><p>{puzzleData.finalValue}</p></div>
        </div>
    )
}

export default Value;