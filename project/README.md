# Water Cooler Chat

You have been hired to design and code the user interface componone of
a new real-time chat application similar to
WhatsApp, Slack, or Google Hangout.  The main difference between this and
those other chat application is that there is no "conversation history".
Nothing is kept on the server and once a page is refreshed, what is
spoken in the chat room cannot be recovered.  That's why we called this
app "Water Cooler Chat" -- just a casual conversation.

# App structure

The chat app UI is described using HTML, and has several parameters
that can be tuned by designers.  To start, the entire chat application
must be encolsed inside a ```<div>``` with an id "chat", and can contain
up to 3 attributes, like so:

```html
<div id="chat" messages-to-keep=10 latest-message-duration=0.1 timeago-update-interval=60>
     <!-- application specific div's, explained in the rest of this doc -->
</div>
```

* **messages-to-keep** (default to 5 seconds): Maximum number of messages to show before they are deleted
* **latest-message-duration** (default to 1 second): When a message first arrived, it is wrapped inside a
div with the class "latest-message".  This attribute control how long the latest-message
class will stay with the element before being removed.
* **timeago-update-interval** (default to 60 seconds):  when a message arrived, it is marked with a time.
The system will display the time as "xxx ago" where xxx can be seconds, minutes, or hours.  This
attribute controls how often this text is updated.

Inside the #chat div, the HTML code must contain the following div's with specific id's.  Look
at (https://github.com/env3d/css-examples/blob/master/project/index.html)
[https://github.com/env3d/css-examples/blob/master/project/index.html] for a complete example of the
HTML structure.

##user

In a chat application, users must identify themselves to the system.  By default,
each user has the name _Anon_.  To change this default user, simply add a **name** attribute to this div,
like so:

```html
<div id="user" name="harambe"></div>
```
Of course, this means everyone will be identified by the same name, which is not that much better than
everyone being identified as _Anon_.  To make it more flexible, you can have the user provide his or her
screen name by inserting ```<input>``` and ```<button>```inside the user div, like so:

```html
<div id="user">
    <input type="text">
    <button>Set name</button>
</div>
```

This way, each user can set his/her own name by typing in the input box and click on the button.  Once
a name is set, the **#user** element will contain the name attribute with the new name.  Use
the element inspector to get a good feel of what this is like.

You can also create a button that sends a pre-defined name to the app.  To do that, add a "name"
attribute to a button, like so:

```html
<div id="user">
    <button id="John">Call myself John</button>
</div>
```

Why is this useful?  Imagine if you want a special app where users can only identify themselves
in groups instead of individuals, this could be handy.  

### Exercise
<ol start=1>
<li>Style the #user element so the #user div will disappear after a name is set to prevent
    users from changing their name.</li>
</ol>

##rooms

This div is used to allow users to select which room that want to be a part of.  A user can
belong to only one room at a time, and all messages are erased when switching rooms.  Rooms are created
automatically when a user joins it.  When users first connect, they do not belong to any rooms.
You can set a default room by adding the _join_ attribute to the #rooms div:

```html
<div id="rooms" join="hallway">
</div>
```

The above code will have all users join the _hallway_ room by default.  The _join_ attribute of the 
**#room** element will be updated in the web inspector when a user joins a room.

Similar to the user name, a user can also pick their own room to join.  See if the following code make sense
to you:

```html
<div id="rooms" join="system">
    <input type="text">
    <button>Join room</button>
    <button join="red">Join the red room</button>
    <button join="blue">Join the blue room</button>
    <button join="green">Join the green room</button>
</div>
```

###Exercise

<ol start=2>
<li>Style the #rooms element above so that when a user joins the above pre-determined rooms, 
the background color of the #rooms div will be changed to match the name of the current room.</li>
</ol>

##input

Now that we can set our user name and room, we need to be able to send messages.  Messages
can be sent by adding a **#input** div and providing a text input box and a button element.
Just like the **#user** and **#rooms** elements, you can include a _send_ attribute
to any button inside the **#input** element to send pre-defined messages.  All messages are
sent to the current room.

```html
<div id="input">
    <input type="text">
    <button>send</button>
    <button send="Hello!">Hello</button>
    <button send="<img src='https://cdn.meme.am/cache/images/folder688/100x100/84688.jpg'>">Suspicious Fry</button>
</div>
``` 

### Exercise

<ol start=3>
<li>Include the font awesome stylesheet [https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css]
(https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css) in your HTML, then create
3 buttons to send 3 different icons to the current chat room.  Make sure that the button description matches
the icon being sent.</li>
</ol>

##messages

When a user sends a message to a room, all users in that room will receive that message.  The messages will 
be inserted inside the **#messages** div.  When you first define your HTML, include an empty **#messages** 
div as follows:

```
<div id="messages"></div>
```

Then, using the web inspector while your page is running, you will noticed a series of divs being
insert inside the **#messages** element.  Each div represents an individual message and has 
the following structure:

```
<div>
    <span>from user</span>
    <span>The content of the message</span>
    <time datetime="2017-02-15T19:21:20.848Z">10 hours ago</time>
</div>
```

If a message is sent by the current user, the above div will contain the class _self_.  When a message 
first arrive, the above div will also contain the class _latest-message_, which will be removed after 
a number of seconds specified by the _latest-message-duration_ attribute of the **#chat** element.

The number of messages to keep on screen is determined by the _messages-to-keep_ attribute inside the **#chat** 
element.

**Note on testing** If you join the _system_ room, automated messages will be sent to this room every few 
seconds. This will greatly help when you are testing your page.

###Exercise

<ol start=4>
<li>Style the messages so that each of the 3 fields of the message will separated by some space, 
and put some vertical margin/padding between the messages.</li>
<li>Style the messages sent by you to be different visually than messages sent by other people.</li>
<li>Have the new message be styled differently than the old messages.</li>
<li>**(Challenging)** Style the messages so that each of the 3 fields will have different 
colors/background color.</li>
</ol>

##num

Reports the number of users in the current room.  The class _multiple_ is added when there are more
than one user in a room.  Use the web inspector to observe how it changes.

###Exercise

<ol start=8>
<li>When a room has more than one person, style the #num element with a different background color.</li>
</ol>

##current-room

Reports the current room a user is in.

##members

For every user in the current room, a div is added to this element.  For instance, if 
the current room has 3 users: Mary, John, and Paul, the #members div will look like the 
following:

```
<div id="members">
    <div>Mary</div>
    <div class="self">John</div>
    <div>Paul</div>
</div>
```

You will noticed that one of the member contains the class _self_.  This indicates that
the current user of this connection.

###Exercise

<ol start=9>
<li>Style the current user in bold.</li>
</ol>

##error

If a server error occurs, the message will be added to this div.  Best to keep it hidden by styling it
with ```display: none```.
