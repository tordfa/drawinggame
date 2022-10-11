import Colorpicker from './Colorpicker'
import Color from './Color';
import React, { useState, useEffect } from 'react';
import Drawing from '../classes/Drawing';
import Overlay from './Overlay';

function Game(props) {

    const [activePlayer, setActivePlayer] = useState('')
    const [word, setWord] = useState('')
    const [round, setRound] = useState('')
    const [maxRounds, setMaxRounds] = useState('')
    const [isOverlayVisible, setIsOverlayVisible] = useState(0)
    const [isActivePlayer, setIsActivePlayer] = useState(0);
    const [time, setTimer] = useState();
    var canvasWidth = 545;
    var canvasHeight = 379;

    function changeColor(color) {
        props.client.sendChangeColor(color);
    }
    function clearCanvas() {
        props.client.sendClearCanvas();
    }
    function startDrawing(drawing, canvas) {
        canvas.onmousedown = (e) => { drawing.startDraw(e); }
        canvas.onmousemove = (e) => { drawing.moveDraw(e) };
        canvas.onmouseup = () => {
            drawing.stopDraw()
            props.client.sendDrawing(drawing)

        };
    }

    function stopDrawing(canvas) {
        canvas.onmousedown = (e) => { };
        canvas.onmousemove = (e) => { };
        canvas.onmouseup = (e) => { };
    }
    
    function updateOverlay() {
        setIsOverlayVisible(1)
        setTimeout(() => {
            setIsOverlayVisible(0)
        }, 7000)
    }


    function updateGame(activeplayer, round, maxrounds, words) {
        if (words == "gameover") {
            console.log("GAME IS OVER!")
            props.setShowButton(1)
        } else {
            props.setShowButton(0)
            setActivePlayer(activeplayer)
            setWord(words)
            setRound(round)
            setMaxRounds(maxrounds)
            props.startTimer()
            updateOverlay();
            var drawing = new Drawing(document.getElementById('canvas'));
            drawing.clearCanvas();
        }

    }



    useEffect(() => {
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        ctx.canvas.width = canvas.getBoundingClientRect().width;
        ctx.canvas.height = canvas.getBoundingClientRect().height;
        var drawing = new Drawing(canvas);
        props.client.listenDrawing(drawing, startDrawing, updateGame, stopDrawing, setIsActivePlayer)
    }, [])


    return (
        <>
            {isOverlayVisible
                ? <Overlay activeplayer={activePlayer} word={word} round={round} maxrounds={maxRounds}></Overlay>
                : <></>}

            <canvas id="canvas"></canvas>
            <Colorpicker>
                {isActivePlayer
                    ? 
                    <>
                    <Color color="black" changeColor={changeColor}></Color>
                    <Color color="red" changeColor={changeColor}></Color>
                    <Color color="green" changeColor={changeColor}></Color>
                    <Color color="blue" changeColor={changeColor}></Color>
                    <Color color="yellow" changeColor={changeColor}></Color>
                    <li onClick={clearCanvas} className="clear">C</li>
                    </>
                    : <></>
                    }
                
            </Colorpicker>
        </>

    )
}

export default Game;




