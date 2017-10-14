const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.addMessage = functions.https.onRequest( (req, res) => {

    admin.database().ref('rooms/lobby/messages').push({
        connectionId: 'system',
        message: 'random message from system',
        time: (new Date()).toUTCString(),
        user: 'system'
    });

    res.status(200).send('done');
});
