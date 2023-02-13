import React from "react";

function Strikes({ guesses }) {

    function generateIncorrect(guesses) {
        let returnString = '  ';
        for (const guess in guesses) {
            if (!guesses[guess]) returnString += `${guess}  `;
        }
        return returnString;
    }

    return (
        <p>{generateIncorrect(guesses)}</p>
    )
}

export default Strikes;