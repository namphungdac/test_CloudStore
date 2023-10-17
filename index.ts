import express from "express";
import bodyParser from 'body-parser';
import * as fs from 'fs';
import * as process from "process";
import UserController from "./src/user/controller";
// import {getFirestore, addDoc, collection} from "firebase/firestore";
import * as admin from 'firebase-admin';
import {firestore} from "firebase-admin";
import {initializeApp, cert} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Initialize Firebase
const jsonString = fs.readFileSync('key.json', 'utf8');
const credentials = JSON.parse(jsonString);
initializeApp({
    credential: cert(credentials)
})
export const db = getFirestore();

app.post('/api/users', UserController.createUser);
app.put('/api/users/:userID', UserController.updateUser);
app.post('/api/testBatch', UserController.testBatch);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


