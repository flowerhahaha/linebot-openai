"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flexMessage = void 0;
exports.flexMessage = {
    type: 'flex',
    altText: '選單',
    contents: {
        type: 'bubble',
        direction: 'ltr',
        body: {
            type: 'box',
            layout: 'vertical',
            contents: [
                {
                    type: 'text',
                    text: '請選擇以下指令：',
                    wrap: true,
                    size: 'lg',
                },
                {
                    type: 'button',
                    action: {
                        type: 'postback',
                        label: '重置設定',
                        data: 'action=set_role',
                    },
                    margin: 'md',
                    style: 'primary',
                    color: "#6FB7B7",
                },
                {
                    type: 'button',
                    action: {
                        type: 'postback',
                        label: '儲存設定',
                        data: 'action=save_role',
                    },
                    margin: 'md',
                    style: 'primary',
                    color: "#6FB7B7",
                },
                {
                    type: 'button',
                    action: {
                        type: 'postback',
                        label: '讀取設定',
                        data: 'action=read_role',
                    },
                    margin: 'md',
                    style: 'primary',
                    color: "#6FB7B7",
                },
                {
                    type: 'button',
                    action: {
                        type: 'postback',
                        label: '刪除設定',
                        data: 'action=delete_role',
                    },
                    margin: 'md',
                    style: 'primary',
                    color: "#6FB7B7",
                },
            ],
        },
    },
};
