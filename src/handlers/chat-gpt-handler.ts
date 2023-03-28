// Set openai config
import { Configuration, OpenAIApi, CreateChatCompletionRequest } from "openai"
import { IMessage } from "../models/setting"
import { TextMessage } from '@line/bot-sdk'
const chineseConv = require('chinese-conv')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY as string
})
const openai = new OpenAIApi(configuration)

interface IMessages {
  [userId: string]: IMessage[]
}

const MAX_PROMPT_LENGTH = 3500
const MAX_MESSAGES_LENGTH = 20
let messages: IMessages = {}

const chatGPTHandler = async (userId: string ,userInput: string): Promise<TextMessage> => {
  if (!messages[userId]) {
    messages[userId] = []
  }
  const userMessages = messages[userId]
  try {
    userMessages.push({role: "user", content:`${userInput.slice(0, 500)}`})
    // delete the earliest message after setting to save costs
    if (userMessages.length > MAX_MESSAGES_LENGTH) {
      userMessages.splice(1, 2)
    }
    const request:CreateChatCompletionRequest = {
      model: "gpt-3.5-turbo",
      messages: userMessages,
      max_tokens: 500
    }
    const completion = await openai.createChatCompletion(request)
    // Clean up the text and translate simplified Chinese to traditional
    const text = chineseConv.tify(completion.data.choices[0].message!.content.trim().replace(/^[\n,.;:?!，。；：？！]+/, ''))
    // delete the earliest message after setting to prevent the prompt from exceeding 4096 tokens limit
    if (completion.data.usage!.total_tokens > MAX_PROMPT_LENGTH) {
      userMessages.splice(1, 2)
    }
    // Save response records for continuous conversation
    userMessages.push({role: "assistant", content:`${text}`})
    return { type: 'text', text: text }
  } catch (error) {
    if (error instanceof Error) {
      console.log('error.message = ', error)
      return { type: 'text', text: `${error.message}` }
    }
    return { type: 'text', text: '發生錯誤，請稍後再試' }
  }
}

export { chatGPTHandler, messages }
