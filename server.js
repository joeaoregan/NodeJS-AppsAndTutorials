// Interacting with another browsers

const express = require('express'),
	http = require('http');
	socketio = require('socket.io');

//var port = process.env.PORT || 3000;
var app = express();
//var server = app.listen(8080);
//var server = app.listen(process.env.PORT || 3000);
//var io = socketio(server);
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.use(express.static('static'));

io.on('connection', (socket) => {
	socket.broadcast.emit('user.events', 'Someone has joined!');
	
	socket.on('name', (name) => {
		console.log(name, ' says hello');
		socket.broadcast.emit('name', name);	// broadcast to everyone except this
	});
});

server.listen(process.env.PORT);