// Set openai config 
const { Configuration, OpenAIApi } = require("openai")
const chineseConv = require('chinese-conv')
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

const MAX_PROMPT_LENGTH = 3600
const settings = {}
let messages = []

const chatGPT = async (userInput) => {
  const match = userInput.toLowerCase().match(/^\/(set|save|read|delete): (.+)/)
  if (!match) {
    messages.push({role: "user", content:`${userInput}`})
  } else if (match[1] === 'set') {
    messages = [{role: "user", content:`${match[2]}`}]
    return `已設定角色：${match[2]}`
  } else if (match[1] === 'save') {
    settings[match[2]] = messages
    return `已儲存您的設定：${match[2]}`
  } else if (match[1] === 'read') {
    if (settings[match[2]]) {
      messages = settings[match[2]]
      return `已切換至設定檔：${match[2]}`
    }
    return `查無設定檔：${match[2]}`
  } else if (match[1] === 'delete') {
    if (settings[match[2]]) {
      delete settings[match[2]]
      return `已刪除設定檔：${match[2]}`
    }
    return `查無設定檔：${match[2]}`
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    })
    // Clean up the text and translate simplified Chinese to traditional
    const text = chineseConv.tify(completion.data.choices[0].message.content.trim().replace(/^[\n,.;:?!，。；：？！]+/, ''))
    // If the length of the conversation exceeds 3600 tokens, delete the earliest message after setting.
    if (completion.data.usage.total_tokens > MAX_PROMPT_LENGTH) {
      messages.splice(1, 1)
    } 
    // Save response records for continuous conversation
    messages.push({role: "system", content:`${text}`})
    return text
  } catch (err) {
    console.log('error.message = ',err.message)
  }
}

const getSettings = () => {
  return settings
}

module.exports = {
  chatGPT,
  getSettings
}
