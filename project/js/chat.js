
class Chat {
    constructor(chatServer) {
	this.socket = null;
	this.timeformat = new timeago();
	this.chatServer = chatServer;
    }

    sendDefaultData(selector, event) {
	// If an attribute contains the event, then send it first
	var attr = document.querySelector(selector).getAttribute(event);
	if (attr) {
	    console.log("Emitting event", event, attr);
	    this.socket.emit(event, attr);
	} 
    }

    // utility function to add socket emit behavior to a button
    addButtonBehavior(selector, event) {

	// Check if we have a button
	var buttonSelector = selector+" button, "+selector+" ["+event+"]";
	// get a list of all buttons 
	var buttons = document.querySelectorAll(buttonSelector);
	// iterate over all buttons and add behavior
	// if a button has an attribute matching the event, we emit
	// the content of that attribute to socket.io

	var input = document.querySelector(selector+" input");
	if (input) {
	    input.addEventListener('click', function(e) {
		e.stopPropagation();
	    });		
	}

	for (var i=0; i<buttons.length; i++) {
	    var self = this;
	    var button = buttons.item(i);
	    button.addEventListener('click', function(){
		console.log('button clicked',event, this.getAttribute(event));
		this.getAttribute(event) ? 
		    self.socket.emit(event, this.getAttribute(event)) :
		    self.socket.emit(event, input.value);
		input && (input.value = '');
	    });
	}
    }

    connect() {
	this.socket.connect();
    }

    disconnect() {
	this.socket.disconnect();
    }

    onConnect(data) {
	console.log("connected");
	this.sendDefaultData("#user", "name");
	this.sendDefaultData("#rooms", "join");
	setTimeout((function() {
	    this.sendDefaultData("#input", "send");
	}).bind(this), 100);
    }

    onDisconnect(data) {
	console.log('disconnect');
	document.querySelector("#current-room").innerHTML = '';
	document.querySelector("#members").innerHTML = '';
	document.querySelector("#num").innerHTML = '';
    }

    onMessage(data) {
	console.log("data received", data);
	//navigator.vibrate(500);
	var container = document.getElementById("messages");
	if (container) { 
	    // message is an object containing a user and the message
	    var node = document.createElement("div");
	    if (data.socketid == this.socket.id) {
		node.classList.add('self');
	    }
	    node.classList.add('latest-message');	     
	    
	    var user = document.createElement("span");
	    user.innerHTML = data.user;

	    var message = document.createElement("span");
	    message.innerHTML = data.message;

	    var time = document.createElement("time");
	    time.setAttribute("datetime", data.time);
	    time.innerHTML = this.timeformat.format(data.time);

	    node.appendChild(user);
	    node.appendChild(message);
	    node.appendChild(time);

	    container.insertBefore(node, container.firstChild);
	    
	    if (container.children.length > this.messagesToKeep) {
		container.removeChild(container.lastChild);
	    }
	}

	setTimeout(function() {
	    console.log("removing class");
	    node.classList.remove('latest-message');
	}, this.latestMessageDuration*1000);
    }

    onServer(data) {
	// server is sending us some administrative messages
	console.log("Server message", data);
    }

    onMembers(data) {
	console.log("received", data);
	var currentRoom = document.querySelector("#current-room");
	if (currentRoom) 
	    currentRoom.innerHTML = data.room;

	var rooms = document.querySelector("#rooms");
	if (rooms && rooms.getAttribute("join") != data.room) {
	    rooms.setAttribute("join", data.room);
	    var messages = document.querySelector("#messages");
	    while(messages.lastChild) 
		messages.removeChild(messages.lastChild);
	}
	
	var members = document.querySelector("#members");
	if (members) {
	    while(members.lastChild) 
		members.removeChild(members.lastChild);
	    
	    data.members.forEach((function(member) {
		var memberDiv = document.createElement("div");	    
		memberDiv.innerHTML = member.username;
		
		if (member.sid === this.socket.id) {
		    memberDiv.classList.add("self");
		    member.username == "Anon" || 
			document.querySelector("#user").setAttribute("name", member.username);
		} else if (member.username == "Anon") {
		    memberDiv.classList.add("anon");
		}
		
		members.appendChild(memberDiv);    
	    }).bind(this));	    
	}

	var num = document.querySelector("#num");
	if (num) {
	    data.members.length > 1 ? 
		num.classList.add("multiple") :
		num.classList.remove("multiple");
	    num.innerHTML = data.members.length;
	}
    }

    init() {
	var chatApp = document.querySelector("#chat");

	// user configurable parameters
	// -------
	this.timeagoUpdateInterval = chatApp.getAttribute("timeago-update-interval") || 60;
	this.messagesToKeep = chatApp.getAttribute("messages-to-keep") || 5;
	this.latestMessageDuration = chatApp.getAttribute("latest-message-duration") || 1;
	// -------
	var self = this;

	self.socket = io.connect(this.chatServer);
	self.socket.on('connect', this.onConnect.bind(this));
	self.socket.on('disconnect', this.onDisconnect.bind(this));
	self.socket.on('server', this.onServer.bind(this));
	self.socket.on('message', this.onMessage.bind(this));
	self.socket.on('members', this.onMembers.bind(this));

	// Update the time every once in a while
	setInterval(function() {
	    console.log("updating time");
	    var matches = document.querySelectorAll("time");
	    for (var i=0; i<matches.length; i++) {
		var timeItem = matches.item(i);
		timeItem.innerHTML = self.timeformat.format(timeItem.getAttribute("datetime"));
	    }
	}, this.timeagoUpdateInterval*1000);

	// Attach some events to buttons
	var roomButtons = document.querySelectorAll("#rooms > button");
	for (var i=0; i<roomButtons.length; i++) {
	    var button = roomButtons.item(i);
	    button.addEventListener('click', function() {
		var roomName = self.innerHTML;
		console.log('joining room', roomName);		     
		self.socket.emit('join', roomName);
	    });
	};

	this.addButtonBehavior("#user", "name");
	this.addButtonBehavior("#rooms", "join");
	this.addButtonBehavior("#input", "send");	     

    }
}


var CHAT = new Chat("http://operatoroverload.com");
window.addEventListener('load', function() {
    CHAT.init();
});


