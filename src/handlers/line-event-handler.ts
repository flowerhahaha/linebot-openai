import { Client, ClientConfig, MessageAPIResponseBase } from '@line/bot-sdk'
import { chatGPTHandler } from './chat-gpt-handler'
import { flexMessage } from './flex-messages-handler'
import { settingHandler } from './setting-handler'
import { postbackHandler } from './postback-handler'

const config: ClientConfig = {
  channelAccessToken: process.env.channelAccessToken || '',
  channelSecret: process.env.channelSecret || '',
}
const client = new Client(config)

// Handles an incoming LINE Messaging API event
export const handleEvent = async (event: any): Promise<MessageAPIResponseBase | null> =>{
  const userId = event.source.userId

  if (event.type === 'postback') {
    return client.replyMessage(event.replyToken, await postbackHandler(userId, event.postback.data))
  }
  
  if (event.type === 'message' && event.message.type === 'text') {
    const userInput = event.message.text

    if (userInput.toLowerCase() === '/command') {
      return client.replyMessage(event.replyToken, flexMessage)
    }

    const match = userInput.toLowerCase().match(/^\/(set|save|read|delete): (.+)/)
    if (match) {
      return client.replyMessage(event.replyToken, await settingHandler(userId, match))
    }

    return client.replyMessage(event.replyToken, await chatGPTHandler(userId, userInput))
  } 

  return Promise.resolve(null)
}

