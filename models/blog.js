const mongoose = require('mongoose')

const url = 'mongodb://admin:dankmemes@ds229388.mlab.com:29388/bloglistdata'

const Blog = mongoose.model('Blog', {
  title: String,
  author: String,
  url: String,
  likes: Number
})

module.exports = Blog
