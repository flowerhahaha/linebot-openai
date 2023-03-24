// Set openai config
import { Configuration, OpenAIApi, CreateChatCompletionRequest } from "openai"
const chineseConv = require('chinese-conv')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY as string
})
const openai = new OpenAIApi(configuration)

interface Message {
  role: "user" | "assistant" | "system",
  content: string
}

interface Settings {
  [key: string]: Message[]
}

const MAX_PROMPT_LENGTH = 3500
const MAX_MESSAGES_LENGTH = 20
const settings: Settings = {}
let messages: Message[] = []

const chatGPT = async (userInput: string): Promise<string> => {
  const match = userInput.toLowerCase().match(/^\/(set|save|read|delete): (.+)/)
  if (!match) {
    messages.push({role: "user", content:`${userInput.slice(0, 500)}`})
  } else if (match[1] === 'set') {
    messages = [{role: "system", content:`${match[2]}`}]
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

  if (messages.length > MAX_MESSAGES_LENGTH) {
    messages.splice(1, 2)
  }

  try {
    const request:CreateChatCompletionRequest = {
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 500
    }
    const completion = await openai.createChatCompletion(request)
    // Clean up the text and translate simplified Chinese to traditional
    const text = chineseConv.tify(completion.data.choices[0].message!.content.trim().replace(/^[\n,.;:?!，。；：？！]+/, ''))
    // If the length of the conversation exceeds 3600 tokens, delete the earliest message after setting.
    if (completion.data.usage!.total_tokens > MAX_PROMPT_LENGTH) {
      messages.splice(1, 2)
    }
    // Save response records for continuous conversation
    messages.push({role: "assistant", content:`${text}`})
    return text
  } catch (err) {
    if (err instanceof Error) {
      console.log('error.message = ', err)
      return err.message
    }
    return '發生錯誤，請稍後再試'
  }
}

export { chatGPT, settings }
