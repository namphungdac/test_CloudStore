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
app.get('/api/users', UserController.getAllUser);
app.get('/api/users/:userID', UserController.getUserByUserID);
app.get('/api/city', UserController.getAllUserByCity);

app.post('/api/users/:userID/holding', UserController.holding);
app.post('/api/users/:userID/unHolding', UserController.unHolding);
app.post('/api/users/:userID/following', UserController.following);
app.post('/api/users/:userID/unfollow', UserController.unfollow);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


