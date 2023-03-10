// Set line bot config 
const line = require('@line/bot-sdk')
const config = {
  channelAccessToken: process.env.channelAccessToken,
  channelSecret: process.env.channelSecret
}
const client = new line.Client(config)
const openai = require('./openai')
const lineMessageConfig = require('./line-message-config')

const middleware = line.middleware(config)

// Handles an incoming LINE Messaging API event
const handleEvent = async (event) =>{
  if (event.type === 'postback') {
    const postbackData = event.postback.data;
    if (postbackData === 'action=set_role') {
      return client.replyMessage(event.replyToken, lineMessageConfig.postbackMessage.SetRole)
    } else if (postbackData === 'action=save_role') {
      return client.replyMessage(event.replyToken, lineMessageConfig.postbackMessage.SaveRole)
    } else if (postbackData === 'action=read_role') {
      return client.replyMessage(event.replyToken, lineMessageConfig.postbackMessage.ReadRole())
    } else if (postbackData === 'action=delete_role') {
      return client.replyMessage(event.replyToken, lineMessageConfig.postbackMessage.DeleteRole())
    }
  }

  if (event.message.text.toLowerCase() === '/command') {
    return client.replyMessage(event.replyToken, lineMessageConfig.flexMessage)
  }

  if (event.type === 'message' && event.message.type === 'text') {
    const openaiMessage = {
      type: 'text',
      text: await openai.chatGPT(event.message.text)
    }
    // Sends the generated message back to the user through the LINE Messaging API (asynchronous event)
    return client.replyMessage(event.replyToken, openaiMessage)
  } 

  return Promise.resolve(null)
}

module.exports = {
  middleware,
  handleEvent
}
