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
exports.postbackHandler = void 0;
const setting_1 = require("../models/setting");
const setRole = {
    type: 'text',
    text: '請輸入 “/set: 您的設定” 來設定 AI 功能與角色。例如：\n/set: 你現在是專業的中翻英翻譯人員，請自動將我輸入的中文翻譯成英文。'
};
const saveRole = {
    type: 'text',
    text: '請輸入 “/save: 設定檔名稱” 來儲存設定。例如：\n/save: ChToEn'
};
const readRole = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const settings = yield setting_1.Setting.find({ userId }).lean();
    const settingsName = settings.map(setting => setting.key).join(', ');
    return {
        type: 'text',
        text: `請輸入 “/read: 設定檔名稱” 來讀取設定。例如：\n/read: ChToEn\n以下是您目前儲存的設定檔：${settingsName}`
    };
});
const deleteRole = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const settings = yield setting_1.Setting.find({ userId }).lean();
    const settingsName = settings.map(setting => setting.key).join(', ');
    return {
        type: 'text',
        text: `請輸入 “/delete: 設定檔名稱” 來刪除設定。例如：\n/delete: ChToEn\n以下是您目前儲存的設定檔：${settingsName}`
    };
});
const postbackHandler = (userId, postbackData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        switch (postbackData) {
            case 'action=set_role':
                return setRole;
            case 'action=save_role':
                return saveRole;
            case 'action=read_role':
                return yield readRole(userId);
            case 'action=delete_role':
                return yield deleteRole(userId);
            default:
                return { type: 'text', text: '查無選項' };
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
exports.postbackHandler = postbackHandler;
