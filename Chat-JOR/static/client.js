/*
	Joe O'Regan
	30/01/2019
*/
var lastActiveUser = '';
var currentUser = '';
var userList = [];

var socket = io({transports: ['websocket'], upgrade: false});

var addMessage = (username, message, messageType) => {	
	//console.log('Message Type: ' + messageType);
	
	var outerMessageDiv = document.createElement('div');
	var usernameDiv = document.createElement('div');
	var newMessageDiv = document.createElement('div');
	
	
	//if (messageType.localeCompare('info')) {
	if (messageType == 'info') {
		//console.log('set class info');
		outerMessageDiv.classList.add('info-outer');
		newMessageDiv.classList.add('info');
	} else if (messageType == 'left') {				
		//console.log('set class left');
		outerMessageDiv.classList.add('left-outer');
		newMessageDiv.classList.add('chat');
		newMessageDiv.classList.add('left-inner');
	} else if (messageType == 'right') {
		//console.log('set class right');
		outerMessageDiv.classList.add('right-outer');
		newMessageDiv.classList.add('chat');
		newMessageDiv.classList.add('right-inner');
	} 
	
	newMessageDiv.appendChild(document.createTextNode(message));
	
	if (username != 'system' && messageType == 'left') {
		if (lastActiveUser != username) {
			//console.log('check username: ' + username);
			usernameDiv.classList.add('username');						// format the output by setting css class
			usernameDiv.appendChild(document.createTextNode(username));	// username text to display
			outerMessageDiv.appendChild(usernameDiv);
			lastActiveUser = username;
		}
	}
	outerMessageDiv.appendChild(newMessageDiv);
	
	var messageList = document.getElementById('msgList');
	//messageList.insertBefore(outerMessageDiv, messageList.childNodes[0]); // last active user name comes up on top of first message
	messageList.appendChild(outerMessageDiv);
	
	
	var scrolldiv = document.getElementById("chatdiv");
	scrolldiv.scrollTop = scrolldiv.scrollHeight;
};

// send value from input box
document.getElementById('message').addEventListener('click', (e) => {
	//var username = document.getElementById("name").value;
	
	console.log('current user: ' + currentUser);
	
	//if (!username) {
	if (!currentUser) {
		alert('Please enter a username to proceed');
		return;
	}
	
	var messageText = document.getElementById('messagetext').value;
	
	if (messageText) {
		socket.emit('message', {
			//name: username,
			name: currentUser,
			message: messageText
		});
		
		addMessage(document.getElementById('name').value, document.getElementById('messagetext').value, 'right');	// add message client side
		lastActiveUser = '';	// reset the last active user so name appears
	}
});


document.getElementById('sendName').addEventListener('click', (e) => {	
	var username = document.getElementById("name").value;
	
	if (!username) {
		alert('Please enter a username to proceed');
		return;
	}
	
	if (currentUser == '') {
		socket.emit('newuser', {
			name: username
		});
	} else {				
		socket.emit('updateuser', {
			oldname: currentUser,
			newname: username
		});		
	}
	
	currentUser = username;	// *** Verify on server
	
	document.getElementById("usernamedets").innerText = "Username: " + username;
	document.getElementById("name").value = "";
});

socket.on('user.events', (data) => {
	if (data.name == 'system') {
		//addMessage(data.name, data.message, 'info');
		console.log("info message received");
	} else if (data.name == 'update') {
		console.log("update user message received");
		updateUsers(data);
	}
	
	addMessage(data.name, data.message, 'info');
});

socket.on('message', (data) => addMessage(data.name, data.message, 'left'));


socket.on('update-user-list', (data) => {	
	var list = document.getElementById("userList");
	
	// Clear current user list
	while (list.hasChildNodes()) {
		list.removeChild(list.firstChild);
	}
	
	// Update list
	for (var i = 0; i < data.length; i++) {
	//	var listItem = document.createElement('li');
	//	//listItem.appendChild(document.createTextNode(data[i]));	// username text to display
	//	listItem.appendChild(document.createTextNode('test'));	// username text to display
	//	list.appendChild(listItem);
	//console.log
		addToList(data[i]);
	}
});

function addToList(item) {
	var list = document.getElementById("userList");
	var listItem = document.createElement('li');
	//listItem.appendChild(document.createTextNode(data[i]));	// username text to display
	listItem.appendChild(document.createTextNode(item));	// username text to display
	list.appendChild(listItem);
}


//socket.on('setname', (data) => updateUsers(data));

function updateUsers(data) {
	currentUser = data.name;
	userList = data.users;
	
	// Clear current user list
	//var list = document.getElementById("userList");
	//while (list.hasChildNodes()) {
	//	list.removeChild(list.firstChild);
	//}
  /*
	for (var i = 0; i = userList.length; i++) {
		var listItem = document.createElement('li');
		listItem.appendChild(document.createTextNode(userList[i]));	// username text to display
		list.appendChild(listItem);
	}
	*/
}