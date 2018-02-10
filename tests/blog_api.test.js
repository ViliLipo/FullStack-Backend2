const supertest = require('supertest')
const {app, server} = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const {initialBlogs, regularBlog, blogWithUndefinedLikes, blogsInDb} = require('./.test_helper')


beforeAll(async() => {
  await Blog.remove({})
  const blogObjects = initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
})

describe('Posts ', async() => {
  test('a post', async () => {
    const r = await api
            .post('/api/blogs')
            .send(regularBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    expect(r.body.author).toBe(regularBlog.author)
    const response = await api
    .get('/api/blogs')
    const contents = response.body.map(r => r.title)
    expect(response.body.length).toBe(initialBlogs.length +1)
    expect(contents).toContain(regularBlog.title)
  } )

  test('a post with undefined likes, that should be set to 0', async () => {
    const response = await api
            .post('/api/blogs')
            .send(blogWithUndefinedLikes)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    expect(response.body.likes).toBe(0)
  })

  test('a post with undefined everything, should lead to bad request', async() => {
    const response = await api
            .post('/api/blogs')
            .send({})
            .expect(400)
    expect(response.body.error).toBe("Bad request")
  })
})

describe('Gets ', async () => {
  test('blogs are defined as json', async () => {
    await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
  })

  test('blogs are returned correctly', async () => {

    const response = await api
                              .get('/api/blogs')
                              .expect(200)
                              .expect('Content-Type', /application\/json/)
    const expected = await blogsInDb()
    expect(JSON.stringify(response.body)).toEqual(JSON.stringify(expected))
  })

  test('One blog is returned correctly', async () => {
    let response = await api
                              .post('/api/blogs')
                              .send(regularBlog)
                              .expect(201)
    let response2 = await api.get(`/api/blogs/${response.body.id}`).expect(200)
    expect(response.body.id).toEqual(response2.body.id)
  })
})

describe('Delete ', async() => {
  test('add and delete one blog', async () => {
    //console.log('Debugging')
    let response = await api
                              .post('/api/blogs')
                              .send(regularBlog)
                              .expect(201)
    //console.log('debug 2' , `api/blogs/${response.body.id}`)
    const sentBlog = response.body
    await api.del(`/api/blogs/${response.body.id}`).expect(204)
    //console.log('debug 3')
    response = await api
                        .get('/api/blogs')
                        .expect(200)
    const expected = await response.body.map(Blog.format).map((blog) => blog.id)
    expect(expected).not.toContain(sentBlog.id)
  })
})
describe("Update", async() => {
  test(' add and update one blog', async () => {
    let response = await api
                            .post('/api/blogs')
                            .send(regularBlog)
                            .expect(201)
    let sentBlog = response.body
    const originalLikes = sentBlog.likes
    sentBlog.likes = sentBlog.likes + 3
    response = await api
            .put(`/api/blogs/${sentBlog.id}`)
            .send(sentBlog)
    expect(response.body.likes).toBe(originalLikes + 3)
  })
  test('update with bad id should lead to 400 malformatted id', async() => {
    let response = await api.put('/api/blogs/1').send(regularBlog).expect(400)
    expect(response.body.error).toEqual('malformatted id')
  })
})

afterAll(() => {
  server.close()
})
