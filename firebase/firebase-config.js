// Importo firebase-admin
var admin = require("firebase-admin");
// Importo i dati del progetto di firebase
var serviceAccount = require("./service-account.json");
// Inizializzo l'app
admin.initializeApp({
  apiKey: "INSERT API KEY HERE",
  authDomain: "INSERT AUTH DOMAIN HERE",
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "INSERT DB URL HERE",
  storageBucket: "INSERT STORAGE BUCKET HERE"
});
// Esporto admin
module.exports.admin = admin;