// Interacting with other browsers
// https://www.linkedin.com/learning/building-complex-express-sites-with-redis-and-socket-io/broadcasting-a-message

const express = require('express'),
	http = require('http');
	socketio = require('socket.io');

var port = process.env.PORT || 3000;
var app = express();
//var server = app.listen(8080);
//var server = app.listen(process.env.PORT || 3000);
//var io = socketio(server);
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.use(express.static('static'));

io.on('connection', (socket) => {
	socket.broadcast.emit('user.events', {name: 'system', message: 'Someone has joined!'});
	console.log('New User Connected');
	
	socket.on('message', (data) => {
		console.log(data.name, 'says', data.message);
		socket.broadcast.emit('message', data);	// broadcast to everyone except this
	});
});

server.listen(port);