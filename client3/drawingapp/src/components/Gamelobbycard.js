function Gamelobbycard(props) {

    
    return (
        <div className="gamelobbycard" onClick={() => {
            props.joinGameLobby(props.lobbyid)
        }}>
            <h1>CARD</h1>
            <p>{props.lobbyid}</p>
        </div>

    )
}

export default Gamelobbycard;