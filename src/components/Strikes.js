import React from "react";

function Strikes({ guesses }) {

    function generateIncorrect(guesses) {
        let returnString = '  ';
        for (const guess in guesses) {
            if (!guesses[guess]) returnString += `${guess}  `;
        }

        if (returnString === '  ') return undefined;

        return returnString;
    }

    if (generateIncorrect(guesses) !== undefined) return (
        <div id="incorrect-guesses">
            <img src="/Strike.png" alt="Strikes" className="icon mini" />
            <p>{generateIncorrect(guesses)}</p>
            <img src="/Strike.png" alt="Strikes" className="icon mini" />
        </div>
    )

    return <></>
}

export default Strikes;