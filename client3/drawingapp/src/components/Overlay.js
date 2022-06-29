import { useEffect, useState } from "react";


function Overlay(props) {
    const [isVisible, setIsVisible] = useState(0)

    useEffect(() => {
        setIsVisible(1)
        setTimeout(() => {
            setIsVisible(0)
            console.log("HIDE")
        }, 5000)
    },[])
    return (
        <> {isVisible
            ? <div className="gameOverlay">
                <h1>Round {props.round} of {props.maxrounds}</h1>
                <h1>{props.activeplayer} is drawing</h1>
                <div className="wordList">
                    <h2>Word: {props.word}</h2>
                </div>
            </div>
            : <></>
        }

        </>

    )
}

export default Overlay;




