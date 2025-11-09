import {io} from "socker.io-client";
const SocketEvenListener=(socket)=>{
    socket.on("welcome", (data)=>{
        console.log(data);
    }
}
const CreateSocketConnection=()=>{
    const socket=io("http://localhost:5176");
    socket.on("connect", ()=>{
        console.log("Connected to server with ID:", socket.id);
    })


}

export default CreateSocketConnection;