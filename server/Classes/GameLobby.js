const Game = require('./Game.js')

class GameLobby {
    constructor(server) {
        this.players = [];
        this.lobbyId;
        this.admin;
        this.generateLobbyId();
        this.game = new Game(this);
        this.server = server;

    }

    static allGameLobbyIds = [];
    static allGameLobbies = [];

    generateLobbyId() {
        console.log("GAMELOBBYCLASS: Generating Lobby id:")

        let generateRandomString = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        var newId = generateRandomString();
        while (GameLobby.allGameLobbyIds.includes(newId)) {
            newId = generateRandomString();
        }

        this.lobbyId = newId;
        console.log(this.lobbyId)
        GameLobby.allGameLobbyIds.push(newId)
        GameLobby.allGameLobbies.push(this)
    }

    addNewPlayer(player) {
        this.players.push(player);
        this.updateLobby();
    }

    leaveLobby(ws) {
        console.log("Leaving lobby")
        for (let i = 0; i < GameLobby.allGameLobbies.length; i++) {
            for (let j = 0; j < GameLobby.allGameLobbies[i].players.length; j++) {
                if (GameLobby.allGameLobbies[i].players[j].ws == ws) {
                    this.removePlayer(GameLobby.allGameLobbies[i].players[j])
                    if (GameLobby.allGameLobbies[i].players.length == 0) {
                        GameLobby.closeLobby(GameLobby.allGameLobbies[i]);
                        break;
                    } else {
                        this.server.updateLobbyList()
                    }
                }
            }
        }
    }

    removePlayer(player) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i] == player) {
                this.players.splice(i, 1);
                this.updateLobby();
            }
        }
    }


    updateLobby() {
        var players = [];
        for (let i = 0; i < this.players.length; i++) {
            var newPlayer = [this.players[i].playername, this.players[i].score]
            players.push(newPlayer)
        }
        var msg = {
            type: 'updatescoreboard',
            players: players
        }
        this.sendMsgAllLobby(msg);
    }



    sendMsgAllLobby(msg) {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].ws.send(JSON.stringify(msg))
        }
    }

    // MAYBE??
    // closeLobby() {
    // this.game.stop();
    //  this.game = null;
    // 
    // }


    // Does it need to be static?
    static closeLobby(lobby) {

        // NØDVENDIG?
        // for (let i = 0; i < lobby.players.length; i++) {
        //     lobby.players[i].ws.close();
        // }
        //
        console.log("Closing lobby")

        for (let i = 0; i < GameLobby.allGameLobbies.length; i++) {
            if (GameLobby.allGameLobbies[i] == lobby) {
                lobby.game.stop();
                lobby.game = null;
                GameLobby.allGameLobbies.splice(i, 1)
                GameLobby.allGameLobbyIds.splice(i, 1)
            }
        }
        lobby.server.updateLobbyList();
    }

    static getLobby(lobbyid) {
        for (let i = 0; i < GameLobby.allGameLobbies.length; i++) {
            if (lobbyid == GameLobby.allGameLobbies[i].lobbyId) {
                var thisLobby = GameLobby.allGameLobbies[i]
                return thisLobby
            }
        }
    }

    // static addNewPlayer(lobbyid, player) {

    //     if (GameLobby.allGameLobbyIds.includes(lobbyid)) {
    //         const lobbyIndex = GameLobby.allGameLobbies.findIndex(element => element.lobbyId == lobbyid)
    //         var thisGameLobby = GameLobby.allGameLobbies[lobbyIndex]
    //         thisGameLobby.players.push(player)

    //         console.log("GAMELOBBYCLASS: Player: " + player.playername + " joined lobby: " + lobbyid)
    //         //Send a list of players connected to gamelobby to all connected players
    //         // console.log(thisGameLobby.players)
    //         // updatePlayerCount(thisGameLobby);
    //         thisGameLobby.updateLobby();
    //     } else {
    //         console.log("GAMELOBBYCLASS: Lobby does not exist.")
    //     }

    // }

    static getPlayerLobby(ws){
        for (let i = 0; i < GameLobby.allGameLobbies.length; i++) {
            for (let j = 0; j < GameLobby.allGameLobbies[i].players.length; j++) {
                if (GameLobby.allGameLobbies[i].players[j].ws == ws) {
                    return GameLobby.allGameLobbies[i];
                }
            }
        }
        return null;
    }

    // static removePlayer(player) {
    //     console.log("Removing player")
    //     let gameLobbyIndex = GameLobby.allGameLobbies.findIndex(gamelobby => gamelobby.lobbyId == player.joinedLobbyId)
    //     let playerIndex = GameLobby.allGameLobbies[gameLobbyIndex].players.findIndex(playerl => playerl == player);
    //     var thisGameLobby = GameLobby.allGameLobbies[gameLobbyIndex];
    //     thisGameLobby.players.splice(playerIndex, 1);
    //     // updatePlayerCount(thisGameLobby);
    //     console.log("Antall spillere i lobby: " + thisGameLobby.players.length)

    //     thisGameLobby.updateLobby();        


    // }

    // DELETE DELETE DELETE
    // static sendMsgAllLobby(ws, msg) {
    //     for (let i = 0; i < GameLobby.allGameLobbies.length - 1; i++) {
    //         for (let j = 0; j < GameLobby.allGameLobbies[i].players.length; j++) {
    //             if (GameLobby.allGameLobbies[i].players[j].ws == ws) {
    //                 var gamelobby = GameLobby.allGameLobbies[i];
    //                 gamelobby.sendMsgAllLobby(msg)
    //                 i = GameLobby.allGameLobbies.length;
    //                 break;
    //             }
    //         }

    //     }
    // }
}

module.exports = GameLobby