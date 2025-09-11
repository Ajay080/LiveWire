const {Server} = require("socket.io");
const eventListener= require("./eventListener");
let userMap=new Map();
let roomMap=new Map();
const socketConnection=({httpServer})=>{
    const io= new Server(httpServer, {
        cors:["*"],
        methods:["GET", "POST"]
    })
    io.on("connection", (socket)=>{
        eventListener(socket, io, userMap, roomMap)
    })
}

module.exports= socketConnection;