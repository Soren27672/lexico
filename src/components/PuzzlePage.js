import React, { useRef, useEffect } from "react";
import Blanks from "./Blanks";
import Strikes from "./Strikes";
import Thumbnail from "./Thumbnail";
import Value from "./Value";

function PuzzlePage({ puzzleData, setPuzzleData, newPuzzle, puzzleCompleted, userData }) {
    const { category, array, revealed, value, guesses, completed } = puzzleData;
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
            return {...current,
                revealed: current.revealed.map((blank,subIndex) => {
                    return current.array[subIndex] === guess ? true : blank
                }),
                guesses: {...(current.guesses), [guess]: true}
            }
        });

        setPuzzleData(current => {
            for (const letter of current.revealed) {
                if (letter === false) return {...current}
            }

            puzzleCompleted(current.finalValue);
            return {...current, completed: true}
        });

    }

    function focus() {
        div.current.focus();
    }

    function calculateFinalValue({ value, strikes, rapidInput, array }) {
        console.log(value, strikes, rapidInput, array)
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

         console.log(returnValue);

         return returnValue;
    }

    function instancesOfValueInObject(object, value) {
        let i = 0;
        for (const key in object) {
            if (object[key] === value) ++i;
            console.log(object,key,value,object[key] === value,i)
        }
        return i;
    }

    useEffect(focus,[])

    return (
        <div ref={div} id="puzzle-page" onKeyDown={handleGuess} tabIndex={-1}>
            <small>{ category }</small>
            <Blanks array={array} revealedArray={revealed}/>
            <Value puzzleData={puzzleData}
            setPuzzleData={setPuzzleData}
            userData={userData}/>
            <Strikes guesses={guesses}/>
            {completed ? <button onClick={newPuzzle}>Next Puzzle!</button> : null}
            <div id="thumbnails">
                <Thumbnail />
                <Thumbnail />
                <Thumbnail />
            </div>
        </div>
    )
}

export default PuzzlePage;