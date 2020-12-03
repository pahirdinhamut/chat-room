var path = require('path');
var http = require('http');
var express = require('express');
var socketio = require('socket.io');
var formatMessage = require('./utilis/messages');
var { username, gerCurrentUser, userJoin, userLeaves, getRoomUser, getRoomUsers } = require('./utilis/users');




var app = express();
var server = require('http').createServer(app);
var io = socketio(server);


// set static folder 

app.use(express.static(path.join(__dirname, ('public/'))));

const botName = 'Chat room Bot';


// run when client connects 

io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);


        // welcome user current ;
        socket.emit('message', formatMessage(botName, 'welcome to chat Room'));

        // Broadcast (yayın ) when a user connects ;
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username }  has joined the Room`));

        // send users and room info 

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });


    });
    // Listen for chatMessages
    socket.on('chatMessages', msg => {
        const user = gerCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // runs when client disconnects;
    socket.on('disconnect', () => {
        const user = userLeaves(socket.id);
        if (user) {

            io.to(user.room).emit('message', formatMessage(botName, `${user.username}  has left the chat`));

            // send users and room info 

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });

        }
    });

});


// app.get('/', (req, res) => {
//     res.send('it is working');
// })

server.listen(3000, () => {
    console.log('runing on port *:3000');
});