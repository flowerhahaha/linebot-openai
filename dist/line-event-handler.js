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
const line_messages_1 = require("./line-messages");
const config = {
    channelAccessToken: process.env.channelAccessToken || '',
    channelSecret: process.env.channelSecret || '',
};
const client = new bot_sdk_1.Client(config);
// Handles an incoming LINE Messaging API event
const handleEvent = (event) => __awaiter(void 0, void 0, void 0, function* () {
    if (event.type === 'postback') {
        const postbackData = event.postback.data;
        if (postbackData === 'action=set_role') {
            return client.replyMessage(event.replyToken, line_messages_1.postbackMessage.SetRole);
        }
        else if (postbackData === 'action=save_role') {
            return client.replyMessage(event.replyToken, line_messages_1.postbackMessage.SaveRole);
        }
        else if (postbackData === 'action=read_role') {
            return client.replyMessage(event.replyToken, line_messages_1.postbackMessage.ReadRole());
        }
        else if (postbackData === 'action=delete_role') {
            return client.replyMessage(event.replyToken, line_messages_1.postbackMessage.DeleteRole());
        }
    }
    if (event.message.text.toLowerCase() === '/command') {
        return client.replyMessage(event.replyToken, line_messages_1.flexMessage);
    }
    if (event.type === 'message' && event.message.type === 'text') {
        const openaiMessage = {
            type: 'text',
            text: yield (0, chat_gpt_handler_1.chatGPT)(event.message.text)
        };
        // Sends the generated message back to the user through the LINE Messaging API (asynchronous event)
        return client.replyMessage(event.replyToken, openaiMessage);
    }
    return Promise.resolve(null);
});
exports.handleEvent = handleEvent;
