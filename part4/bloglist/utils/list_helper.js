const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  max = blogs[0].likes
  let favorite = {
    title: blogs[0].title,
    author: blogs[0].author,
    likes: blogs[0].likes
  }
  for (let i = 1; i < blogs.length; i++) {
    if (blogs[i].likes > max) {
      max = blogs[i].like
      favorite = {
        title: blogs[i].title,
        author: blogs[i].author,
        likes: blogs[i].likes
      }
    }
  }
  return favorite
}

const mostBlogs = (blogs) => {
  const chain = _.chain(blogs).countBy('author').toPairs().maxBy(o => o[1]).value()
  return {
    author: chain[0],
    blogs: chain[1]
  }
}

const mostLikes = (blogs) => {
  const chain = _.chain(blogs).groupBy('author').toPairs().maxBy(o => _.sumBy(o[1], 'likes')).value()
  return {
    author: chain[0],
    likes: _.sumBy(chain[1], 'likes')
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}