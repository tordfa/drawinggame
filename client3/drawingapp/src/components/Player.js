import React, {useState} from "react";

function Player(props) {
    const [usernameState, setUsernameState] = useState("");
    const players = <li>client</li>

    return (
    <p>{props.name}  {props.score}</p>

    )
}
export default Player;