import express from "express";
import bodyParser from 'body-parser';
import * as fs from 'fs';
import UserController from "./src/user/controller";
// Import the functions you need from the SDKs you need
import {getFirestore, addDoc, collection} from "firebase/firestore";
import * as admin from 'firebase-admin';
// import credentials from "./key.json"
import {firestore} from "firebase-admin";
import * as process from "process";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const PORT = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// Initialize Firebase
const jsonString = fs.readFileSync('key.json', 'utf8');
const credentials = JSON.parse(jsonString);
admin.initializeApp({
    credential: admin.credential.cert(credentials)
})
export const db = admin.firestore();

app.post('/api/users', UserController.createUser);


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


