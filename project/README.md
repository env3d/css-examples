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
must be encolsed inside a <div> with an id "chat", and can contain
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

Inside the #chat div, the HTML code must contain the following div's with specific id's:

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

* Style the **#user** element so the **#user** div will disappear after a name is set as to prevent
users from changing their name.

##rooms

##messages

##num

##current-room

##members

##input

##error

