"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
class UserController {
    static async createUser(req, res) {
        try {
            console.log(req.body);
            const { userName, address, born, createAt } = req.body;
            const newUser = {
                userName: userName,
                address: address,
                born: born,
                createAt: createAt
            };
            const docRef = await index_1.db.collection("users").add(newUser);
            console.log("Document written with ID: ", docRef.id);
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