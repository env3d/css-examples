// Initialize Firebase
var config = {
    apiKey: "AIzaSyBOVlDjozZfnpJiHpW5YKYBNd9q0r3qFqs",
    authDomain: "watercooler-chat-ae182.firebaseapp.com",
    databaseURL: "https://watercooler-chat-ae182.firebaseio.com",
    projectId: "watercooler-chat-ae182",
    storageBucket: "watercooler-chat-ae182.appspot.com",
    messagingSenderId: "149598481154"
};
firebase.initializeApp(config);


class Chat {
    constructor(chatServer) {
	this.timeformat = new timeago();
    }

    // utility function to add socket emit behavior to a button
    addButtonBehavior(selector, event, callback) {

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
                let message = this.getAttribute(event) || input.value;
		input && (input.value = '');
		console.log('button clicked', event, message);
                // execute proper callback
                callback && callback(message);                
	    });
	}
    }

    // When a message comes in, this method modifies the DOM
    // display it on screen
    onMessage(data) {

	//navigator.vibrate(500);
	var container = document.getElementById("messages");
	if (container) {
	    console.log("onMessage", data);            
	    // message is an object containing a user and the message
	    var node = document.createElement("div");

	    if (data.connectionId == this.connectionId) {
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

            // make sure we only display a limited amount of messages
	    if (container.children.length > this.messagesToKeep) {
		container.removeChild(container.lastChild);
	    }
	}

	setTimeout(function() {
	    console.log("removing class");
	    node.classList.remove('latest-message');
	}, this.latestMessageDuration*1000);
        
    }

    // When the membership of the current room changes, this method is fired
    onMembers(data) {
	console.log("onMembers", data);
	var currentRoom = document.querySelector("#current-room");
	if (currentRoom) 
	    currentRoom.innerHTML = data.room;

        // When a join a new room, remove all the messages
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
		
		if (member.connectionId === this.connectionId) {
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

    // Utility method for joining a room 
    joinRoom(room) {

        if (this.connectionRef) {
            this.connectionRef.set(null);
            document.querySelector("#messages").innerHTML = '';
            firebase.database().ref('rooms/'+this.room+'/messages').off();
            firebase.database().ref('rooms/'+this.room+'/members').off();            
        }
        
        this.room = room;        
        
        // announce my presence
        this.connectionRef = firebase.database().ref('rooms/'+this.room+'/members').push(false);
        // the key to this annoucement will also act as my connectionId
        this.connectionId = this.connectionRef.key;
        // set my initial name
        this.connectionRef.set(this.username);        
        this.connectionRef.onDisconnect().set(null);

        // Listen to membership change
        firebase.database().ref('rooms/'+this.room+'/members').on('value', (members) => {
            console.log('membership callback', members.val());
            let memberJson = {room: this.room, members: []};
            members.forEach((member) => {
                memberJson.members.push({username: member.val(), connectionId: member.key});
            });
            this.onMembers(memberJson);            
        });

        // subscribe to messages in this room
        console.log('fetching the last '+this.messagesToKeep+' messages');
        firebase.database().ref('rooms/'+this.room+'/messages')
                .limitToLast(parseInt(this.messagesToKeep))
                .on('child_added', (data) => {
                    console.log('messages callback: child_added');
                    this.onMessage(data.val());
                });
    }

    init() {
	var chatApp = document.querySelector("#chat");

	// user configurable parameters
	// -------
	this.timeagoUpdateInterval = chatApp.getAttribute("timeago-update-interval") || 60;
	this.messagesToKeep = chatApp.getAttribute("messages-to-keep") || 5;
	this.latestMessageDuration = chatApp.getAttribute("latest-message-duration") || 1;
	// -------

        // -------        
        this.username = document.querySelector("#user").getAttribute("name") || 'Anon';        
        this.room = document.querySelector("#rooms").getAttribute("join") || 'lobby';
        this.joinRoom(this.room);        
        // -------
        
	var self = this;

	// Update the time every once in a while
	setInterval(function() {
	    console.log("updating time");
	    var matches = document.querySelectorAll("time");
	    for (var i=0; i<matches.length; i++) {
		var timeItem = matches.item(i);
		timeItem.innerHTML = self.timeformat.format(timeItem.getAttribute("datetime"));
	    }
	}, this.timeagoUpdateInterval*1000);

	this.addButtonBehavior("#user", "name", (name) => {
            console.log('changing user name to '+name);
            this.username = name;
            this.connectionRef.set(this.username);
        });
	this.addButtonBehavior("#rooms", "join", (room) => {
            console.log('switching to room '+room);
            this.joinRoom(room);
        });
	this.addButtonBehavior("#input", "send", (message) => {
            console.log('sending message '+message);
            firebase.database().ref('rooms/'+this.room+"/messages")
                    .push({
                        user: this.username,
                        connectionId: this.connectionId,
                        message: message,
                        time: (new Date()).toUTCString()
                    });
        });
    }
}


var CHAT = new Chat();
window.addEventListener('load', function() {
    CHAT.init();
});


