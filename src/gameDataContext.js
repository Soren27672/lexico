import React, { useEffect, useState } from "react";

const gameDataContext = React.createContext();

function GameDataProvider({ children }) {
    const [ gameData, setGameData ] = useState(null)

    useEffect(() => {
        fetch('http://localhost:3000/gameData')
        .then(r => r.json())
        .then(json => {
            setGameData(json);
            setGameData(data => {
                return {...data,
                    valueData: {...data.valueData,
                    coefficient: data.valueData.variance / data.valueData.maxLetterValue
                    }
                }
            })
        });
    },[])

    return <gameDataContext.Provider value={gameData}>{children}</gameDataContext.Provider>
}

export { gameDataContext, GameDataProvider }