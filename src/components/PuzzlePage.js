import React, { useRef, useEffect } from "react";
import Blanks from "./Blanks";
import Strikes from "./Strikes";
import Thumbnail from "./Thumbnail";
import Value from "./Value";

function PuzzlePage({ puzzleData, setPuzzleData }) {
    const { category, string, value } = puzzleData;
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
                    strikes: instancesOfValueInObject({...(current.guesses), [guess]: false},false)
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
        return;

    }

    function focus() {
        div.current.focus();
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
            <Blanks string={string}/>
            <Value value={value}/>
            <Strikes />
            <div id="thumbnails">
                <Thumbnail />
                <Thumbnail />
                <Thumbnail />
            </div>
        </div>
    )
}

export default PuzzlePage;