const GameLobby = require('./GameLobby.js')
const Player = require('./Player.js')


class Server {
    constructor() {
    }
    static allPlayers = [];


    onConnect(ws, username, action, lobbyid) {
        if (!username) {
            ws.close
            console.log("Please enter username!")
        }
        else {
            if (action == "lobby") {
                console.log(`Player: ${username} connected`)
                var newPlayer = new Player(username, ws, '', 0)
                Server.allPlayers.push(newPlayer)
                var msg = {
                    type: 'lobbylist',
                    list: GameLobby.allGameLobbyIds

                }
                ws.send(JSON.stringify(msg))
            }
            else {
                console.log("Unknown command. Closing connection.")
                ws.close();
            }
        }
    }

    listen(ws) {
        ws.onmessage = (msg) => {
            var jsonData = JSON.parse(msg.data)
            var thisLobby = GameLobby.getLobby(jsonData.lobbyid);
            if (thisLobby && thisLobby.game.isActive) {
                if (thisLobby.game.isActivePlayer(ws)) {
                    if (jsonData.type == "drawing") {
                        console.log("Drawing Recieved. Sending to all clients")
                        console.log("Lobby: " + jsonData.lobbyid)
                        var posX = jsonData.posX;
                        var posY = jsonData.posY;
                        var msg = {
                            type: "drawing",
                            posX: posX,
                            posY: posY
                        }
                        // Change to class method
                        thisLobby.sendMsgAllLobby(msg);
                    }
                    else if (jsonData.type == "colorChange") {
                        console.log(`Changing color to: ${jsonData.msg}`)
                        var msg = {
                            type: "colorChange",
                            msg: jsonData.msg
                        }
                        // Change to class method
                        thisLobby.sendMsgAllLobby(msg);
                    }
                    else if (jsonData.type == "clearCanvas") {
                        console.log("Clearing canvas")
                        var msg = {
                            type: "clearCanvas",
                        }
                        // Change to class method
                        thisLobby.sendMsgAllLobby(msg);
                    }
                }
            }

            if (jsonData.type == "chat") {
                console.log("Chat received. Send to all players")
                var msg = {
                    type: "chat",
                    msg: jsonData.msg,
                    user: jsonData.user
                }

                if (thisLobby.game.isGuessRight(jsonData.msg, jsonData.user, ws)) {

                }
                else {
                    thisLobby.sendMsgAllLobby(msg);
                }

            }
            else if(thisLobby && jsonData.type == "leavelobby"){
                thisLobby.leaveLobby(ws)
            }
            else if (jsonData.type == "logout") {
                ws.close();
            }
            else if (jsonData.type == "startgame") {
                console.log("Starting game")
                console.log(jsonData.lobbyid)

                thisLobby.game.start();

            }
            else if (jsonData.type == "joinlobby") {
                // Check if lobby exists
                var username = jsonData.username;
                var lobbyid = jsonData.lobbyid;
                console.log(username + "is trying to join " + lobbyid)
                for (let i = 0; i < GameLobby.allGameLobbies.length; i++) {
                    if (lobbyid == GameLobby.allGameLobbies[i].lobbyId) {
                        var newPlayer = new Player(username, ws, lobbyid, 0)
                        GameLobby.allGameLobbies[i].addNewPlayer(newPlayer)
                        var msg2 = {
                            type: "getId",
                            lobbyid: lobbyid
                        }
                        ws.send(JSON.stringify(msg2));
                        break;
                    }
                    if (i >= GameLobby.allGameLobbies.length) {
                        console.log("Fant ikke lobby med id: " + lobbyid)
                    }
                }
            }
            else if (jsonData.type == "createlobby") {
                console.log("WS: Create lobby")
                var newGameLobby = new GameLobby(this);
                var newPlayer = new Player(jsonData.username, ws, newGameLobby.lobbyId, 1)
                newGameLobby.addNewPlayer(newPlayer);
                console.log("Player: " + jsonData.username + " created lobby with id: " + newGameLobby.lobbyId)
                this.updateLobbyList()
                var msg2 = {
                    type: "getId",
                    lobbyid: newGameLobby.lobbyId
                }

                ws.send(JSON.stringify(msg2));
            }

        }

    }

    static removePlayerAll(ws){
        for (let i = 0; i < Server.allPlayers.length; i++) {
            if(Server.allPlayers[i].ws == ws){
                Server.allPlayers.splice(i,1);
                break;
            }
        }
    }

    updateLobbyList() {
        var msg = {
            type: 'lobbylist',
            list: GameLobby.allGameLobbyIds
        }
        this.sendMsgAll(msg)
    }

    sendMsgAll(msg) {
        for (let i = 0; i < Server.allPlayers.length; i++) {
            Server.allPlayers[i].ws.send(JSON.stringify(msg))
        }
    }

    onClose(ws) {
        ws.on("close", function () {
            console.log("Server: Closed connection")
            Server.removePlayerAll(ws)
            var lobby = GameLobby.getPlayerLobby(ws)
            if(lobby){
                lobby.leaveLobby(ws);
            } 
        })
    }



}

module.exports = Server;