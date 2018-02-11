
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')


loginRouter.post('/', async(request, response) => {
  const body = request.body

  const user = await User.findOne({username: body.username})
  console.log(user)
  console.log(body.password)
  const passwordCorrect = user === null?
    false:
    await bcrypt.compare(body.password, user.passwordHash)
  if(!(user && passwordCorrect)) {
    return response.status(401).send({error: 'invalid username or password'})
  }
  console.log('user is found')
  const userForToken = {
    username: user.username,
    id: user._id
  }
  //console.log(process.env.SECRET)
  const token = jwt.sign(userForToken, process.env.SECRET)
  console.log('token has been signed')
  response.status(200).send({token, username: user.username, name:user.name})
})

module.exports = loginRouter
