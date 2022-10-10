import React, { useState } from "react";

function Header(props) {
    const [timer, setTimer] = useState(10);

    var timer2 = 10;
    var intervalId;

    function startTimer() {
        setTimer(10);
        timer2 = 10;
        intervalId = setInterval(decrementTime, 1000)

    }
    function decrementTime() {
        if (timer2 <= 0) {
            clearInterval(intervalId);
            console.log("Time over")
        } else {
            setTimer(oldNum => oldNum - 1)
            timer2--;
        }
    }

    return (
        <div className="header">
            <p>Logged in as: {props.username} </p>
            <p>Lobby Id: {props.lobbyid}</p>
            {props.showButton
                ? <button className="startgame" onClick={() => {
                    props.startGame();
                    startTimer()
                }}>Start Game</button>
                : <>{props.children}</>
            }

            <button className="logout" onClick={props.leaveLobby}>Leave Lobby</button>
        </div>

    )
}
export default Header;