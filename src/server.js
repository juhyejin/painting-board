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

// function publicRooms() {
//     const {
//         sockets: {
//             adapter: { sids, rooms },
//         },
//     } = wsServer;
//     const publicRooms = [];
//     rooms.forEach((_, key) => {
//         if (sids.get(key) === undefined) {
//             publicRooms.push(key);
//         }
//     });
//     return publicRooms;
// }
//
// function countRoom(roomName) {
//     return wsServer.sockets.adapter.rooms.get(roomName)?.size;
// }
//
// wsServer.on("connection", (socket) => {
//     wsServer.sockets.emit("room_change", publicRooms());
//     socket["nickname"] = "guest";
//     socket.onAny((event) => {
//         console.log(`Socket Event: ${event}`);
//     });
//     socket.on("enter_room", (roomName, done) => {
//         socket.join(roomName);
//         done();
//         socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
//         wsServer.sockets.emit("room_change", publicRooms());
//     });
//     socket.on("new_message", (msg, room, done) => {
//         socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
//         done();
//     });
//     socket.on("nickName", (nickname) => (socket["nickname"] = nickname));
//     socket.on("disconnecting", () => {
//         socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname,countRoom(room) - 1));
//     });
//     socket.on("disconnect", () => {
//         wsServer.sockets.emit("room_change", publicRooms());
//     });
// });


httpServer.listen(PORT, () => console.log(`${PORT} ??????????????????!`));
