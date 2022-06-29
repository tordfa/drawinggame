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
            <h1>Tegnespill :D</h1>
            <div className="loginFrom">
                <label>Username: </label>
                <input type="text" value={usernameState} onChange={handleUsernameChange} onKeyDown={handleOnKeyDown}></input>
                <input type="submit" value="Join" onClick={(login)}></input>

            </div> 
        </div>

    )
}

export default Loginview;