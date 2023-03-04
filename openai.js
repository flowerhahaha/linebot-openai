// Set openai config 
const { Configuration, OpenAIApi } = require("openai")
const chineseConv = require('chinese-conv')
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

const MAX_MESSAGES_LENGTH = 10
let messages = []
const chatGPT = async (userInput) => {
  // Check if the user needs to reset AI
  const match = userInput.match(/^Setting: (.+)/i)
  if (match) {
    messages = [{role: "user", content:`${match[1]}`}]
  } else {
    messages.push({role: "user", content:`${userInput}`})
  }
  // If the length of the conversation exceeds 10 messages, delete the earliest message after the setting.
  if (messages.length > MAX_MESSAGES_LENGTH) {
    messages.splice(1, 1)
  }

  console.log('messages:', messages)
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    })
    // Clean up the text and translate simplified Chinese to traditional
    const text = chineseConv.tify(completion.data.choices[0].message.content.trim().replace(/^[\n,.;:?!，。；：？！]+/, ''))
    // Save response records for continuous conversation
    messages.push({role: "system", content:`${text}`})
    return text
  } catch (err) {
    console.log('error.message = ',err.message)
  }
}

module.exports = {
  chatGPT
}
