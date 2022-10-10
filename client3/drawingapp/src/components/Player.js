import React, { useState } from "react";

function Player(props) {
    const [usernameState, setUsernameState] = useState("");
    const players = <li>client</li>

    return (
        <>
            <p><b>{props.name}</b></p>
            {props.score}
        </>


    )
}
export default Player;