const express = require('express')
const WebSocket = require("ws");
const url = require('url');
const app = express()
const port = 8000;
var cors = require('cors')

const Server = require('./Classes/Server')
const Gamelobby = require('./Classes/GameLobby');

var server = new Server();

app.use(cors())
// app.use(express.static("../client3/drawingapp/build/"));

const httpServer = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

const wsServer = new WebSocket.Server({
    noServer: true
})

app.get('/getlobbies', (req,res) => {
    var allLobbies = [];
    for (let i = 0; i < Gamelobby.allGameLobbies.length-1; i++) {
        allLobbies.push(Gamelobby.allGameLobbies[i].lobbyId)
    }
    res.send(allLobbies)
})

httpServer.on('upgrade', async function upgrade(request, socket, head) {
    //emit connection when request accepted
    wsServer.handleUpgrade(request, socket, head, function done(ws) {
        wsServer.emit('connection', ws, request);
    });
});

wsServer.on("connection", function (ws, req) {
    var action = url.parse(req.url, true).query.action;
    var username = url.parse(req.url, true).query.username;
    var lobbyid = url.parse(req.url,true).query.lobbyid;
    server.onConnect(ws,username,action,lobbyid)
    server.listen(ws,username)
    server.onClose(ws);

})
