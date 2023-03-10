import React from "react";

function Blanks({ array, revealedArray }) {

    function generateBlanks(array, revealedArray) {
        return array.reduce((ac,letter,index) => {
            if (revealedArray[index] === true) return ac + `${letter} `;
            if (revealedArray[index] === false) return ac + `_ `;
            if (revealedArray[index] === null) return ac + `   `;
        }, '')
    }

    return (
        <div className="blanks">
            <h1>{generateBlanks(array,revealedArray)}</h1>
        </div>
    )
}

export default Blanks;