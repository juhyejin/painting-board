
const socketMain = function (socket, wsServer){
    const publicRooms =  () => {
        const {
            sockets: {
                adapter: { sids, rooms },
            },
        } = wsServer;
        const publicRoom = [];
        rooms.forEach((_, key) => {
            if (sids.get(key) === undefined) {
                publicRoom.push(key);
            }
        });
        return publicRoom;
    }

    function countRoom(roomName) {
        return wsServer.sockets.adapter.rooms.get(roomName)?.size;
    }
    wsServer.sockets.emit("room_change", publicRooms());
    socket["nickname"] = "guest";
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
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`,'other-msg');
        done();
    });
    socket.on("nickName", (nickname) => (socket["nickname"] = nickname));
    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname,countRoom(room) - 1));
    });
    socket.on("disconnect", () => {
        wsServer.sockets.emit("room_change", publicRooms());
    });
    socket.on('draw', (room,mouseX, mouseY,brushType) => {
        socket.to(room).emit('otherDraw',mouseX,mouseY,brushType)
    })
    socket.on('board-reset',(room)=>{
        socket.to(room).emit('other-board-reset','다른 사용자가 보드를 초기화 했습니다.')
    })
}

export default socketMain
