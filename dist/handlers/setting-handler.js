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
exports.settingHandler = void 0;
const setting_1 = require("../models/setting");
const chat_gpt_handler_1 = require("./chat-gpt-handler");
const set = (userId, settingDescription) => {
    chat_gpt_handler_1.messages[userId] = [{ role: "system", content: `${settingDescription}` }];
    return { type: 'text', text: `已設定角色：${settingDescription}` };
};
const save = (userId, settingName) => __awaiter(void 0, void 0, void 0, function* () {
    yield setting_1.Setting.findOneAndUpdate({ userId, key: settingName }, // filter
    { messages: chat_gpt_handler_1.messages[userId] }, // update
    { upsert: true } // create one if not exist
    );
    return { type: 'text', text: `已儲存您的設定：${settingName}` };
});
const read = (userId, settingName) => __awaiter(void 0, void 0, void 0, function* () {
    const setting = yield setting_1.Setting.findOne({ userId, key: settingName }).lean();
    if (setting) {
        chat_gpt_handler_1.messages[userId] = setting.messages.map(msg => ({ role: msg.role, content: msg.content }));
        return { type: 'text', text: `已切換至設定檔：${settingName}` };
    }
    else {
        return { type: 'text', text: `查無設定檔：${settingName}` };
    }
});
const del = (userId, settingName) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield setting_1.Setting.deleteOne({ userId, key: settingName });
    if (result.deletedCount === 1) {
        return { type: 'text', text: `已刪除設定檔：${settingName}` };
    }
    else {
        return { type: 'text', text: `查無設定檔：${settingName}` };
    }
});
// Handles an incoming LINE Messaging API event for set/save/read/delete user's setting
const settingHandler = (userId, match) => __awaiter(void 0, void 0, void 0, function* () {
    if (!chat_gpt_handler_1.messages[userId]) {
        chat_gpt_handler_1.messages[userId] = [];
    }
    try {
        switch (match[1]) {
            case 'set':
                return set(userId, match[2]);
            case 'save':
                return yield save(userId, match[2]);
            case 'read':
                return yield read(userId, match[2]);
            case 'delete':
                return yield del(userId, match[2]);
            default:
                return { type: 'text', text: `不支援的設定指令：${match[1]}` };
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.log('error.message = ', error);
            return { type: 'text', text: `${error.message}` };
        }
        return { type: 'text', text: '發生錯誤，請稍後再試' };
    }
});
exports.settingHandler = settingHandler;
