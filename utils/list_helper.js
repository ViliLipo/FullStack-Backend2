const dummy = (blogs) => {
  return 1
}


const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item
  }
  return blogs.map(blog => blog.likes).reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
  const reducer = (best, item) => {
    if( item.likes > best.likes) {
      return item
    } else {
      return best
    }
  }
  return blogs.reduce(reducer, blogs[0])
}

const mostBlogs = (blogs) => {
  authors = []
  blogs.forEach((blog) =>{
    var auth = authors.find((author) => {
      return author.name === blog.author
    })
    if (auth) {
      auth.blogs +=1
    } else {
      authors.push( {
        name: blog.author,
        blogs: 1
      })
    }
  })
  const reducer = (best, item)=> {
    if(item.blogs > best.blogs) {
      return item
    } else {
      return best
    }
  }
  return authors.reduce(reducer, authors[0])
}
const mostLikes = (blogs) => {
  authors = []
  blogs.forEach((blog) => {
    var auth = authors.find((author) => {
      return author.name == blog.author
    })
    if (auth) {
      auth.likes += blog.likes
    } else {
      authors.push({
        name : blog.author,
        likes : blog.likes
      })
    }
  })
  const reducer = (best, item) => {
    if (item.likes > best.likes) {
      return item
    } else {
      return best
    }
  }
  return authors.reduce(reducer, authors[0])
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}
