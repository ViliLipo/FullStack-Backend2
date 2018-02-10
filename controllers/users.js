
 const bcrypt = require('bcrypt')
 const usersRouter = require('express').Router()
 const User = require('../models/user')


usersRouter.post('/', async (request, response) => {
  try {
    const body = request.body
    const matchingUsers = await User.find({username: body.username})
    //console.log(matchingUsers)
    if(matchingUsers.length > 0) {
      response.status(400).json({error:'username must be unique'})
      return
    }
    if(body.password.length < 3) {
      response.status(400).json({error:'password needs to be over 3 characters long'})
      return
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const user = new User( {
      username : body.username,
      name : body.name,
      passwordHash
    })
    const savedUser = await user.save()
    response.status(200).json(savedUser)
  } catch (exception) {
    console.log(exception)
    response.status(500).json({error: 'Oops ! Something went wrong'})
  }
})


usersRouter.get('/', async (request, response) => {
  try {
    let users = await User.find({}).populate('blogs')
    response.status(200).json(users.map(User.format))
  } catch (exception) {
    console.log(exception)
    response.status(404).json({error: 'Users not found'})
  }


})

module.exports = usersRouter
