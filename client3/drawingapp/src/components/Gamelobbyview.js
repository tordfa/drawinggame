import { useEffect, useState } from "react";
import Gamelobbycard from "./Gamelobbycard";
import axios from 'axios';


function Gamelobbyview(props) {
    const [gamelobbies, setGamelobbies] = useState([]);

    // EVENTListener for updating list of lobbies
    props.client.ws.addEventListener("message", msg => {
        var jsonData = JSON.parse(msg.data)
        if(jsonData.type == "lobbylist"){
            var tempArray = []
            for (let i = 0; i < jsonData.list.length; i++) {
                var lobbyid = jsonData.list[i];
                var lobbycard = <Gamelobbycard joinGameLobby={joinGameLobby} lobbyid={lobbyid} key={i}></Gamelobbycard>
                tempArray.push(lobbycard)
            }
            setGamelobbies(tempArray);
        }
    })

    function joinGameLobby(lobbyid) {
        if (props.client.username) {
            props.client.joinGameLobby(props.client.username, lobbyid);
            props.setInLobby();

        } else {
            console.log("ENTER USERNAME")
        }
    }

    function createGameLobby() {
        if (props.client.username) {

            props.client.createGameLobby(props.client.username);
            props.setInLobby();

        } else {
            console.log("ENTER USERNAME")
        }
    }

    return (
        <>

            <div className="gamelobbyview">
                <h1>GameLobbies:</h1>
                <button onClick={createGameLobby}>Create new lobby</button>
                <div className="gamelobbycardcontainer">
                    {gamelobbies}
                </div>

            </div>
        </>

    )
}

export default Gamelobbyview;