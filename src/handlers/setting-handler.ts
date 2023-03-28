import { Setting } from "../models/setting";
import { messages } from "./chat-gpt-handler";
import { TextMessage } from '@line/bot-sdk';

const set = (userId: string, settingDescription: {}): TextMessage => {
  messages[userId] = [{role: "system", content:`${settingDescription}`}]
  return { type: 'text', text: `已設定角色：${settingDescription}` }
}

const save = async (userId: string,  settingName: {}): Promise<TextMessage> => {
  await Setting.findOneAndUpdate(
    { userId, key: settingName }, // filter
    { messages: messages[userId] }, // update
    { upsert: true } // create one if not exist
  )
  return { type: 'text', text: `已儲存您的設定：${settingName}` }
}

const read = async (userId: string, settingName: {}): Promise<TextMessage> => {
  const setting = await Setting.findOne({ userId, key: settingName }).lean()
  if (setting) {
    messages[userId] = setting.messages.map(msg => ({role: msg.role, content: msg.content}))
    return { type: 'text', text: `已切換至設定檔：${settingName}` }
  } else {
    return { type: 'text', text: `查無設定檔：${settingName}` }
  }
}

const del = async (userId: string, settingName: {}): Promise<TextMessage> => {
  const result = await Setting.deleteOne({ userId, key: settingName })
  if (result.deletedCount === 1) {
    return { type: 'text', text: `已刪除設定檔：${settingName}` }
  } else {
    return { type: 'text', text: `查無設定檔：${settingName}` }
  }
}

// Handles an incoming LINE Messaging API event for set/save/read/delete user's setting
const settingHandler = async (userId: string, match: {}[]): Promise<TextMessage> => {
  if (!messages[userId]) {
    messages[userId] = []
  }
  try {
    switch(match[1]) {
      case 'set':
        return set(userId, match[2])
      case 'save':
        return await save(userId, match[2])
      case 'read':
        return await read(userId, match[2])
      case 'delete':
        return await del(userId, match[2])
      default:
        return { type: 'text', text: `不支援的設定指令：${match[1]}` }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log('error.message = ', error)
      return { type: 'text', text: `${error.message}` }
    }
    return { type: 'text', text: '發生錯誤，請稍後再試' }
  }
}

export { settingHandler }
