const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const fs = require('fs');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve index.html on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve chat.html on the /chat route
app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'chat.html'));
});

// Handle connection event for Socket.IO
io.on('connection', (socket) => {
    console.log('A user connected:' + socket.id);


    //실제 함수 on이 붙은 곳이 함수 정의하는 곳, emit이 함수 실행하는 곳
    //html 쪽도 마찬가지
    //io.emit - public
    //io.to(recipientId).emit - private
    //socket.broadcast.emit - broadcast
    //socket.broadcast.emit - breadcast

    //index.html을 위한 함수
    socket.on("messageme",function (data) {
    	let log = data + ' from ' + socket.id;
    	console.log(log);
    	socket.emit("logtoclient",(log));
    })

    socket.on("messageall",function (data) {
    	let log = data + ' from ' + socket.id;
    	console.log(log);
    	io.emit("logtoclient",(log));
    })

    //chat.html을 위한 함수
    socket.on("message",function (data) {
    	console.log(data + ' from ' + socket.id);
    	io.emit("message",(socket.id + " : " + data));
    })

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
