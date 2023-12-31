"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs = __importStar(require("fs"));
const process = __importStar(require("process"));
const controller_1 = __importDefault(require("./src/user/controller"));
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
const jsonString = fs.readFileSync('key.json', 'utf8');
const credentials = JSON.parse(jsonString);
(0, app_1.initializeApp)({
    credential: (0, app_1.cert)(credentials)
});
exports.db = (0, firestore_1.getFirestore)();
app.post('/api/users', controller_1.default.createUser);
app.put('/api/users/:userID', controller_1.default.updateUser);
app.post('/api/testBatch', controller_1.default.testBatch);
app.get('/api/users', controller_1.default.getAllUser);
app.get('/api/users/:userID', controller_1.default.getUserByUserID);
app.get('/api/city', controller_1.default.getAllUserByCity);
app.post('/api/users/:userID/holding', controller_1.default.holding);
app.post('/api/users/:userID/unHolding', controller_1.default.unHolding);
app.post('/api/users/:userID/following', controller_1.default.following);
app.post('/api/users/:userID/unfollow', controller_1.default.unfollow);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map