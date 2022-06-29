import Chatmessage from "./Chatmessage";
import React, { useState, useEffect } from 'react'

function Clientcomponent(props) {
    const [chatMessage, setChatMessage] = useState()
    var ws = new WebSocket(`ws://localhost:3001/ws?username=${username}`);

    useEffect(()=>{

    },[ws.onmessage()])


    return (
        <></>

    )
}
export default Clientcomponent;