class Player {
    constructor(playername,ws,joinedlobbyid,isAdmin){
        this.playername = playername;
        this.score = 0;
        this.ws = ws;
        this.joinedLobbyId = joinedlobbyid;
        this.isAdmin = isAdmin;
    }
}
module.exports = Player