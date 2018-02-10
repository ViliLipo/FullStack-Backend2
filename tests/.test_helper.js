const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: "blog",
    author: 'Pertti Keinonen',
    url: "keme",
    likes : 15
  },
  {
    title: "blogmonster",
    author: 'Pertti Keinonen',
    url: 'keme',
    likes : 5
  },
  {
    title: "blog2",
    author: 'Sami Kokkola',
    url: "meme",
    likes : 21
  }
]

const regularBlog = {
  title: "Kokkikartano",
  author: 'Jyrki Sukula',
  url: 'www.ruokablogit.org'
}
const blogWithUndefinedLikes = {
  title: 'Kekkonen oli väärässä',
  author: "Paavo Väyrynen",
  url: "www.kyllaPaavoHoitaa.fi"
}

const blogsInDb = async() => {
  const blogs = await Blog.find({})
  return await blogs.map(Blog.format)
}

const usersInDb = async() => {
  const users = await User.find({})
  return users.map(User.format)
}
module.exports = {
  initialBlogs, regularBlog, blogWithUndefinedLikes, blogsInDb, usersInDb
}
