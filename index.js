const express = require('express');
const fs = require('fs');
const https = require('https');
const {createServer} = require('node:http');
const {join} = require('node:path');
const {Server} = require('socket.io');

const app = express();
// const server = createServer(app);
// const io = new Server(server);
/*const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/nodejs.druto.app/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/nodejs.druto.app/fullchain.pem')
};*/
const options = {
    key: fs.readFileSync((__dirname, 'certs/privkey.pem')),
    cert: fs.readFileSync(join(__dirname, 'certs/fullchain.pem'))
};


const server = https.createServer(options, app);
const io = new Server(server);
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public/index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
    });
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message1', msg);
    });
});
io.on('connection', (socket) => {
    // join the room named 'some room'
    socket.join('some room');

    // broadcast to all connected clients in the room
    io.to('some room').emit('hello', 'world');

    // broadcast to all connected clients except those in the room
    io.except('some room').emit('hello', 'world');

    // leave the room
    socket.leave('some room');
});
server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
