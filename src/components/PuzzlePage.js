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

    function handleGuess(e) {
        if ((e.key.length !== 1) || (e.key.toLowerCase() === e.key.toUpperCase())) {
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

        let amountOfCorrectGuesses = 0;
        Object.keys(puzzleData.guesses).forEach(guess => {
            if (puzzleData.guesses[guess] === true) ++amountOfCorrectGuesses;
        })

        if ((rapidInputTimeout !== null) && (amountOfCorrectGuesses < 6)) {
            clearTimeout(rapidInputTimeout);
            setPuzzleData(data => {
                return {...data,
                    rapidInputs: data.rapidInputs + 1
                }
            })
        }

        if(userData.bonusData[2].level > 0) {
            setRapidInputTimeout(() => {
                return setTimeout(() => {
                    setRapidInputTimeout(null);
                },2000);
            })
        }

    }

    function focus() {
        console.log(div);
        div.current.focus();
    }

    function calculateFinalValue({ value, strikes, rapidInputs, lifesavers, luckyLetters }) {
        const rapidInputData = userData.bonusData[2];

        let returnValue = value;

        returnValue += luckyLetters * gameData.bonusData[0].value;

        if (rapidInputData.level > 0) {
            returnValue += (rapidInputData.reward * Math.min(rapidInputs,5));
        }

        if (lifesavers < strikes) {
            returnValue *= 1 - (gameData.valueData.strike * (strikes - lifesavers));
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
            let luckyLetters = 0;
            const newRevealed = puzzleObj.revealed.map((blank,index) => {
                if (puzzleObj.array[index] === userData.bonusData[0].letter) {
                    ++luckyLetters;
                    return true
                } else return blank
            })

            setPuzzleData({ ...puzzleObj,
                finalValue: calculateFinalValue(puzzleObj),
                revealed: newRevealed,
                lifesavers: userData.bonusData[1].level,
                luckyLetters: luckyLetters
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
    for (const bonus in gameData.bonusData) {
        thumbnails.push(<Thumbnail bonus={gameData.bonusData[bonus]} path={`/shop/${bonus}`} key={gameData.bonusData[bonus].id} />);
    }

    return (
        <div ref={div} id="puzzle-page" onKeyDown={handleGuess} tabIndex={-1}>
            <div id="category"><p>{ puzzleData.category }</p></div>
            <Blanks array={puzzleData.array} revealedArray={puzzleData.revealed}/>
            <Value puzzleData={puzzleData}/>
            <Strikes guesses={puzzleData.guesses}/>
            <div id="round-time"><p>{formatDuration(puzzleData.time)}</p></div>
            {puzzleData.completed ? <div className="button-div"><button onClick={newPuzzle}>» Next Puzzle! »</button></div> : null}
            <div id="thumbnails">
                { thumbnails }
            </div>
        </div>
    )
}

export default PuzzlePage;