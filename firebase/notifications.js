// Importo admin
var admin = require('./firebase-config').admin;
// Importo function per scrivere nel db
var db = require('../db/real-time-db');



// FUNCTION PER FORMATTARE I MESSAGGI

// Function per formattare qualsiasi messaggio con payload Notification
function formatNotificationMessage(title, body, receiver) {
    // Inizio a formattare il messaggio con le parti uguali per tutti
    var message = {
        "notification":{
            "body": body,
            "title":title
        }
    };
    // Per prima cosa controllo il tipo di receiver
    // Se è una String, allora è il nome di un topic
    if(typeof receiver == "string") {
        message.topic = receiver;
    }
    // Altrimenti si tratta di un array di fcm
    else {
        message.tokens = receiver;
    }
    return message;
}

// Function per formattare qualsiasi messaggio con payload Data
function formatDataMessage(title, body, receiver, condition, schedule) {
    var message = {
        "data": {
            "title": title,
            "body": body,
            "schedule": schedule,
            "condition": condition,
        }
    };
    // Per prima cosa controllo il tipo di receiver
    // Se è una String, allora è il nome di un topic
    if(typeof receiver == "string") {
        message.topic = receiver;
    }
    // Altrimenti si tratta di un array di fcm
    else {
        message.tokens = receiver;
    }
    return message;
}



// FUNCTION PER INVIARE I MESSAGGI

// Function per inviare tutti i messaggi con payload Notification
async function sendNotificationMessage(message) {
    let res;
    // Caso in cui il destinatario del messaggio sia un topic
    if(message.topic) {
        try {
            res = admin.messaging().send(message)
                // Caso in cui la notifica viene inviata correttamente
                .then((response) => {
                    // Salvo la data e l'ora attuali
                    var time = new Date().getTime();
                    var date = new Date(time);
                    // Scrivo nel db il risultato
                    db.insertNotificationTopic(response.split("/")[3], message.topic, message.notification.title, message.notification.body, date.toString());
                    return {
                        "status": "Message sent.",
                        "operation": "Message with notification payload",
                        "type of dispatch": "Topic",
                        "notification title": message.notification.title,
                        "notification body": message.notification.body,
                        "topic": message.topic,
                        "tate": date.toString()
                    }
                });
        } catch (error) {
            return {
                "operation": "Message with notification payload",
                "type of dispatch": "Topic",
                "error": error
            }
        }
    }
    // Caso in cui il destinatario del messaggio siano uno o più fcm Token
    else {
        res = admin.messaging().sendMulticast(message)
        .then((response) => {

            var time = new Date().getTime();
            var date = new Date(time);
            var counter = 0;
            var data = {
                "status": response.successCount + ' messages were sent successfully, ' + response.failureCount + ' messages were not sent successfully',
                "operation": "Message with notification payload",
                "type of dispatch": "FCM List",
                "notification title": message.notification.title,
                "notification body": message.notification.body,
                "fcm list": message.tokens,
                "date": date.toString(),
                "messages": []
            };
            response.responses.forEach(response => {
                data.messages.push({
                    "message number": counter + 1,
                    "message id": response.messageId ? response.messageId.split("/")[3].split("%")[0].split(":")[1] : null,
                    "fcm Token": message.tokens[counter],
                    "success": response.success,
                    "error": response.success == false ? response.error.toJSON() : null
                })
                counter++
            });
            db.insertNotificationFcm(data);
            return data;
        });
    }
    return res
}

// Function per inviare tutti i messaggi con payload Data
async function sendDataMessage(message) {
    let res;
    // Caso in cui il destinatario del messaggio sia un topic
    if(message.topic) {
        try {
            res = await admin.messaging().send(message)
                // Caso in cui la notifica viene inviata correttamente
                .then((response) => {
                    console.log(message)
                    // Salvo la data e l'ora attuali
                    var time = new Date().getTime();
                    var date = new Date(time);
                    // Scrivo nel db il risultato
                    db.insertDataTopic(response.split("/")[3], message.topic, message.data.title, message.data.body, message.data.condition, message.data.schedule, date.toString());
                    return {
                        "status": "Message sent",
                        "operation": "Message with notification payload",
                        "type of dispatch": "Topic",
                        "notification title": message.data.title,
                        "notification body": message.data.body,
                        "condition": message.data.condition,
                        "topic": message.topic,
                        "date": date.toString()
                    }
                })
        } catch (error) {
            return {
                "operation": "Message with notification payload",
                "type of dispatch": "Topic",
                "error": error
            }
        }
    }
    // Caso in cui il destinatario del messaggio siano uno o più fcm Token
    else {
        res = await admin.messaging().sendMulticast(message)
        .then((response) => {
            var time = new Date().getTime();
            var date = new Date(time);

            
            var counter = 0;
            var data = {
                "status": response.successCount + ' messages were sent successfully, ' + response.failureCount + ' messages were not sent successfully',
                "operation": "Message with notification payload",
                "type of dispatch": "FCM List",
                "notification title": message.data.title,
                "notification body": message.data.body,
                "condition": message.data.condition,
                "schedule": message.data.schedule,
                "fcm list": message.tokens,
                "date": date.toString(),
                "messages": []
            };
            response.responses.forEach(response => {
                data.messages.push({
                    "message number": counter + 1,
                    "message id": response.messageId ? response.messageId.split("/")[3].split("%")[0].split(":")[1] : null,
                    "fcm Token": message.tokens[counter],
                    "success": response.success,
                    "error": response.success == false ? response.error.toJSON() : null
                })
                counter++
            });
            db.insertDataFcm(data);
            return data;
        })
    }
    return res;
}

// Esporto le funzioni
module.exports.formatNotificationMessage = formatNotificationMessage;
module.exports.formatDataMessage = formatDataMessage;
module.exports.sendNotificationMessage = sendNotificationMessage;
module.exports.sendDataMessage = sendDataMessage;