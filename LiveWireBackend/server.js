const express= require('express');
const {Server}= require('socket.io');
const socketConnection= require('./src/socketConnection');
const http= require('http');

const app= express();// creating express app
const httpServer= http.createServer(app); // creating http server
const PORT=8080;
socketConnection(httpServer); // calling socket connection function
httpServer.listen(PORT, () =>{  // listening to port 8080
    console.log(`server is live on ${PORT} port`);
})