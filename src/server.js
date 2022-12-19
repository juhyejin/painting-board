import express from 'express';
import http from 'http'
import { Server } from "socket.io";

const app = express();
const PORT = 3000;
app.use(express.static(__dirname + '/public'));
app.get('/', (_, res) => res.render("/index.html"));
app.get('/*',(_,res) => res.redirect('/'))

const httpServer  = http.createServer(app);
// const wsServer = new Server(httpServer);

httpServer.listen(PORT, () => console.log(`${PORT} 서버연결성공!`))
