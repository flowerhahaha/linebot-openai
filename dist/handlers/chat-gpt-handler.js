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
exports.messages = exports.chatGPTHandler = void 0;
// Set openai config
const openai_1 = require("openai");
const chineseConv = require('chinese-conv');
const configuration = new openai_1.Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new openai_1.OpenAIApi(configuration);
const MAX_PROMPT_LENGTH = 3500;
const MAX_MESSAGES_LENGTH = 20;
let messages = {};
exports.messages = messages;
const chatGPTHandler = (userId, userInput) => __awaiter(void 0, void 0, void 0, function* () {
    if (!messages[userId]) {
        messages[userId] = [];
    }
    const userMessages = messages[userId];
    try {
        userMessages.push({ role: "user", content: `${userInput.slice(0, 500)}` });
        // delete the earliest message after setting to save costs
        if (userMessages.length > MAX_MESSAGES_LENGTH) {
            userMessages.splice(1, 2);
        }
        const request = {
            model: "gpt-3.5-turbo",
            messages: userMessages,
            max_tokens: 500
        };
        const completion = yield openai.createChatCompletion(request);
        // Clean up the text and translate simplified Chinese to traditional
        const text = chineseConv.tify(completion.data.choices[0].message.content.trim().replace(/^[\n,.;:?!，。；：？！]+/, ''));
        // delete the earliest message after setting to prevent the prompt from exceeding 4096 tokens limit
        if (completion.data.usage.total_tokens > MAX_PROMPT_LENGTH) {
            userMessages.splice(1, 2);
        }
        // Save response records for continuous conversation
        userMessages.push({ role: "assistant", content: `${text}` });
        return { type: 'text', text: text };
    }
    catch (error) {
        if (error instanceof Error) {
            console.log('error.message = ', error);
            return { type: 'text', text: `${error.message}` };
        }
        return { type: 'text', text: '發生錯誤，請稍後再試' };
    }
});
exports.chatGPTHandler = chatGPTHandler;
