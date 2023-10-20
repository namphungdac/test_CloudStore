import { Request, Response } from "express";
declare class UserController {
    static createUser(req: Request, res: Response): Promise<void>;
    static testBatch(req: Request, res: Response): Promise<void>;
    static updateUser(req: Request, res: Response): Promise<void>;
    static getAllUser(req: Request, res: Response): Promise<void>;
    static getUserByUserID(req: Request, res: Response): Promise<void>;
    static getAllUserByCity(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static holding(req: Request, res: Response): Promise<void>;
    static following(req: Request, res: Response): Promise<void>;
    static unfollow(req: Request, res: Response): Promise<void>;
}
export default UserController;
