// Set openai config 
const { Configuration, OpenAIApi } = require("openai")
const chineseConv = require('chinese-conv')
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  stream: true
})
const openai = new OpenAIApi(configuration)

let setting = ''
// Process user input using OpenAI's API
const chatGPT = async (userInput) => {
  console.log('userInput:', userInput)
  const match = userInput.match(/^Setting: (.+)/i)
  setting = match ? `${match[1]}以下是我的訊息：` : setting
  let prompt = match ? `${match[1]}` : `${setting}${userInput}。`

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.9,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0.5,
    })
    // Clean up the text and translate simplified Chinese to traditional
    const text = chineseConv.tify(completion.data.choices[0].text.trim().replace(/^[\n,.;:?!，。；：？！]+/, ''))
    return text
  } catch (err) {
    console.log('error.message = ',err.message)
  }
}

module.exports = {
  chatGPT
}
