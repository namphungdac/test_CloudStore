import {Request, Response} from "express";
import {FieldValue, Timestamp} from "firebase-admin/firestore";
import {db} from "../../index";
import {User} from "../types/user";

class UserController {
    static async createUser(req: Request, res: Response) {
        try {
            const {userName, address, born} = req.body;
            const user: User = {
                id: null,
                name: null,
                born: born,
                address: address,
                userName: userName,
                following: [],
                followers: [],
                createdAt: Timestamp.now(),
                updatedAt: null,
                totalTweets: 0,
                holderCount: 0,
                holdingCount: 0
            };
            // const docRef = await db.collection("users").doc().set(newUser);
            // const newUserRef = db.collection("users").doc();
            // const newUser = await newUserRef.set(user);
            // res.status(200).json({
            //     message: "Create user success!",
            //     data: newUser
            // });
            // const newUserRef = await db.collection("users").add(user);
            const userRef = db.collection("users").doc();
            console.log(userRef.id);
            await userRef.set({...user, id: userRef.id});
            res.status(200).json({
                message: "Create user success!",
            });
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

    static async testBatch(req: Request, res: Response) {
        try {
            const batch = db.batch();
            const user = {...req.body, createAt: Timestamp.fromDate(new Date())};
            const updatedUser = {
                userName: "trinh hoang nam",
                age: 31,
                weight: 70
            };
            const createUserRef = db.collection("users").doc();
            batch.set(createUserRef, user);
            const deleteUserRdf = db.collection("users").doc("pdnam");
            batch.delete(deleteUserRdf);
            const updateUserRef = db.collection("users").doc("tRBylsd2yWEGKhjvHATW");
            batch.update(updateUserRef, updatedUser);
            await batch.commit();

            res.status(200).json({
                message: "Batch success!",
                newUserID: createUserRef.id
            });
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

    static async updateUser(req: Request, res: Response) {
        try {
            const userID: string = req.params.userID;
            const user = {...req.body, updateAt: FieldValue.serverTimestamp()};
            const userRef = db.collection("users").doc(userID);
            // console.log(userRef.path);
            // console.log(userRef.id)
            // const updatedUser = await userRef.update(user);
            // To update some fields of a document without overwriting the entire document => use update() methods
            const updatedUser = await userRef.set(user, {
                merge: true
            });
            res.status(200).json({
                message: "Update user success!",
                data: updatedUser
            })
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

    static async getAllUser(req: Request, res: Response) {
        try {
            const data = [];
            const snapshot = await db.collection('users').orderBy("born").get();
            snapshot.forEach((doc) => {
                data.push({
                    userID: doc.id,
                    data: doc.data()
                });
            });
            // console.log(data);
            // console.log(data[0].data.userName);
            res.status(200).json({
                message: "Get all user success!",
                data: data
            });
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

    static async getUserByUserID(req: Request, res: Response) {
        try {
            const userID: string = req.params.userID;
            const userRef = db.collection("users").doc(userID);
            const user = await userRef.get();
            console.log(user.data().following);
            if (!user.exists) {
                res.status(200).json({
                    message: "User not exits!",
                });
            } else {
                res.status(200).json({
                    message: "Get user success!",
                    data: user.data()
                });
            }
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

    static async getAllUserByCity(req: Request, res: Response) {
        try {
            const city = req.body.address;
            const usersRef = db.collection("users");
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
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

    static async holding (req: Request, res: Response) {
        try {
            const userID: string = req.params.userID;
            const {holdingID, amount} = req.body;
            const userRef = db.collection("users").doc(userID);
            const holdingRef = db.collection("users").doc(holdingID);
            const userHoldingRef = userRef.collection("holding").doc(holdingID);
            const holdingHolderRef = holdingRef.collection("holder").doc(userID);
            // const newHolding = await userHoldingRef.set({
            //     amount: amount
            // });
            // const newHolder = await holdingHolderRef.set({
            //     amount: amount
            // });
            const userHoldingDoc = await userHoldingRef.get();
            if (userHoldingDoc.exists) {
                return res.status(200).json({
                    message: "Add new holding fail!",
                    Err: "HoldingID already exist"
                });
            }
            const batch = db.batch();
            batch.set(userHoldingRef, {amount: amount});
            batch.set(holdingHolderRef, {amount: amount});
            batch.update(userRef, {holdingCount: FieldValue.increment(1)});
            batch.update(holdingRef, {holderCount: FieldValue.increment(1)});
            await batch.commit();
            res.status(200).json({
                message: "Add new holding success!",
            });
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

    static async unHolding (req: Request, res: Response) {
        try {
            const userID: string = req.params.userID;
            const {unHoldingID, amount} = req.body;
            const userRef = db.collection("users").doc(userID);
            const unHoldingRef = db.collection("users").doc(unHoldingID);
            const userUnHoldingRef = userRef.collection("holding").doc(unHoldingID);
            const unHoldingHolderRef = unHoldingRef.collection("holder").doc(userID);
            const userUnHoldingDoc = await userUnHoldingRef.get();
            if (!userUnHoldingDoc.exists) {
                return res.status(200).json({
                    message: "UnHolding fail!",
                    Err: "HoldingID does not exist"
                });
            }
            const batch = db.batch();
            batch.delete(userUnHoldingRef);
            batch.delete(unHoldingHolderRef);
            batch.update(userRef, {holdingCount: FieldValue.increment(-1)});
            batch.update(unHoldingRef, {holderCount: FieldValue.increment(-1)});
            await batch.commit();
            res.status(200).json({
                message: "UnHolding success!",
            });
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

    static async following (req: Request, res: Response) {
        try {
            const userID: string = req.params.userID;
            const {followingID} = req.body;
            const userRef = db.collection("users").doc(userID);
            const followingRef = db.collection("users").doc(followingID);
            // const user = await userRef.get();
            // const following = await followingRef.get();
            // const currentFollowing: string[] = user.data().following;
            // const currentFollowers: string[] = following.data().followers;
            // await userRef.set({following: [...currentFollowing, followingID]}, {
            //     merge: true
            // });
            // await followingRef.set({followers: [...currentFollowers, userID]}, {
            //     merge: true
            // });

            //FieldValue.arrayUnion() => adds elements to an array but only elements not already present
            // await userRef.update({
            //     following: FieldValue.arrayUnion(followingID)
            // });
            // await followingRef.update({
            //     followers: FieldValue.arrayUnion(userID)
            // });

            const batch = db.batch();
            batch.update(userRef, {following: FieldValue.arrayUnion(followingID)});
            batch.update(followingRef, {  followers: FieldValue.arrayUnion(userID)});
            await batch.commit();
            res.status(200).json({
                message: "Following success!",
            });
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

    static async unfollow(req: Request, res: Response) {
        try {
            const userID: string = req.params.userID;
            const {unfollowID} = req.body;
            const userRef = db.collection("users").doc(userID);
            const unfollowRef = db.collection("users").doc(unfollowID);
            //FieldValue.arrayRemove() => removes all instances of each given element
            // await userRef.update({
            //     following: FieldValue.arrayRemove(unfollowID)
            // });
            // await unfollowRef.update({
            //     followers: FieldValue.arrayRemove(userID)
            // });
            
            const batch = db.batch();
            batch.update(userRef, {following: FieldValue.arrayRemove(unfollowID)});
            batch.update(unfollowRef, {  followers: FieldValue.arrayRemove(userID)});
            await batch.commit();
            res.status(200).json({
                message: "Unfollowed success!",
            });
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

}

export default UserController;