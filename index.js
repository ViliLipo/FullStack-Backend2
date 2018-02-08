const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const Blog = require('./models/blog')
const blogsRouter = require('./controllers/blogs')


app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
app.use('/api/blogs', blogsRouter)

const mongoUrl = 'mongodb://admin:dankmemes@ds229388.mlab.com:29388/bloglistdata'
mongoose.connect(mongoUrl)
mongoose.Promise = global.Promise



const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
