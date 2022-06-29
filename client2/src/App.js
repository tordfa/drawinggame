import './App.css';
import Loginview from './components/Loginview'
import React, { useState, useEffect } from 'react';
import Gameview from './components/Gameview';
import Client from './classes/Client'
import Drawing from './classes/Drawing';
import Gamelobbyview from './components/Gamelobbyview';


var client = new Client();
var view;
function App() {
  const [loggedIn, setLoggedIn] = useState(0);
  const [inLobby, setInLobby] = useState(0)

  function login(username){
    setLoggedIn(1)
    client.connect(username);
  }
  function leaveLobby() {
    setLoggedIn(1)
    setInLobby(0)
    client.reset();
    client.connect(client.username)
  }

  if(loggedIn && !inLobby){
    view = <Gamelobbyview client={client} leaveLobby={leaveLobby} loggedin={loggedIn} setInLobby={() => {setInLobby(1)}}></Gamelobbyview>
  }else if(loggedIn && inLobby){
    view = <Gameview client={client} leaveLobby={leaveLobby}></Gameview>
  }else{
    view = <Loginview login={login}></Loginview>
  }
  return (
    <>

    <div className="App">
      <div className='viewContainer'>
      {view}
      {/* {loggedIn ? <Gamelobbyview client={client} logout={logout} loggedin={loggedIn} username={usernameState}></Gamelobbyview> : <Loginview login={login}></Loginview>} */}
        {/* {loggedIn ? <Gameview client={client} logout={logout}></Gameview> : <Loginview joinGameLobby={joinGameLobby} createGameLobby={createGameLobby}></Loginview>} */}

      </div>
    </div>
    </>
  );
}

export default App;
