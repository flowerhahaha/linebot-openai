"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MONGODB_URI = process.env.MONGODB_URI || '';
mongoose_1.default.connect(MONGODB_URI);
const db = mongoose_1.default.connection;
exports.db = db;
db.on('error', () => console.log('mongoDB error!'));
db.once('open', () => console.log('mongoDB connected!'));
