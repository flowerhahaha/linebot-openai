import mongoose, { Schema } from 'mongoose'

interface IMessage {
  role: "user" | "assistant" | "system",
  content: string
}

interface ISetting {
  key: string
  userId: string
  messages: IMessage[]
}

const messageSchema: Schema<IMessage> = new Schema({
  role: {
    type: String,
    enum: ["user", "assistant", "system"],
    required: true
  },
  content: {
    type: String,
    required: true
  }
})

const settingSchema: Schema<ISetting> = new Schema({
  key: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  messages: {
    type: [messageSchema],
    required: true
  }
})

// Create a compound index on userId and key for faster queries since we will be querying by both fields
settingSchema.index({ userId: 1, key: 1 })

const Setting = mongoose.model<ISetting>('Setting', settingSchema)

export { Setting, ISetting, IMessage}