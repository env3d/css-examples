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

```
<div id="chat" messages-to-keep=10 latest-message-duration=0.1 timeago-update-interval=60>
```

*messages-to-keep* (default to 5 seconds): Maximum number of messages to show before they are deleted

*latest-message-duration* (default to 1 second): When a message first arrived, it is wrapped inside a
div with the class "latest-message".  This attribute control how long the latest-message
class will stay with the element before being removed.

*timeago-update-interval* (default to 60 seconds):  when a message arrived, it is marked with a time.
The system will display the time as "xxx ago" where xxx can be seconds, minutes, or hours.  This
attribute controls how often this text is updated.


