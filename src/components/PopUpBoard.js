import React from "react";

function PopUpBoard({ data: { header, text, button, display }, setData }) {

    return (
        <div id="pop-up-board" style={ { display: display } }>
            <h1>{header}</h1>
            <p>{text}</p>
            <button onClick={() => setData(data => {
                return {...data,
                        display: "none",
                        appClick: "auto",
                        appFilter: "none"
                }
             })}>{button}</button>
        </div>
    )
}

export default PopUpBoard;