// Set line bot config 
const line = require('@line/bot-sdk')
const config = {
  channelAccessToken: process.env.channelAccessToken,
  channelSecret: process.env.channelSecret
}
const client = new line.Client(config)
const openai = require('./openai')

const middleware = line.middleware(config)

// Handles an incoming LINE Messaging API event
const handleEvent = async (event) =>{
  console.log('event:', event)
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null)
  } 
  const message = {
    type: 'text',
    text: await openai.chatGPT(event.message.text)
  }
  // Sends the generated message back to the user through the LINE Messaging API (asynchronous event)
  return client.replyMessage(event.replyToken, message)
}

module.exports = {
  middleware,
  handleEvent
}
