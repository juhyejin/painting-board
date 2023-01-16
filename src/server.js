import socketMain from "./socketController";

const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const app = express();
const PORT = 3000;
const httpServer = http.createServer(app);
const wsServer = new Server(httpServer)



app.use(express.static(__dirname +'/public'));
app.get('/',(_,res) => {
    res.sendFile(__dirname + '/public/index.html')
})
app.get('/*',(_,res) => res.redirect('/'))


wsServer.on('connection', socket => socketMain(socket, wsServer))

httpServer.listen(PORT, () => console.log(`${PORT} 서버연결성공!`));
