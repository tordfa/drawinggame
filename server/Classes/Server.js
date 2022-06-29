const { json } = require('express');
const GameLobby = require('./GameLobby.js')
const Player = require('./Player.js')
const Game = require('./Game.js')

class Server {
    constructor() {
        this.allPlayers = [];
    }

    onConnect(ws, username, action, lobbyid) {
        if (!username) {
            ws.close
            console.log("Please enter username!")
        }
        else {
            if (action == "create") {

                var newGameLobby = new GameLobby();
                var newPlayer = new Player(username, ws, newGameLobby.lobbyId, 1)
                newGameLobby.addNewPlayer(newPlayer);
                GameLobby.allGameLobbies.push(newGameLobby);
                console.log("Player: " + username + " created lobby with id: " + newGameLobby.lobbyId)

                this.updateLobbyList()
                var msg2 = {
                    type: "getId",
                    lobbyid: newGameLobby.lobbyId
                }

                ws.send(JSON.stringify(msg2));

            } else if (action == "join") {
                // Check if lobby exists
                console.log(username + "is trying to join " + lobbyid)
                for (let i = 0; i < GameLobby.allGameLobbies.length; i++) {
                    if (lobbyid == GameLobby.allGameLobbies[i].lobbyId) {
                        var newPlayer = new Player(username, ws, lobbyid, 0)
                        GameLobby.addNewPlayer(lobbyid, newPlayer)
                        var msg2 = {
                            type: "getId",
                            lobbyid: lobbyid
                        }
                        ws.send(JSON.stringify(msg2));
                        break;
                    }
                    console.log("Fant ikke lobby med id: " + lobbyid)
                }

            }
            else if (action == "lobby") {
                console.log(`Player: ${username} connected`)
                var newPlayer = new Player(username, ws, '', 0)
                this.allPlayers.push(newPlayer)

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
            if (thisLobby.game.isActive) {
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
                        GameLobby.sendMsgAllLobby(ws, msg);
                    }
                    else if (jsonData.type == "colorChange") {
                        console.log(`Changing color to: ${jsonData.msg}`)
                        var msg = {
                            type: "colorChange",
                            msg: jsonData.msg
                        }
                        // Change to class method
                        GameLobby.sendMsgAllLobby(ws, msg);
                    }
                    else if (jsonData.type == "clearCanvas") {
                        console.log("Clearing canvas")
                        var msg = {
                            type: "clearCanvas",
                        }
                        // Change to class method
                        GameLobby.sendMsgAllLobby(ws, msg);
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
                thisLobby.game.isGuessRight(jsonData.msg, jsonData.user,ws)
                // Change to class method
                GameLobby.sendMsgAllLobby(ws, msg);
            }
            else if (jsonData.type == "logout") {
                ws.close();
            }
            else if (jsonData.type == "startgame") {
                console.log("Starting game")
                console.log(jsonData.lobbyid)

                thisLobby.game.start();

            }

        }

    }

    onClose(ws) {
        ws.on("close", function () {
            console.log("Server: Closed connection")
            //REMOVE CLOSED PLAYER FROM ALLPLAYERS and gamelobbies
            for (let i = 0; i < GameLobby.allGameLobbies.length; i++) {
                for (let j = 0; j < GameLobby.allGameLobbies[i].players.length; j++) {
                    if (GameLobby.allGameLobbies[i].players[j].ws == ws) {
                        console.log("fant spiller: " + GameLobby.allGameLobbies[i].players[j].playername)
                        var gamelobby = GameLobby.allGameLobbies[i].players[j].playername;
                        GameLobby.
                            removePlayer(GameLobby.allGameLobbies[i].players[j])
                    }
                }
            }
        })
    }
    updateLobbyList() {
        var msg = {
            type: 'lobbylist',
            list: GameLobby.allGameLobbyIds
        }
        this.sendMsgAll(msg)
    }

    sendMsgAll(msg) {
        for (let i = 0; i < this.allPlayers.length; i++) {
            this.allPlayers[i].ws.send(JSON.stringify(msg))
        }
    }

}

module.exports = Server;