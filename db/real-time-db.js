var admin = require('../firebase/firebase-config').admin

// Istanzio db
var database = admin.database();

// WRITE IN DB MESSAGES WITH NOTIFICATION PAYLOAD 

// Function per scrivere la notifica con payload Notification e tipo di invio Topic
function insertNotificationTopic(notificationId, topic, title, body, date) {
    database.ref('messages/notifications/topicNotifications/' + notificationId).set({
        "Operation": "Message with notification payload",
        "Type of dispatch": "Topic",
        topic: topic,
        title: title,
        body : body,
        date : date
    });
}

// Function per scrivere il messaggio con payload Notification e tipo lista di fcm
function insertNotificationFcm(data) {    
    var ref = database.ref('messages/notifications/fcmNotifications/').orderByKey().limitToLast(1);
    ref.once("value", function(snapshot) {
        if(snapshot.val() == null) {
            database.ref('messages/notifications/fcmNotifications/1').set({
                "status": data.status,
                "operation": data.operation,
                "type of dispatch": data["type of dispatch"],
                "notification title": data["notification title"],
                "notification body": data["notification body"],
                "fcm list": data["fcm list"],
                "date": data.date,
                "messages": data.messages
            })
        }
        else {
            var key = parseInt(snapshot.node_.children_.root_.key) + 1;
            database.ref(`messages/notifications/fcmNotifications/${key}`).set({
                "status": data.status,
                "operation": data.operation,
                "type of dispatch": data["type of dispatch"],
                "notification title": data["notification title"],
                "notification body": data["notification body"],
                "fcm list": data["fcm list"],
                "date": data.date,
                "messages": data.messages
            })
        }
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code)
    })
}

// WRITE IN DB MESSAGES WITH DATA PAYLOAD 

// Function per scrivere il messaggio con payload Data e tipo di invio Topic
function insertDataTopic(notificationId, topic, title, body, condition, schedule, date) {
    database.ref('messages/data/topicData/' + notificationId).set({
        "operation": "Message with Data payload",
        "type of dispatch": "Topic",
        topic: topic,
        title: title,
        body : body,
        condition: condition,
        schedule: schedule,
        date : date
    });
}

// Function per scrivere il messaggio con payload Data e tipo lista di fcm
function insertDataFcm(data) {    
    var ref = database.ref('messages/data/fcmData/').orderByKey().limitToLast(1);
    ref.once("value", function(snapshot) {
        if(snapshot.val() == null) {
            database.ref('messages/data/fcmData/1').set({
                "status": data.status,
                "operation": data.operation,
                "type of dispatch": data["type of dispatch"],
                "notification title": data["notification title"],
                "notification body": data["notification body"],
                "condition": data.condition,
                "schedule": data.schedule,
                "fcm list": data["fcm list"],
                "date": data.date,
                "messages": data.messages
            })
        }
        else {
            var key = parseInt(snapshot.node_.children_.root_.key) + 1;
            database.ref(`messages/data/fcmData/${key}`).set({
                "status": data.status,
                "operation": data.operation,
                "type of dispatch": data["type of dispatch"],
                "notification title": data["notification title"],
                "notification body": data["notification body"],
                "condition": data.condition,
                "schedule": data.schedule,
                "fcm list": data["fcm list"],
                "date": data.date,
                "messages": data.messages
            })
        }
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code)
    })
}


// Function per leggere le notifiche dal db
async function readNotifications() {
    // Leggo il ramo "notification" dal db
    var notifications = database.ref('messages/');
    
    // Crep funzione con promise
    const getData = (ref) => {
        return new Promise((resolve, reject) => {
            const onError = error => reject(error);
            const onData = snap => resolve(snap.val());

            ref.on('value', onData, onError)
        })
    }
    // Salvo in data i risultati della query
    let data = await getData(notifications)
        .then((value) => {
            return value;
        })
        .catch((error) => {
            return error;
        })
    // Ritonro i dati
    return data;
}
  

// Esporto le function
module.exports.insertNotificationTopic = insertNotificationTopic;
module.exports.insertNotificationFcm = insertNotificationFcm;
module.exports.insertDataTopic = insertDataTopic;
module.exports.insertDataFcm = insertDataFcm;
module.exports.readNotifications = readNotifications;