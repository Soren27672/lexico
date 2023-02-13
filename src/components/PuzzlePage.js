import React, { useRef, useEffect } from "react";
import Blanks from "./Blanks";
import Strikes from "./Strikes";
import Thumbnail from "./Thumbnail";
import Value from "./Value";

function PuzzlePage({ puzzleData }) {
    const { category, string, value } = puzzleData;
    const div = useRef();
    console.log(div.current);

    function handleGuess(e) {
        console.log(e.key);
    }

    function focus() {
        div.current.focus();
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