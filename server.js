const path = require('path')
const http = require('http')
const express = require('express')
const socketIo = require('socket.io')
let port;
const {generateMessage,generateLocationMessage} = require('./utils/messages');
const {addUser,removeUser,getUser,getUsersInRoom} = require('./utils/users');
if(process.env.PORT) port=process.env.PORT;
else port=3001;


app = express();
const server = http.Server(app);

app.get('/',(req,res)=> res.send("CHATMAN SERVER 1.0.0")); //static route




const io = socketIo(server);


io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    //Listen for join users and then send message, and broadcast his name to other users in room
    socket.on('join',({username,room},callback)=>{
        const {error,user} =  addUser({id: socket.id,username: username,room: room})
        if(error)
        {
            return callback(error)
        }

        socket.join(room)

        socket.emit('message', generateMessage('Admin','Welcome to CHATMAN. Room name: '+room))
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`,`${user.username} has joined!`))//broadcast send message to everyone when somone join, .to send message to room
        io.to(user.room).emit('roomData',{
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        //socket.emit,io.emit, socket.broadcast.emit
        //io.to.emit
    })
    socket.on('sendMessage', (message, callback) => {
        const {room,username,id} = getUser(socket.id);

        if(username==="undefined" || room ==="undefined"){
            io.to(socket.id).emit('message', generateMessage("Admin","You have to login!"));
            callback();
        }
        else{

            io.to(room).emit('message', generateMessage(username,message))
            callback()
        }

    });


    socket.on('typing', (typingUser, callback) => {
        const {room,username,id} = getUser(socket.id);

        if(username==="undefined" || room ==="undefined"){
            io.to(socket.id).emit('typing', generateMessage("Admin","You have to login!"));
            callback();
        }
        else{

            io.to(room).emit('typing', {username:typingUser});
            callback()
        }

    })




    socket.on('sendLocation', (coords, callback) => {
        const {room,username,id} = getUser(socket.id)

        io.to(room).emit('locationMessage', generateLocationMessage(username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user){ // update list of logeed in users:
            io.to(user.room).emit('message',generateMessage(`A ${user.username} has left!`))
            io.to(user.room).emit('roomData',{
                room: user.room,
                users:getUsersInRoom(user.room)
            })
        }

    })
})

server.listen(port);