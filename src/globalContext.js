import React, { useEffect, useState } from "react";

const globalContext = React.createContext();

function GlobalProvider({ children }) {
    const [ gameData, setGameData ] = useState(null)
    const [userData, setUserData] = useState({
        points: {
          gross: 100000,
          spent: 0,
          net: 100000
        },
        bonusData: [
            {
            level: 0,
            letter: "None",
          },
          {
            level: 0
          },
          {
            level: 0,
            reward: 0,
          }
        ],
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

    useEffect(() => {

        if (gameData === null) return

        const correctNet = userData.points.gross - userData.points.spent;
        if (userData.points.net !== correctNet) {
          setUserData(data => {
            return {...data,
              points: {...data.points,
               net: correctNet
              }
            }
          })
        }
    
        const correctRapidInputReward = Math.ceil(gameData.bonusData[2].recursion.base * (gameData.bonusData[2].recursion.growthRate ** userData.bonusData[2].level));
        if (userData.bonusData[2].reward !== correctRapidInputReward) {
            /* console.log('ran :',userData.bonusData[2].reward,correctRapidInputReward) */
            const newBonusArray = userData.bonusData.map((bonus,index) => index === 2 ? {...bonus, reward: correctRapidInputReward} : bonus);
            setUserData(data => {
                return {...data,
                    bonusData: newBonusArray
                }
            })
        }

        const correctLuckyLetter = gameData.bonusData[0].sequence[userData.bonusData[0].level];
        if (userData.bonusData[0].letter !== correctLuckyLetter) {
            /* console.log('ran :',userData.bonusData[2].reward,correctRapidInputReward) */
            const newBonusArray = userData.bonusData.map((bonus,index) => index === 0 ? {...bonus, letter: correctLuckyLetter} : bonus);
            setUserData(data => {
                return {...data,
                    bonusData: newBonusArray
                }
            })
        }

      },[userData])

    return <globalContext.Provider value={{gameData: gameData, userData: userData, setUserData: setUserData}}>{children}</globalContext.Provider>
}

export { globalContext, GlobalProvider }