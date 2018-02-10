const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema ( {
  username: String,
  name: String,
  passwordHash: String,
  adult: {type: Boolean, default: true},
  blogs :[{type: mongoose.Schema.Types.ObjectId, ref:'Blog'}]
})

userSchema.statics.format = function(user) {
  return {
    username: user.username,
    name: user.name,
    adult: user.adult,
    blogs: user.blogs
  }
}

const User = mongoose.model('User', userSchema)

module.exports = User
