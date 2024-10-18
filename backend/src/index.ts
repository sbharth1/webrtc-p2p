import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

app.use(cors())
app.use(bodyParser.json())


app.get('/',(req,res)=>{
    res.send('socket.io backend')
})

io.on('conneted',(socket:Socket)=>{
    socket.on('connect',()=> console.log(`user connected${socket.id}`))
})


server.listen(3000)