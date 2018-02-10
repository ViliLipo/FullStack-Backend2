const User = require('../models/user')
const supertest = require('supertest')
const {app, server} = require('../index')
const api = supertest(app)
const testHelper = require('./.test_helper')


describe.only('when there is initially one user at db', async () => {
  beforeAll(async () => {
    await User.remove({})
    const user = new User({ username: 'root', password: 'sekret' })
    await user.save()
  })

  test('POST /api/users succeeds with a fresh username', async () => {
    const usersBeforeOperation = await testHelper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAfterOperation = await testHelper.usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length+1)
    const usernames = usersAfterOperation.map(u=>u.username)
    expect(usernames).toContain(newUser.username)
  })
test('Post user fails with proper status if username is taken', async() => {
  const usersBeforeOperation = await testHelper.usersInDb()
  const newUser = {
    username: 'root',
    name: 'su',
    password: 'crypted'
  }
  const result = await api
                          .post('/api/users')
                          .send(newUser)
                          .expect(400)
                          .expect('Content-Type', /application\/json/)
  expect(result.body).toEqual({error: 'username must be unique'})
  const usersAfterOperation = await testHelper.usersInDb()
  expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
})
test('POST user fails if password is under 3 characters', async() => {
  const usersBeforeOperation = await testHelper.usersInDb()
  const newUser = {
    username : 'LionKing',
    name: 'Simba',
    password: '22'
  }
  const result = await api
                          .post('/api/users')
                          .send(newUser)
                          .expect(400)
                          .expect('Content-Type', /application\/json/)
  expect(result.body).toEqual({error: 'password needs to be over 3 characters long'})
})
afterAll( async () => {
    server.close()
  })

})
