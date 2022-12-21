const express = require('express');
const app = express();
const http = require('http');
const httpServer = http.createServer(app);
const PORT = 3000;
const {Server} = require('socket.io');
const wsServer = new Server(httpServer)
const EventEmitter = require('events');
const newEvent = new EventEmitter();


app.use(express.static(__dirname +'/public'));
app.get('/',(_,res) => {
    res.sendFile(__dirname + '/public/canvas.html')
})
app.get('/*',(_,res) => res.redirect('/'))


function publicRooms() {
    const {
        sockets: {
            adapter: { sids, rooms },
        },
    } = wsServer;
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined) {
            publicRooms.push(key);
        }
    });
    return publicRooms;
}

function countRoom(roomName) {
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) => {
    wsServer.sockets.emit("room_change", publicRooms());
    newEvent.on('test', () => console.log('hi'))
    socket["nickname"] = "Anon";
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`);
    });
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
        wsServer.sockets.emit("room_change", publicRooms());
    });
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    });
    socket.on("nickName", (nickname) => (socket["nickname"] = nickname));
    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname,countRoom(room) - 1));
    });
    socket.on("disconnect", () => {
        wsServer.sockets.emit("room_change", publicRooms());
    });
    socket.on('draw_mouse',(roomName, done)=>{
        console.log(roomName);
        socket.to(roomName).emit('otherDraw',done)
    })
});


httpServer.listen(PORT, () => console.log(`${PORT} 서버연결성공!`));
