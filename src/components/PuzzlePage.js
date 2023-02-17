import formatDuration from "format-duration";
import React, { useRef, useEffect, useState, useContext } from "react";
import { globalContext } from "../globalContext";
import Blanks from "./Blanks";
import Strikes from "./Strikes";
import Thumbnail from "./Thumbnail";
import Value from "./Value";

function PuzzlePage({ puzzleObj, handlePuzzleUpdated, handleCompleted, newPuzzle, pageClosed, userData, initialized, setInitialized }) {
    const [ puzzleData, setPuzzleData ] = useState({...puzzleObj});
    const [ sessionInterval, setSessionInterval ] = useState(null);
    const [ rapidInputTimeout, setRapidInputTimeout ] = useState(null);
    const div = useRef();
    const { gameData } = useContext(globalContext);

    /* console.log('On reregistry: ',puzzleData) */

    function handleGuess(e) {
        if ((e.key.length !== 1) || (e.key.toLowerCase() === e.key.toUpperCase())) {
            console.log('Invalid Character');
            return
        }

        let correct = false;
        const guess = e.key.toUpperCase();
        for (const index in puzzleData.array) {
            if(puzzleData.array[index] === guess) {
                correct = true;
            }    
        }

        if (!correct) {
            setPuzzleData(current => {
                return {...current,
                    guesses: {...(current.guesses), [guess]: false},
                    strikes: instancesOfValueInObject({...(current.guesses), [guess]: false},false),
                }
            })
            return;
        }

        setPuzzleData(current => {
            const newRevealed = current.revealed.map((blank,index) => {
                return current.array[index] === guess ? true : blank
            })
            return {...current,
                revealed: newRevealed,
                guesses: {...(current.guesses), [guess]: true}
            }
        });

        if (rapidInputTimeout !== null) {
            clearTimeout(rapidInputTimeout);
            console.log('Guess registered while timer active');
            setPuzzleData(data => {
                /* console.log({...data, rapidInputs: data.rapidInputs + 1}); */
                return {...data,
                    rapidInputs: data.rapidInputs + 1
                }
            })
        }

        if(userData.bonusData[2].level > 0) {
            console.log('Activated timer');
            setRapidInputTimeout(() => {
                return setTimeout(() => {
                console.log('Timer expired');
                    setRapidInputTimeout(null);
                },2000);
            })
        }

    }

    function focus() {
        div.current.focus();
    }

    function calculateFinalValue({ value, strikes, rapidInputs, array }) {
        const luckyLetterData = userData.bonusData[0];
        const lifesaverData = userData.bonusData[1];
        const rapidInputData = userData.bonusData[2];

        let returnValue = value;

        if (luckyLetterData.level > 0) {
            array.forEach(letter => {
                if (letter === luckyLetterData.letter) {
                    returnValue += gameData.bonusData[0].value;
                }
             });
        }

         if (rapidInputData.level > 0) {
            console.log(rapidInputData.reward,rapidInputs);
            returnValue += (rapidInputData.reward * rapidInputs);
         }

         if (lifesaverData.level < strikes) {
            returnValue *= 1 - (gameData.valueData.strike * (strikes - lifesaverData.level));
        }

         returnValue = Math.ceil(returnValue)

         return returnValue;
    }

    function instancesOfValueInObject(object, value) {
        let i = 0;
        for (const key in object) {
            if (object[key] === value) ++i;
        }
        return i;
    }

    useEffect(() => {
        focus();

        return () => {
            clearInterval(sessionInterval);
            setSessionInterval(null);
            pageClosed();
        };
    },[])

    useEffect(() => {
        handlePuzzleUpdated(puzzleData);

        const lettersRemaining = puzzleData.revealed.filter(blank => blank === false).length;

        if ((lettersRemaining === 0) && (puzzleData.completed === false)) {
            setPuzzleData(data => {
                return {...data,
                    completed: true
                }
            })
        }

        if ((puzzleData.completed) && (puzzleData.completedRan === false)) {
            clearInterval(sessionInterval);
            setSessionInterval(null);
            handleCompleted();
            setPuzzleData(data => {
                return {...data,
                    completedRan: true
                }
            })
        }

        if (puzzleData.finalValue !== calculateFinalValue(puzzleData)) {
            setPuzzleData(data => {
                return {...data,
                    finalValue: calculateFinalValue(data)
                }
            })
        }

    },[puzzleData])

    useEffect(() => {
        if (initialized === false) {
            console.log(puzzleObj);
            const newRevealed = puzzleObj.revealed.map((blank,index) => {
                return puzzleObj.array[index] === userData.bonusData[0].letter ? true : blank
            })

            setPuzzleData({ ...puzzleObj,
                finalValue: calculateFinalValue(puzzleObj),
                revealed: newRevealed
            });
            setInitialized(true);
        }
            
        if (!sessionInterval && !(puzzleData.completed)) {
            const interval = setInterval(() => {
                setPuzzleData(current => {
                    return {...current,
                        time: current.time + 1000
                    }
                })
            },1000)
        
            setSessionInterval(interval);
        }
    })

    let thumbnails = [];
    for (const bonus of gameData.bonusData) {
        thumbnails.push(<Thumbnail bonus={bonus} key={bonus.id} />);
    }

    return (
        <div ref={div} id="puzzle-page" onKeyDown={handleGuess} tabIndex={-1}>
            <small>{ puzzleData.category }</small>
            <Blanks array={puzzleData.array} revealedArray={puzzleData.revealed}/>
            <Value puzzleData={puzzleData}/>
            <Strikes guesses={puzzleData.guesses}/>
            <p>{`Time: ${formatDuration(puzzleData.time)}`}</p>
            {puzzleData.completed ? <button onClick={newPuzzle}>Next Puzzle!</button> : null}
            <div id="thumbnails">
                { thumbnails }
            </div>
        </div>
    )
}

export default PuzzlePage;