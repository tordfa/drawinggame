const wordlist = require('../wordlist.json')

// Roundtime in ms
const roundTime = 120000;
const maxRounds = 3;

class Game {
    constructor(GameLobby) {
        this.GameLobby = GameLobby
        this.isActive = 0;
        this.playerTurn = 0;
        this.round = 1;
        this.activePlayer;
        this.intervalId = 0;
        this.word = "";
        this.answeredPlayers = [];
    }

    start() {
        this.isActive = 1;
        this.nextRound();
        this.intervalId = setInterval(() => { this.nextRound() }, roundTime)

    }

    stop(){
        clearInterval(this.intervalId); 
    }

    nextRound() {
        this.answeredPlayers = [];
        this.generateRandomWord();
        if (this.playerTurn >= this.GameLobby.players.length) {
            if (this.round >= maxRounds) {
                this.endGame();
                console.log("Game is over.");
            } else {
                console.log("NEXT Round");
                this.round++;
                this.playerTurn = 0;
                this.nextTurn()
            }
        } else {
            this.nextTurn();
        }

    }

    nextTurn() {
        this.activePlayer = this.GameLobby.players[this.playerTurn];
        console.log("NEXT Turn");
        var msg = {
            type: 'nextround',
            activeplayer: this.activePlayer.playername,
            round: this.round,
            maxrounds: maxRounds,
            words: this.word
        }
        // this.activePlayer.ws.send(JSON.stringify(msg))
        this.GameLobby.sendMsgAllLobby(msg)
        // Wait for round to be finished
        this.playerTurn++
    }


    isGuessRight(word, user, ws) {
        if (word == this.word) {
            if (this.isActive && !this.isActivePlayer(ws) && !this.hasAnswered(user)) {
                for (let i = 0; i < this.GameLobby.players.length; i++) {
                    if (user == this.GameLobby.players[i].playername) {
                        this.answeredPlayers.push(user);
                        this.GameLobby.players[i].score = this.GameLobby.players[i].score + 100;
                        console.log(this.GameLobby.players[i].playername)
                        console.log(this.GameLobby.players[i].score);
                        // UPDATE UI
                        this.GameLobby.updateLobby();
                    }
                }
            }

            return true;
        }
    }

    hasAnswered(user) {
        for (let i = 0; i < this.answeredPlayers.length; i++) {
            if (user == this.answeredPlayers[i]) {
                return 1;
            }
        }
        return 0;
    }

    isActivePlayer(ws) {
        // CHECK IF THE PLAYER IS THE ACTIVE PLAYER
        if (this.activePlayer.ws == ws) {
            console.log("ACTIVE PLAYER")
            return 1;
        } else {
            console.log("Not active player");
            return 0;
        }
    }

    generateRandomWord() {
        const random = Math.floor(Math.random() * wordlist.words.length);
        console.log(random, wordlist.words[random]);
        // PICK A RANDOM WORD FROM A WORD LIST
        this.word = wordlist.words[random];
    }

    endGame() {
        this.round = 1;
        this.playerTurn = 0;
        this.isActive = 0;
        clearInterval(this.intervalId);
        var msg = {
            type: 'gameover',
            activeplayer: this.activePlayer.playername,
            round: this.playerTurn + 1,
            maxrounds: this.GameLobby.players.length,
        }
        // this.activePlayer.ws.send(JSON.stringify(msg))
        this.GameLobby.sendMsgAllLobby(msg)
    }

}
module.exports = Game