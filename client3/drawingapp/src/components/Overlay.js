import { useEffect, useState } from "react";


function Overlay(props) {
    return (
        <> 
             <div className="gameOverlay">
                <h1>Round {props.round} of {props.maxrounds}</h1>
                <h1>{props.activeplayer} is drawing</h1>
                <div className="wordList">
                    <h2>Word: {props.word}</h2>
                </div>
            </div>
            
        

        </>

    )
}

export default Overlay;




