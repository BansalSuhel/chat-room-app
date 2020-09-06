const path = require('path');
const http = require('http');
const express = require('express');
const socket = require('socket.io');

const formatMessage = require('./utils/message');
const {
    addUser,
    usersByRoomName,
    getDisconnectUserById,
    getCurrentUser
} = require('./utils/user');


const app = express();

//creating server
const server = http.createServer(app);

//serving static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + "/public" + "/index.html"));
});

const io = socket(server);

const chatBot = 'ChatBot';

//Run when client connects
io.on('connection', (socket) => {

    //Handling join-room event from client when user join room
    socket.on('join-room', ({
        username,
        room
    }) => {

        const user = addUser(socket.id, username, room);

        //User join T Room
        socket.join(user.room);

        //emit message from server to only connecting user
        socket.emit('message', formatMessage(chatBot, 'welcome to chat room!'));

        //broadcast message to all users except joined user
        socket.broadcast.to(user.room).emit('message', formatMessage(chatBot, `${user.username} has joined the chat room`));

        //emiting all users and room to clients
        io.to(user.room).emit('users-room', {
            room: user.room,
            users: usersByRoomName(user.room)
        });
    });

    //Recieving chat message from clients
    socket.on('chat-message', (msg) => {
        const user = getCurrentUser(socket.id);
        //emiting chat message to clients with username
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    //Run when clients disconnect
    socket.on('disconnect', () => {
        const user = getDisconnectUserById(socket.id);

        if (user) {
            //emit message to everyone
            io.to(user.room).emit('message', formatMessage(chatBot, `${user.username}  has left the room`));

            //emiting all users and room to clients
            io.to(user.room).emit('users-room', {
                room: user.room,
                users: usersByRoomName(user.room)
            });

        }

    });


});


//Listening on port 3001
const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})