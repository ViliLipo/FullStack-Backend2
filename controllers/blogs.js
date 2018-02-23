const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', (request, response) => {
  //console.log('getting all')
  Blog
    .find({})
    .populate('user', {username:1, name:1})
    .then(blogs => {
      //console.log(blogs)
      response.json(blogs.map(Blog.format))
    }).catch(error => {
      response.status(404).json({error: 'blogs not found'})
    })
})

blogsRouter.get('/:id',(request, response) => {
  console.log(request.params.id)
  Blog.findById(request.params.id).populate('user', {username:1,name:1}).then( blog => {
    console.log(blog)
    response.json(Blog.format(blog))
  }).catch(error => {
    console.log(error)
    response.status(404).json({error: 'blog not found'})
  })
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const token = request.token
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(!token || !decodedToken.id) {
      return response.status(401).json({error: 'token missing or invalid'})
    }
    if (!request.body.title ||!request.body.url) {
      response.status(400).json({error:"Bad request"})
      return
    }
    const user = await User.findById(decodedToken.id)
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      user: user._id,
      likes: body.likes
    })
    var savedBlog = await blog.save()
    console.log(savedBlog._id)
    let resBlog = await Blog.findById(savedBlog._id).populate('user', {username:1, name:1})
    console.log(resBlog)
    user.blogs = user.blogs.concat(savedBlog._id)
    //console.log(User.format(user))
    await user.save()
    response.status(201).json(Blog.format(resBlog))
  } catch (exception) {
    if(exception.name==='JsonWebTokenError') {
      response.status(401).json({error: exception.message})
    } else {
      console.log(exception)
      response.status(500).json({error: 'Something went wrong...'})
    }
  }
})

blogsRouter.put('/:id', async (request, response) => {
  if (!request.body.title ||!request.body.url) {
    response.status(400).json({error:"Bad request"})
    return
  }
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  try {
    let result = await Blog
        .findByIdAndUpdate(request.params.id, blog, {new: true})
        .populate('user', {username:1,name:1})
    //console.log(Blog.format(result))
    console.log(result)
    response.status(201).json(Blog.format(result))
  } catch( exception ) {
    //console.log(exception)
    response.status(400).send({error: 'malformatted id' })
  }
})

blogsRouter.delete('/:id',  async (request, response) => {
  const token = request.token

  //console.log('deleting id ', request.params.id)
  try {
    const blog = await Blog.findById(request.params.id)
    const userId = blog.user
    //console.log('userID: ', userId)

    const decodedToken = jwt.verify(token, process.env.SECRET)
    //console.log(decodedToken.id)
    //console.log(userId == decodedToken.id)
    if( userId == decodedToken.id) {
      //console.log("in")
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    } else {
      response.status(401).end()
    }
  } catch (error) {
    console.log(error)
    response.status(400).send({error: 'malformatted id '})
  }
})
module.exports = blogsRouter
