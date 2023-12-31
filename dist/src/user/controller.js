"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = require("firebase-admin/firestore");
const index_1 = require("../../index");
class UserController {
    static async createUser(req, res) {
        try {
            const { userName, address, born } = req.body;
            const user = {
                id: null,
                name: null,
                born: born,
                address: address,
                userName: userName,
                following: [],
                followers: [],
                createdAt: firestore_1.Timestamp.now(),
                updatedAt: null,
                totalTweets: 0,
                holderCount: 0,
                holdingCount: 0
            };
            const userRef = index_1.db.collection("users").doc();
            console.log(userRef.id);
            await userRef.set(Object.assign(Object.assign({}, user), { id: userRef.id }));
            res.status(200).json({
                message: "Create user success!",
            });
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
                    userID: doc.id,
                    data: doc.data()
                });
            });
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
            console.log(user.data().following);
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
    static async holding(req, res) {
        try {
            const userID = req.params.userID;
            const { holdingID, amount } = req.body;
            const userRef = index_1.db.collection("users").doc(userID);
            const holdingRef = index_1.db.collection("users").doc(holdingID);
            const userHoldingRef = userRef.collection("holding").doc(holdingID);
            const holdingHolderRef = holdingRef.collection("holder").doc(userID);
            const userHoldingDoc = await userHoldingRef.get();
            if (userHoldingDoc.exists) {
                return res.status(200).json({
                    message: "Add new holding fail!",
                    Err: "HoldingID already exist"
                });
            }
            const batch = index_1.db.batch();
            batch.set(userHoldingRef, { amount: amount });
            batch.set(holdingHolderRef, { amount: amount });
            batch.update(userRef, { holdingCount: firestore_1.FieldValue.increment(1) });
            batch.update(holdingRef, { holderCount: firestore_1.FieldValue.increment(1) });
            await batch.commit();
            res.status(200).json({
                message: "Add new holding success!",
            });
        }
        catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }
    static async unHolding(req, res) {
        try {
            const userID = req.params.userID;
            const { unHoldingID, amount } = req.body;
            const userRef = index_1.db.collection("users").doc(userID);
            const unHoldingRef = index_1.db.collection("users").doc(unHoldingID);
            const userUnHoldingRef = userRef.collection("holding").doc(unHoldingID);
            const unHoldingHolderRef = unHoldingRef.collection("holder").doc(userID);
            const userUnHoldingDoc = await userUnHoldingRef.get();
            if (!userUnHoldingDoc.exists) {
                return res.status(200).json({
                    message: "UnHolding fail!",
                    Err: "HoldingID does not exist"
                });
            }
            const batch = index_1.db.batch();
            batch.delete(userUnHoldingRef);
            batch.delete(unHoldingHolderRef);
            batch.update(userRef, { holdingCount: firestore_1.FieldValue.increment(-1) });
            batch.update(unHoldingRef, { holderCount: firestore_1.FieldValue.increment(-1) });
            await batch.commit();
            res.status(200).json({
                message: "UnHolding success!",
            });
        }
        catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }
    static async following(req, res) {
        try {
            const userID = req.params.userID;
            const { followingID } = req.body;
            const userRef = index_1.db.collection("users").doc(userID);
            const followingRef = index_1.db.collection("users").doc(followingID);
            const batch = index_1.db.batch();
            batch.update(userRef, { following: firestore_1.FieldValue.arrayUnion(followingID) });
            batch.update(followingRef, { followers: firestore_1.FieldValue.arrayUnion(userID) });
            await batch.commit();
            res.status(200).json({
                message: "Following success!",
            });
        }
        catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }
    static async unfollow(req, res) {
        try {
            const userID = req.params.userID;
            const { unfollowID } = req.body;
            const userRef = index_1.db.collection("users").doc(userID);
            const unfollowRef = index_1.db.collection("users").doc(unfollowID);
            const batch = index_1.db.batch();
            batch.update(userRef, { following: firestore_1.FieldValue.arrayRemove(unfollowID) });
            batch.update(unfollowRef, { followers: firestore_1.FieldValue.arrayRemove(userID) });
            await batch.commit();
            res.status(200).json({
                message: "Unfollowed success!",
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