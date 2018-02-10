const listHelper = require('../utils/list_helper')

describe('dummy', () => {
  test('dummy is called', () => {
    const blogs = []
    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
  })
})
const noBlog = []
const oneBlog = [
      {
      title: "blog",
      author: 'Pertti Keinonen',
      url: "keme",
      likes : 5
    }]
  const twoBlogs = [
    {
      title: "blog",
      author: 'Pertti Keinonen',
      url: "keme",
      likes : 15
    },
    {
      title: "blog2",
      author: 'Sami Kokkola',
      url: "meme",
      likes : 10
    }
  ]

  const threeBlogs = [
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

describe('totalLikes', () => {

  test("no blog", () => {
    const result = listHelper.totalLikes(noBlog)
    expect(result).toBe(0)
  })
  test('a blog that equals 5 likes', () => {
    const result = listHelper.totalLikes(oneBlog)
    expect(result).toBe(5)
  })
  test('two list that equal 25 likes', () => {
    const result = listHelper.totalLikes(twoBlogs)
    expect(result).toBe(25)
  })
})


describe('favouriteBlog', () => {
  test("two blogs", () => {
    const result = listHelper.favouriteBlog(twoBlogs)
    expect(result).toEqual(twoBlogs[0])
  })
})

describe('mostBlogs', () => {
  test("three blogs", () => {
    const result = listHelper.mostBlogs(threeBlogs)
    const auth = {
      name: 'Pertti Keinonen',
      blogs: 2
    }
    expect(result).toEqual(auth)
  })
})

describe('mostLikes', ()=> {
  test("three blogs", () => {
    const result = listHelper.mostLikes(threeBlogs)
    const auth = {
      name: 'Sami Kokkola',
      likes : 21
    }
    expect(result).toEqual(auth)
  })
})
