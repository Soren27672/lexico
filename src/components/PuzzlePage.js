import formatDuration from "format-duration";
import React, { useRef, useEffect, useState } from "react";
import Blanks from "./Blanks";
import Strikes from "./Strikes";
import Thumbnail from "./Thumbnail";
import Value from "./Value";

function PuzzlePage({ puzzleObj, handlePuzzleUpdated, handleCompleted, newPuzzle, pageClosed, userData, initialized, setInitialized }) {
    const [ puzzleData, setPuzzleData ] = useState({...puzzleObj});
    const [ sessionInterval, setSessionInterval ] = useState(null);
    const div = useRef();

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
            setPuzzleData(current => {
                return {...current,
                    finalValue: calculateFinalValue(current)
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

    }

    function focus() {
        div.current.focus();
    }

    function calculateFinalValue({ value, strikes, rapidInput, array }) {
        let returnValue = value;
        
        if (strikes > 0) {
            returnValue -= strikes * 40;
        }


        if (userData.bonusData.luckyLetter.level > 0) {
            array.forEach(letter => {
                if (letter === userData.bonusData.luckyLetter.letter) {
                    returnValue += 50;
                }
             });
        }
        
         if (userData.bonusData.rapidInput > 0) {
            returnValue = returnValue * (userData.bonusData.rapidInput.value ** rapidInput);
         }

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
            setPuzzleData(current => {
                return {...current,
                    completed: true
                }
            })
        }

        if ((puzzleData.completed) && (puzzleData.completedRan === false)) {
            clearInterval(sessionInterval);
            setSessionInterval(null);
            handleCompleted();
            setPuzzleData(current => {
                return {...current,
                    completedRan: true
                }
            })
        }

    },[puzzleData])

    useEffect(() => {
        if (initialized === false) {
            setPuzzleData({ ...puzzleObj});
            setInitialized(true);
        }
            
        console.log(sessionInterval,puzzleData.completed,!sessionInterval && !(puzzleData.completed))
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

    return (
        <div ref={div} id="puzzle-page" onKeyDown={handleGuess} tabIndex={-1}>
            <small>{ puzzleData.category }</small>
            <Blanks array={puzzleData.array} revealedArray={puzzleData.revealed}/>
            <Value puzzleData={puzzleData}/>
            <Strikes guesses={puzzleData.guesses}/>
            <p>{`Time: ${formatDuration(puzzleData.time)}`}</p>
            {puzzleData.completed ? <button onClick={newPuzzle}>Next Puzzle!</button> : null}
            <div id="thumbnails">
                <Thumbnail />
                <Thumbnail />
                <Thumbnail />
            </div>
        </div>
    )
}

export default PuzzlePage;