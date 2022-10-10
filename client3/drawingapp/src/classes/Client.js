
export default class Client {
    constructor() {
        this.ws = 0;
        this.username = "";
        this.lobbyid = '';
        this.drawingGame = 0;
    }
    connect(username) {
        console.log("Connecting to Ws")
        this.ws = new WebSocket(`ws://localhost:3001/ws?username=${username}&action=lobby`);
        this.username = username;
        
    }
    leaveLobby() {
        var msg = {
            type: "leavelobby",
            lobbyid: this.lobbyid
        }
        this.ws.send(JSON.stringify(msg))

    }

    joinGameLobby(lobbyid) {
        // this.ws = new WebSocket(`ws://localhost:3001/ws?username=${username}&action=join&lobbyid=${lobbyid}`);
        // this.ws.onopen = () => {
        //     this.lobbyid = lobbyid;
        //     console.log(this.lobbyid)
        //     console.log("Joining Gamelobby: " + lobbyid + " as " + username)
        // }
        
        var msg = {
            type: "joinlobby",
            lobbyid: lobbyid,
            username: this.username
        }
        this.ws.send(JSON.stringify(msg))
        
    }

    createGameLobby() {
        // this.ws = new WebSocket(`ws://localhost:3001/ws?username=${username}&action=create`);
        // this.ws.onopen = () => {
        //     console.log("Creating new Gamelobby as " + username)
        // }
        var msg = {
            type: "createlobby",
            username: this.username
        }
        this.ws.send(JSON.stringify(msg))
    }


    listen(updateScoreboard, updateHeader) {
        if (this.ws) {
            console.log("Listening for messages from server.")
            this.ws.onmessage = (msg) => {
                var jsonData = JSON.parse(msg.data)

                if (jsonData.type == "getId") {
                    this.lobbyid = jsonData.lobbyid
                    console.log(this.lobbyid)
                    console.log("Updating Header");
                    updateHeader(this.lobbyid)
                }
                else if (jsonData.type == "updatescoreboard") {
                    console.log("Updating Scoreboard")
                    updateScoreboard(jsonData.players)
                }
                else if (jsonData.type == "startgame") {
                    console.log("STARTING GAME")

                }
                else if (jsonData.type == "lobbyjoined"){
                    console.log("Joining / creating lobby.")
                }
    
            }
        }


    }

    listenDrawing(drawing,startDrawing,updateGame,stopDrawing,setIsActivePlayer) {
        this.ws.addEventListener('message', (msg) => {
            var jsonData = JSON.parse(msg.data)
            if (jsonData.type == "drawing") {
                console.log("Drawing Received from server.")
                var posX = jsonData.posX;
                var posY = jsonData.posY;
                drawing.redraw(posX, posY);
            }
            else if (jsonData.type == "colorChange") {
                drawing.changeColor(jsonData.msg)
                console.log("Changing color to: " + jsonData.msg)
            }
            else if (jsonData.type == "clearCanvas") {
                drawing.clearCanvas();
                console.log("Clearing canvas")
            }

            else if (jsonData.type == "nextround") {
                if(jsonData.activeplayer == this.username){
                    console.log("Your turn to draw");
                    startDrawing(drawing,drawing.canvas)

                    updateGame(jsonData.activeplayer,jsonData.round,jsonData.maxrounds,jsonData.words)
                    setIsActivePlayer(1)
                }else{
                    setIsActivePlayer(0)
                    updateGame(jsonData.activeplayer,jsonData.round,jsonData.maxrounds,'')
                    stopDrawing(drawing.canvas)
                }
                
            }

            else if (jsonData.type == "gameover") {
                    updateGame('','','','gameover')
                    console.log("Your Game is over");
                    stopDrawing(drawing.canvas)
                
                
            }


        })
    }

    onclose(logout) {
        this.ws.onclose = (e) => {
            logout()
        }

    }

    sendDrawing(drawing) {
        console.log("Sending drawing....")
        var msg = {
            type: "drawing",
            posX: drawing.savedDrawingX,
            posY: drawing.savedDrawingY,
            lobbyid: this.lobbyid
        }
        this.sendMsg(msg)
    }


    sendChangeColor(color) {
        var msg = {
            type: "colorChange",
            msg: color,
            lobbyid: this.lobbyid
        }
        this.sendMsg(msg);
    }

    sendClearCanvas() {
        var msg = {
            type: "clearCanvas",
            lobbyid: this.lobbyid
        }
        this.sendMsg(msg);
    }

    sendMsg(msg) {
        this.ws.send(JSON.stringify(msg))
    }
}
