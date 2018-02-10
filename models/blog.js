const mongoose = require('mongoose')
const Schema = mongoose.Schema

var blogSchema = new Schema ({
  title: String,
  author: String,
  url: String,
  user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  likes: {type:Number, default: 0}
})
blogSchema.statics.format = function(blog) {
  return {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
    id: blog._id,
    user: blog.user
  }
}
const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
