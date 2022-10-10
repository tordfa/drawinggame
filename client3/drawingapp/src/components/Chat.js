import React, { useState, useEffect } from 'react'
import Chatmessage from './Chatmessage'

function Chat(props) {
    const [chatMessage, setChatMessage] = useState('')
    const [chatMessages, setChatMessages] = useState([])

    useEffect(() => {
        props.client.ws.addEventListener("message", (msg) => {
            var jsonData = JSON.parse(msg.data);
            if(jsonData.type == "chat"){
                console.log("INCOMING CHAT")
                var msg = <Chatmessage username={jsonData.user}  message={jsonData.msg}></Chatmessage>;
                setChatMessages(current => [...current, msg])
                
            }

        })
    },[])
    function handleChatChange(event) {
        setChatMessage(event.target.value);
    }

    function handleOnKeyDown(e){
        if(e.code === "Enter"){
            sendMsg();
        }
    }
    function sendMsg() {
        var msg = {
            type: "chat",
            user: props.client.username,
            msg: chatMessage,
            lobbyid: props.client.lobbyid
        }
        if(chatMessage){
            props.client.sendMsg(msg)
            setChatMessage('')
        }
     
    }

    return (
        <div className="chatContainer">
            <div className="chatMessages">
                {chatMessages}
            </div>
            <div className="chatInput">
                <input type="text" className="chattext" onChange={handleChatChange} onKeyDown={handleOnKeyDown}value={chatMessage}></input>
                <input type="submit" className="chatbutton" value="Send" onClick={sendMsg} ></input>
            </div>

        </div>

    )
}
export default Chat;