if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('hello gpt')
})

app.listen((PORT), () => {
  console.log('App is running on http://localhost:3000')
})