import Chat from './Chat.js'
import Game from './Game.js'
import React, { useState, useEffect } from 'react';
import Scoreboard from './Scoreboard.js';
import Player from './Player';
import Header from './Header'

function Gameview(props) {
    const [players, setPlayers] = useState([]);
    const [lobbyid, setLobbyId] = useState(props.client.lobbyid);
    const [username, setUsername] = useState(props.client.username)
    const [showButton, setShowButton] = useState(1);
    const [timer, setTimer] = useState(120)
    const drawingTime = 120;


    useEffect(() => {
        props.client.listen(updateScoreboard, updateHeader);
        props.client.onclose(props.leaveLobby);
    }, [])

    function updateScoreboard(players) {
        var playerstest = [];
        for (let i = 0; i < players.length; i++) {
            var player = <Player name={players[i][0]} score={players[i][1]}></Player>
            playerstest.push(player)
        }
        setPlayers(playerstest)
    }

    function updateHeader(lobbyid) {
        setLobbyId(lobbyid)
    }

    function startGame() {
        var msg = {
            type: "startgame",
            lobbyid: lobbyid
        }
        props.client.sendMsg(msg);
    }


    var tempTimer;
    var intervalId;
    function startTimer() {
        clearInterval(intervalId);
        console.log("Starting tiemr")
        setTimer(drawingTime);
        tempTimer = drawingTime;
        intervalId = setInterval(decrementTime, 1000)
    }
    function decrementTime() {
        if (tempTimer <= 0) {
            clearInterval(intervalId);
            intervalId = 0;
            console.log(intervalId)
            console.log("Time over")
        } else {
            setTimer(oldNum => oldNum - 1)
            tempTimer--;
        }
    }

    return (
        <>
            <Header username={username} lobbyid={lobbyid} startGame={startGame} leaveLobby={props.leaveLobby} showButton={showButton}>
                <p>Timer: {timer}</p>
            </Header>
            <div className="gameView">
                <Scoreboard>
                    {players}
                </Scoreboard>

                <Game client={props.client} setShowButton={setShowButton} startTimer={startTimer}></Game>
                <Chat client={props.client}></Chat>
            </div>
        </>
    )
}

export default Gameview;