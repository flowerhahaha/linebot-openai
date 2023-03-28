import mongoose from 'mongoose'
const MONGODB_URI = process.env.MONGODB_URI || ''

mongoose.connect(MONGODB_URI)

const db = mongoose.connection
db.on('error', () => console.log('mongoDB error!'))
db.once('open', () => console.log('mongoDB connected!'))

export { db }
