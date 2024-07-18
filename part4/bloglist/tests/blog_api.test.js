const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    blogs.forEach(blog => assert.strictEqual(Object.prototype.hasOwnProperty.call(blog, 'id'), true))
  })

  describe('addition of a new blog', () => {
    test('a valid post can be added', async () => {
      const newBlog = {
        title: '50 basic Linux commands',
        author: 'Ritik Pal',
        url: "https:\/\/dev.to\/just_ritik\/50-basic-linux-commands-3af6?ref=dailydev",
        likes: 10
      }
    
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      const response = await api.get('/api/blogs')
      const titles = response.body.map(r => r.title)
    
      assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
      assert(titles.includes('50 basic Linux commands'))
    })
  
    test('if the likes property is missing from the request, it will default to the value 0', async () => {
      const newBlog = {
        title: 'My work setup for PHP developement',
        author: 'Ben Sinclair',
        url: 'https://dev.to/moopet/my-work-setup-for-php-development-4dj8'
      }
    
      const response = await api
        .post('/api/blogs')
        .send(newBlog)
      const addedBlog = response.body
      assert.strictEqual(addedBlog.likes, 0)
    })
    
    test('if title properties are missing from the request data, the status code is 400', async () => {
      const blog1 = {
        title: 'Blog 1'
      }
      await api
        .post('/api/blogs')
        .send(blog1)
        .expect(400)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

      const titles = blogsAtEnd.map(r => r.content)
      assert(!titles.includes(blogToDelete.title))
    })
  })

  describe('updation of a blog', () => {
    test('succeeds with status code 200 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      blogToUpdate.likes += 1

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})