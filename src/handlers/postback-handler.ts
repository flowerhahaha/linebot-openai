import { TextMessage } from '@line/bot-sdk'
import { Setting } from "../models/setting"

const setRole: TextMessage = {
  type: 'text',
  text: '請輸入 “/set: 您的設定” 來設定 AI 功能與角色。例如：\n/set: 你現在是專業的中翻英翻譯人員，請自動將我輸入的中文翻譯成英文。'
}

const saveRole: TextMessage = {
  type: 'text',
  text: '請輸入 “/save: 設定檔名稱” 來儲存設定。例如：\n/save: ChToEn'
}

const readRole = async (userId: string): Promise<TextMessage> => {
  const settings = await Setting.find({ userId }).lean()
  const settingsName = settings.map(setting => setting.key).join(', ')
  return {
    type: 'text', 
    text: `請輸入 “/read: 設定檔名稱” 來讀取設定。例如：\n/read: ChToEn\n以下是您目前儲存的設定檔：${settingsName}`
  }
}

const deleteRole = async (userId: string): Promise<TextMessage> => {
  const settings = await Setting.find({ userId }).lean()
  const settingsName = settings.map(setting => setting.key).join(', ')
  return {
    type: 'text', 
    text: `請輸入 “/delete: 設定檔名稱” 來刪除設定。例如：\n/delete: ChToEn\n以下是您目前儲存的設定檔：${settingsName}`
  }
}

const postbackHandler = async (userId: string, postbackData: string): Promise<TextMessage> => {
  try {
    switch (postbackData) {
      case 'action=set_role':
        return setRole
      case 'action=save_role':
        return saveRole
      case 'action=read_role':
        return await readRole(userId)
      case 'action=delete_role':
        return await deleteRole(userId)
      default:
        return { type: 'text', text: '查無選項' }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log('error.message = ', error)
      return { type: 'text', text: `${error.message}` }
    }
    return { type: 'text', text: '發生錯誤，請稍後再試' }
  }
}

export { postbackHandler }