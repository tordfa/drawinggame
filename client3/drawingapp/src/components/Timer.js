import React, {useEffect, useState} from "react";

function Timer(props) {
    const [timer, setTimer] = useState();
    var timer2;
    var intervalId;
    useEffect(()=>{
        console.log("Jupp")
        startTimer()
    },[])
    function startTimer() {
        setTimer(props.time);
        timer2 = props.time;
        intervalId = setInterval(decrementTime, props.time * 100)
    }
    function decrementTime() {
        if (timer2 <= 0) {
            clearInterval(intervalId);
            console.log("Time over")
        } else {
            setTimer(oldNum => oldNum - 1)
            timer2--;
        }
    }

    return (
        <p>Timer: {timer}</p>

    )
}
export default Timer;