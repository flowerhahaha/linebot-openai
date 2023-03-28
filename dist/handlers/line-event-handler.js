"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleEvent = void 0;
const bot_sdk_1 = require("@line/bot-sdk");
const chat_gpt_handler_1 = require("./chat-gpt-handler");
const flex_messages_handler_1 = require("./flex-messages-handler");
const setting_handler_1 = require("./setting-handler");
const postback_handler_1 = require("./postback-handler");
const config = {
    channelAccessToken: process.env.channelAccessToken || '',
    channelSecret: process.env.channelSecret || '',
};
const client = new bot_sdk_1.Client(config);
// Handles an incoming LINE Messaging API event
const handleEvent = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = event.source.userId;
    if (event.type === 'postback') {
        return client.replyMessage(event.replyToken, yield (0, postback_handler_1.postbackHandler)(userId, event.postback.data));
    }
    if (event.type === 'message' && event.message.type === 'text') {
        const userInput = event.message.text;
        if (userInput.toLowerCase() === '/command') {
            return client.replyMessage(event.replyToken, flex_messages_handler_1.flexMessage);
        }
        const match = userInput.toLowerCase().match(/^\/(set|save|read|delete): (.+)/);
        if (match) {
            return client.replyMessage(event.replyToken, yield (0, setting_handler_1.settingHandler)(userId, match));
        }
        return client.replyMessage(event.replyToken, yield (0, chat_gpt_handler_1.chatGPTHandler)(userId, userInput));
    }
    return Promise.resolve(null);
});
exports.handleEvent = handleEvent;
