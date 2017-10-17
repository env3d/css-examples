const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const messages = [
    'Lorem ipsum dolor sit amet, per in nusquam nominavi periculis, sit elit oportere ea.',
    'Ut labores minimum atomorum pro. Laudem tibique ut has.',
    'Fugit adolescens vis et, ei graeci forensibus sed.',
    'Convenire definiebas scriptorem eu cum. Sit dolor dicunt consectetuer no.',
    'Ea duis bonorum nec, falli paulo aliquid ei eum.',
    'Usu eu novum principes, vel quodsi aliquip ea.',
    'Has at minim mucius aliquam, est id tempor laoreet.',
    'Pro saepe pertinax ei, ad pri animal labores suscipiantur.',
    'Detracto suavitate repudiandae no eum. Id adhuc minim soluta nam.',
    'Iisque perfecto dissentiet cum et, sit ut quot mandamus, ut vim tibique splendide instructior.',
    'Id nam odio natum malorum, tibique copiosae expetenda mel ea.',
    'Cu mei vide viris gloriatur, at populo eripuit sit.',
    'Modus commodo minimum eum te, vero utinam assueverit per eu.',
    'No nam ipsum lorem aliquip, accumsan quaerendum ei usu.'
];


exports.addMessage = functions.https.onRequest( (req, res) => {

    randIndex = Math.floor(Math.random() * messages.length);
    admin.database().ref('rooms/lobby/messages').push({
        connectionId: 'system',
        message: messages[randIndex],
        time: (new Date()).toUTCString(),
        user: 'system'
    });

    res.status(200).send('done');
});

// Remove system messages
exports.trimMessage = functions.database.ref('rooms/lobby/messages/{msg}').onWrite( (event) => {

    if (event.data.val().connectionId == 'system') {
        return event.data.ref.remove();
    } 
});

