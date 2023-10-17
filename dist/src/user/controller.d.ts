import { Request, Response } from "express";
declare class UserController {
    static createUser(req: Request, res: Response): Promise<void>;
    static testBatch(req: Request, res: Response): Promise<void>;
    static updateUser(req: Request, res: Response): Promise<void>;
}
export default UserController;
