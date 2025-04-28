import admin from 'firebase-admin'

var serviceAccount = require("../../google-services.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firebase = admin;

export default firebase;