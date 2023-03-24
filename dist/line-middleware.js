"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lineMiddleware = void 0;
const bot_sdk_1 = require("@line/bot-sdk");
const config = {
    channelAccessToken: process.env.channelAccessToken || '',
    channelSecret: process.env.channelSecret || '',
};
exports.lineMiddleware = (0, bot_sdk_1.middleware)(config);
