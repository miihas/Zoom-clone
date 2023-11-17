const express = require('express');
const app = express();

const server = require('http').Server(app)
const io = require('socket.io')(server);
const { v4: uuidv4 } = require('uuid');
// const { ExpressPeerServer} = require('peer');
const { ExpressPeerServer } = require('peer');
// const { disconnect } = require('process');
const peerServer = ExpressPeerServer(server, {
    debug: true,
});
// const peerServer = ExpressPeerServer(server, {
//     path: '/peerjs',
//     port: 3004,
//   });
app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use('/peerjs', peerServer);
app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`)
})
app.get('/:room',(req,res) => { // Begin function for room rendering
    res.render('room', { // Render room.ejs with specified data
        roomId : req.params.room // Set roomId from URL parameters
    });
});

io.on('connection', (socket) => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);

        // socket.on('message', (message) => {
        //     io.to(roomId).emit('createMessage', message);
        // });

socket.on('message', (message) => {
    io.to(roomId).emit('createMessage', message);

    });


        socket.on('disconnect', () => {
socket.to(roomId).emit('user-disconnected', userId);
        });
        
    });
});
server.listen(process.env.PORT || 3005);

