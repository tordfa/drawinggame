import React, {useState} from "react";

function Loginview(props) {
    const [usernameState, setUsernameState] = useState("");

    function login(){
        if(usernameState){
            props.login(usernameState);
        }
        
    }

    function handleUsernameChange(event){
        setUsernameState(event.target.value)
    }

    function handleOnKeyDown(e){
        if(e.code === "Enter"){
            login();
        }
    }


    return (
        <div className="loginView">
            <div className="loginForm">
                <input type="text" autoFocus placeholder="Enter Username" value={usernameState} onChange={handleUsernameChange} onKeyDown={handleOnKeyDown} className="loginField"></input>
                <input type="submit" value="Join" onClick={(login)} className="loginButton"></input>
            </div> 
        </div>

    )
}

export default Loginview;