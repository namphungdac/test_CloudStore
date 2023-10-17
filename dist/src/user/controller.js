"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = require("firebase-admin/firestore");
const index_1 = require("../../index");
class UserController {
    static async createUser(req, res) {
        try {
            const { userName, address, born } = req.body;
            const user = {
                userName: userName,
                address: address,
                born: born,
                createAt: firestore_1.Timestamp.fromDate(new Date())
            };
            const newUserRef = await index_1.db.collection("users").add(user);
            res.status(200).json({
                message: "Create user success!",
                data: newUserRef
            });
            console.log("Document written with ID: ", newUserRef.id);
        }
        catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }
    static async testBatch(req, res) {
        try {
            const batch = index_1.db.batch();
            const user = Object.assign(Object.assign({}, req.body), { createAt: firestore_1.Timestamp.fromDate(new Date()) });
            const updatedUser = {
                userName: "trinh hoang nam",
                age: 31,
                weight: 70
            };
            const createUserRef = index_1.db.collection("users").doc();
            batch.set(createUserRef, user);
            const deleteUserRdf = index_1.db.collection("users").doc("pdnam");
            batch.delete(deleteUserRdf);
            const updateUserRef = index_1.db.collection("users").doc("tRBylsd2yWEGKhjvHATW");
            batch.update(updateUserRef, updatedUser);
            await batch.commit();
            res.status(200).json({
                message: "Batch success!",
                newUserID: createUserRef.id
            });
        }
        catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }
    static async updateUser(req, res) {
        try {
            const userID = req.params.userID;
            const user = Object.assign(Object.assign({}, req.body), { updateAt: firestore_1.FieldValue.serverTimestamp() });
            const userRef = index_1.db.collection("users").doc(userID);
            const updatedUser = await userRef.set(user, {
                merge: true
            });
            res.status(200).json({
                message: "Update user success!",
                data: updatedUser
            });
        }
        catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }
    static async getAllUser(req, res) {
        try {
            const data = [];
            const snapshot = await index_1.db.collection('users').orderBy("born").get();
            snapshot.forEach((doc) => {
                data.push({
                    "userID": doc.id,
                    "data": doc.data()
                });
            });
            console.log(data[0].data.userName);
            res.status(200).json({
                message: "Get all user success!",
                data: data
            });
        }
        catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }
    static async getUserByUserID(req, res) {
        try {
            const userID = req.params.userID;
            const userRef = index_1.db.collection("users").doc(userID);
            const user = await userRef.get();
            console.log(user.data());
            if (!user.exists) {
                res.status(200).json({
                    message: "User not exits!",
                });
            }
            else {
                res.status(200).json({
                    message: "Get user success!",
                    data: user.data()
                });
            }
        }
        catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }
    static async getAllUserByCity(req, res) {
        try {
            const city = req.body.address;
            const usersRef = index_1.db.collection("users");
            const snapshot = await usersRef
                .where("address", "==", city)
                .orderBy("born")
                .limit(2)
                .get();
            if (snapshot.empty) {
                return res.status(200).json({
                    message: "City not exits!",
                });
            }
            const data = [];
            snapshot.forEach(doc => {
                data.push({
                    "userID": doc.id,
                    "data": doc.data()
                });
            });
            console.log(data);
            res.status(200).json({
                message: "Get users of city success!",
                data: data
            });
        }
        catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }
}
exports.default = UserController;
//# sourceMappingURL=controller.js.map