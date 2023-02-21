import React from "react";

function Message({ text, display }) {

    return (
        <div id="message" style={ { display: display}}>
            <p>{text}</p>
        </div>
    )
}

export default Message;