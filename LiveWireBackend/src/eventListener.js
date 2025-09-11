const eventListener = (socket, io, userMap, roomMap)=>{
    socket.emit("welcome", "Welcome to LiveWire");
    socket.on("clientMessage", (data)=>{
        socket.emit("serverMessage", `Server sending back to the client from server, your message was ${data}`)
    })
    socket.on("disconnect", (userId)=>{
        LeaveUserFromOtherRoom(userId, userMap, roomMap, io);
        console.log("user disconnected");
    })

    // socket joining room
    socket.on("joinRoom", ({roomId, userId})=>{
        joinedRoomEventListener(roomId, userId, socket, io, userMap, roomMap);
    })
}
const joinedRoomEventListener=(roomId, userId, socket, io, userMap, roomMap)=>{
    LeaveUserFromOtherRoom(userId, userMap, roomMap, io); // if user is already in some other room then remove the user from that room and then add the user to the new room
    socket.join(roomId); // joining the room
    if(!roomMap.has(roomId)){
        roomMap.set(roomId, new Set());
    }
    roomMap.get(roomId).add(userId);
    userMap.set(userId, socket.id); // why we are setting userId and socket.id in userMap because when we want to send message to specific user we can get the socket.id from userMap using userId


    let usersInRoom= roomMap.get(roomId) || [];
    let numberOfUsersInRoom= usersInRoom? usersInRoom.size: 0;

    let timeStamp= new Date();
    // informing all the people in the room that user has joined the room
    io.to(roomId).emit("joinedChat", {userId: userId, roomId: roomId, usersInRoom:usersInRoom, total:numberOfUsersInRoom}); // all the people including the user of the room will get to know that user has joined the room, it will not send the message to other rooms?

    // gettingUserChat
    socket.on("clientMessageToRoom", ({message})=>{
        io.to(roomId).emit("serverMessageToRoom", {message, userId, timeStamp}); // all the people in the room will get the message
    });

    socket.on("LeaveRoom", ()=>{
        LeaveUserFromOtherRoom(userId, userMap, roomMap, io);
        socket.leave(roomId); // leaving the room
    })
}

const LeaveUserFromOtherRoom=(userId,userMap, roomMap, io)=>{
    if(!userMap.has(userId)) return;
    const socket= userMap.get(userId);

    for(const[roomId, userIds] of roomMap.entries()){
        if(userIds.has(userId)){
            io.emit('leftchat',`UserLeftRoom-${roomId}`, {userId, socketId: socket}); // all the peopele including the user of the romm will get to know that user has left the room
            // socket.to(roomId).emit('leftchat',`UserLeftRoom-${roomId}`, {userId, socketId: socket}); // all the peopele except the user of the romm will get to know that user has left the room
            userMap.delete(userId);
            userIds.delete(userId);
            if(userIds.size===0){
                roomMap.delete(roomId);
            }
        }
    }
}
module.exports = eventListener;