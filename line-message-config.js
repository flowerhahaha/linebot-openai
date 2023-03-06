const { getSettings } = require('./openai')

const flexMessage = {
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
}

const postbackMessage = {
  SetRole: {
    type: 'text', 
    text: '請輸入 “/Setting: 您的設定” 來設定 AI 功能與角色。例如：\n/Setting: 你現在是專業的中翻英翻譯人員，請自動將我輸入的中文翻譯成英文。'
  },
  SaveRole: {
    type: 'text', 
    text: '請輸入 “/Save: 設定檔名稱” 來儲存設定。例如：\n/Save: ChToEn'
  },
  ReadRole: () => {
    const settings = getSettings()
    const settingsName = Object.keys(settings).join(', ')
    return {
      type: 'text', 
      text: `請輸入 “/Read: 設定檔名稱” 來讀取設定。例如：\n/Read: ChToEn\n以下是您目前儲存的設定檔：${JSON.stringify(settingsName)}`
    }
  },
  DeleteRole: () => {
    const settings = getSettings()
    const settingsName = Object.keys(settings).join(', ')
    return {
      type: 'text', 
      text: `請輸入 “/Delete: 設定檔名稱” 來刪除設定。例如：\n/Delete: ChToEn\n以下是您目前儲存的設定檔：${JSON.stringify(settingsName)}`
    }
  },
}

module.exports = {
  flexMessage,
  postbackMessage
}