/*
	Joe O'Regan
	30/01/2019
*/
const express = require('express'),
	http = require('http');
	socketio = require('socket.io');

var port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.use(express.static('static'));

var users = [];

io.on('connection', (socket) => {
	//socket.broadcast.emit('user.events', {name: 'system', message: 'Someone has joined!'});
	console.log('New User Connected');
	
	socket.on('newuser', (data) => {
		console.log('new connection from ');
		
		var nameExists = false;
		
		for (var i = 0; i < users.length; i++) {
			if (users[i] == data.name) {
				nameExists = true;
				break;
			}
		}
		
		if (!nameExists) {
			users.push(data.name);
		}
		
		console.log('Current Users ('+users.length+'): ' + users);
		//socket.broadcast.emit('user.events', {name: 'update', message: 'User: ' + data.name + ' has joined the chat. Users: ' + userList.length, users: userList});
		socket.broadcast.emit('user.events', {name: 'system', message: 'User: ' + data.name + ' has joined the chat. Users: ' + users.length});
		
		io.emit('update-user-list', users);
	});
	
	socket.on('updateuser', (data) => {
		var nameChanged = false;
		
		for (var i = 0; i < users.length; i++) {
			if (users[i] == data.oldname) {
				users[i] = data.newname;
				nameChanged = true;
				break;
			}
		}
		
		if (nameChanged) {
			console.log('User: ' + data.oldname + ' is now "' + data.newname + '"');
			console.log('Current Users ('+users.length+'): ' + users);
			socket.broadcast.emit('user.events', {name: 'system', message: 'User: ' + data.oldname + ' is now "' + data.newname + '"'});
			
			
			
			
			io.emit('update-user-list', users);
		}
	});
	
	socket.on('message', (data) => {
		console.log(data.name, 'says', data.message);
		socket.broadcast.emit('message', data);	// broadcast to everyone except this
	});
	
	socket.on('disconnect', function() {
		console.log('User has disconnected / reset connection');
		
		if (users.length > 0) {
			socket.broadcast.emit('user.events', {name: 'system', message: 'Someone has left the chat!'});
		}
	});
});

server.listen(port);