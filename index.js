// Importo il file notifications.js con le sue funzioni
var notifications = require('./firebase/notifications')
// Importo express
var express = require("express");
// Importo il body-parser per poter leggere i json 
// contenuti nel body della request
var bodyParser = require('body-parser');
// Importo l'async handler per gestire le funzioni asincrone
const asyncHandler = require('express-async-handler')
// Importo il database
const db = require('./db/real-time-db');

// Inializzo il server
var app = express();
app.use(bodyParser.json())

var port = 3000;

// Server in ascolto
app.listen(port, () => {
    console.log(`Server running at port ${port}`);
})


/*
{
    "title": "Prova nuova notifica",
    "body": "Prova per vedere se viene mostrata la notifica in foreground",
    "schedule": "false",
    "condition": "condition1",
    "receiver": "INSERT RECEIVER HERE: one topic name or an array of fcm tokens"
}
*/
app.post("/message_data", asyncHandler(async(req, res, next) => {
    if(req.body.title && req.body.body && req.body.receiver && req.body.condition && req.body.schedule) {
        var notification = notifications.formatDataMessage(req.body.title, req.body.body, req.body.receiver, req.body.condition, req.body.schedule)
        var data = await notifications.sendDataMessage(notification);
        res.json(data);
    }
    else {
        res.json({"error": "Devi inserire per forza: 'title', 'body', 'receiver', 'condition' e 'schedule'"})
    }
}));

/*
Esempio di request body:
    {
        "title": "Prova nuova notifica",
        "body": "Prova per vedere se viene mostrata la notifica in foreground",
        "receiver": "INSERT RECEIVER HERE: one topic name or an array of fcm tokens"
    }

Questo è l'endpoint per inviare messaggi con payload di tipo Notification
*/

app.post("/message_notification", asyncHandler(async(req, res, next) => {
    if(req.body.title && req.body.body && req.body.receiver) {
        var notification = notifications.formatNotificationMessage(req.body.title, req.body.body, req.body.receiver)
        var data = await notifications.sendNotificationMessage(notification);
        res.json(data);
    }
    else {
        res.json({"error": "Devi inserire per forza: 'title', 'body' e 'receiver'"})
    }
}))

// Route dell'api per leggere notitifiche
app.get("/notification", asyncHandler(async(req, res, next) => {
    var data = await db.readNotifications();
    console.log(data)
    res.json(data);
}));