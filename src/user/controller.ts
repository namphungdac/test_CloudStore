import {Request, Response} from "express";
import {db} from "../../index";

class UserController {
    static async createUser(req: Request, res: Response) {
        try {
            console.log(req.body)
            const {userName, address, born, createAt} = req.body;
            const newUser = {
                userName: userName,
                address: address,
                born: born,
                createAt: createAt
            }
            // const docRef = await db.collection("users").doc().set(newUser);
            const docRef = await db.collection("users").add(newUser);
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

}

export default UserController;