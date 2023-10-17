import {Request, Response} from "express";
import {FieldValue, Timestamp} from "firebase-admin/firestore";
import {db} from "../../index";

class UserController {
    static async createUser(req: Request, res: Response) {
        try {
            const {userName, address, born} = req.body;
            const user = {
                userName: userName,
                address: address,
                born: born,
                createAt: Timestamp.fromDate(new Date())
            }
            // const docRef = await db.collection("users").doc().set(newUser);
            // const newUserRef = db.collection("users").doc();
            // const newUser = await newUserRef.set(user);
            // res.status(200).json({
            //     message: "Create user success!",
            //     data: newUser
            // });
            const newUserRef = await db.collection("users").add(user);
            res.status(200).json({
                message: "Create user success!",
                data: newUserRef
            })
            console.log("Document written with ID: ", newUserRef.id);
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
                    "userID": doc.id,
                    "data": doc.data()
                });
            });
            console.log(data[0].data.userName);
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
            console.log(user.data());
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



}

export default UserController;