import React from "react";
import Blanks from "./Blanks";
import Strikes from "./Strikes";
import Thumbnail from "./Thumbnail";
import Value from "./Value";

function PuzzlePage({ puzzleData }) {
    const { category, string } = puzzleData;

    return (
        <div id="puzzle-page">
            <small>{ category }</small>
            <Blanks string={string}/>
            <Value />
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