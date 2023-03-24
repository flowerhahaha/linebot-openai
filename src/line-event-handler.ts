import { Client, ClientConfig, MessageAPIResponseBase, TextMessage } from '@line/bot-sdk'
import { chatGPT } from './chat-gpt-handler'
import { flexMessage, postbackMessage } from './line-messages'

const config: ClientConfig = {
  channelAccessToken: process.env.channelAccessToken || '',
  channelSecret: process.env.channelSecret || '',
}
const client = new Client(config)

// Handles an incoming LINE Messaging API event
export const handleEvent = async (event: any): Promise<MessageAPIResponseBase | null> =>{
  if (event.type === 'postback') {
    const postbackData = event.postback.data
    if (postbackData === 'action=set_role') {
      return client.replyMessage(event.replyToken, postbackMessage.SetRole)
    } else if (postbackData === 'action=save_role') {
      return client.replyMessage(event.replyToken, postbackMessage.SaveRole)
    } else if (postbackData === 'action=read_role') {
      return client.replyMessage(event.replyToken, postbackMessage.ReadRole())
    } else if (postbackData === 'action=delete_role') {
      return client.replyMessage(event.replyToken, postbackMessage.DeleteRole())
    }
  }

  if (event.message.text.toLowerCase() === '/command') {
    return client.replyMessage(event.replyToken, flexMessage)
  }

  if (event.type === 'message' && event.message.type === 'text') {
    const openaiMessage: TextMessage = {
      type: 'text',
      text: await chatGPT(event.message.text)
    }
    // Sends the generated message back to the user through the LINE Messaging API (asynchronous event)
    return client.replyMessage(event.replyToken, openaiMessage)
  } 

  return Promise.resolve(null)
}

