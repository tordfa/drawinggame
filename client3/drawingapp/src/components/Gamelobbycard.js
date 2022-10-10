function Gamelobbycard(props) {

    
    return (
        
        <div className="gamelobbycard" onClick={() => {
            props.joinGameLobby(props.lobbyid)
        }}>
            <h2>Gamelobby</h2>
            <p>Lobbyid: {props.lobbyid}</p>
        </div>

    )
}

export default Gamelobbycard;