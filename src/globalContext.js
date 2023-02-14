import React, { useEffect, useState } from "react";

const globalContext = React.createContext();

function GlobalProvider({ children }) {
    const [ gameData, setGameData ] = useState(null)
    const [userData, setUserData] = useState({
        points: {
          gross: 0,
          spent: 0,
          net: 0
        },
        bonusData: {
          rapidInput: {
            level: 0,
            value: 0,
          },
          lifesaver: 0,
          luckyLetter: {
            level: 0,
            letter: null,
          }
        },
        time: 0
      })

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

    return <globalContext.Provider value={{gameData: gameData, userData: userData, setUserData: setUserData}}>{children}</globalContext.Provider>
}

export { globalContext, GlobalProvider }