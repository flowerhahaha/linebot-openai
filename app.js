// Set server
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const chineseConv = require('chinese-conv')

// Set line bot config 
const line = require('@line/bot-sdk')
const config = {
  channelAccessToken: process.env.channelAccessToken,
  channelSecret: process.env.channelSecret
}
const client = new line.Client(config)

// Set openAI config
const { Configuration, OpenAIApi } = require("openai")
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  stream: true
})
const openai = new OpenAIApi(configuration)

// Router for receive and reply message 
app.post('/webhook', line.middleware(config), async (req, res) => {
  try {
    // Handles each incoming event and waits for all events to be processed
    const result = await Promise.all(req.body.events.map(handleEvent))
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500)
  }
})

// Handles an incoming LINE Messaging API event
const handleEvent = async (event) =>{
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null)
  } 
  const message = {
    type: 'text',
    text: await chatGPT(event.message.text)
  }
  // Sends the generated message back to the user through the LINE Messaging API (asynchronous event)
  return client.replyMessage(event.replyToken, message)
}

// Process user input using OpenAI's GPT
let setting = ''
const chatGPT = async (userInput) => {
  // Allow user to set openai
  const match = userInput.match(/^Setting: (.+)/i)
  setting = match ? `${match[1]}以下是我的訊息：` : setting
  let prompt = match ? `${match[1]}` : `${setting}${userInput}。`

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.9,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
    // Clean up the text and translate simplified Chinese to traditional
    const text = chineseConv.tify(completion.data.choices[0].text.trim().replace(/^[\n,.;:?!，。；：？！]+/, ''))
    return text
  } catch (err) {
    console.log('error.message = ',err.message)
  }
}

app.listen((PORT), () => {
  console.log('App is running on http://localhost:3000')
})