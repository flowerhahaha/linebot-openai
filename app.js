// set server
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

// set line bot  
const line = require('@line/bot-sdk')
const config = {
  channelAccessToken: process.env.channelAccessToken,
  channelSecret: process.env.channelSecret
}
const client = new line.Client(config)

// router for receive and reply message 
app.post('/webhook', line.middleware(config), async (req, res) => {
  try {
    console.log('req.body.events:', req.body.events)
    const result = await Promise.all(req.body.events.map(handleEvent))
    console.log('result:', result)
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500)
  }
})

function handleEvent(event) {
  console.log('event:', event);
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
  const replyMessage = {
    type: 'text',
    text: '你好'
  };
  // client.replyMessage 是非同步事件
  return client.replyMessage(event.replyToken, replyMessage);
}

app.get('/', (req, res) => {
  res.send('hello gpt')
})

app.listen((PORT), () => {
  console.log('App is running on http://localhost:3000')
})