import { middleware, MiddlewareConfig } from '@line/bot-sdk'

const config: MiddlewareConfig = {
  channelAccessToken: process.env.channelAccessToken || '',
  channelSecret: process.env.channelSecret || '',
}

export const lineMiddleware = middleware(config)