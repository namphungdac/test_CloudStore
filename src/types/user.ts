import {Timestamp} from "firebase-admin/firestore";
export type User = {
    id: string;
    name: string;
    born: number;
    address: string;
    userName: string;
    following: string[];
    followers: string[];
    createdAt: Timestamp;
    updatedAt: Timestamp | null;
    totalTweets: number;
    holderCount: number;
    holdingCount: number
};
