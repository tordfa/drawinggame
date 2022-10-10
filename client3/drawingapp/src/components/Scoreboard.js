import React, { useState } from "react";

function Scoreboard(props) {
    const [usernameState, setUsernameState] = useState("");
    const players = <li>client</li>

    return (
        <div className="scoreboardContainer">
            <h2>Score:</h2>
            <ul className="playerList">
                {props.children}
            </ul>
        </div>

    )
}
export default Scoreboard;