const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', (request, response) => {
  //console.log('getting all')
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs.map(Blog.format))
    }).catch(error => {
      response.status(404).json({error: 'blogs not found'})
    })
})

blogsRouter.get('/:id',(request, response) => {
  Blog.findById(request.params.id).then( blog => {
    response.json(Blog.format(blog))
  }).catch(error => {
    console.log(error)
    response.status(404).json({error: 'blog not found'})
  })
})

blogsRouter.post('/', async (request, response) => {
  if (!request.body.title ||!request.body.url) {
    response.status(400).json({error:"Bad request"})
    return
  }
  // TO DO
  const users = await User.find({})
  const user = users[0]
  //console.log(user)
  const body = request.body
  // FIX
  try {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      user: user._id,
      likes: body.likes
    })
    const savedBlog = await blog.save()
    //console.log(savedBlog._id)
    user.blogs = user.blogs.concat(savedBlog._id)
    console.log(User.format(user))
    await user.save()
    response.status(201).json(Blog.format(savedBlog))
  } catch (exception) {
    console.log(exception)
    response.status(500).json({error: 'Something went wrong...'})
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
    console.log(Blog.format(result))
    response.status(201).json(Blog.format(result))
  } catch( exception ) {
    //console.log(exception)
    response.status(400).send({error: 'malformatted id' })
  }
})

blogsRouter.delete('/:id',  async (request, response) => {
  console.log('deleting id ', request.params.id)
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (error) {
    //console.log(error)
    response.status(400).send({error: 'malformatted id '})
  }
})
module.exports = blogsRouter
