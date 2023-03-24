import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}
import express, { Request, Response, Application } from 'express'
import { lineMiddleware } from './line-middleware'
import { handleEvent } from './line-event-handler'

const app: Application = express()
const PORT = process.env.PORT || 3000

// Router for receive and reply message 
app.post('/webhook', lineMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    // Handles each incoming event and waits for all events to be processed
    const result = await Promise.all(req.body.events.map(handleEvent))
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500)
  }
})

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
