const request = require('supertest')
const { Genre } = require('../../models/genres')
const { User } = require('../../models/users')
const mongoose = require('mongoose')

let server

describe('/api/genres', () =>{
  beforeEach(()=> { server = require('../../index') })
  afterEach(async ()=> {
    server.close()
    await Genre.remove({})// reset the DB at initial state
  })

  describe('GET /', () =>{
    it('should return all genres', async () =>{
      // prepare the DB insert values
      await Genre.collection.insertMany([
        { name: 'genre1' },
        { name: 'genre2' },
      ])

      const res = await request(server).get('/api/genres')
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(2)
      expect(res.body.some(g => g.name === 'genre1' )).toBeTruthy()
      expect(res.body.some(g => g.name === 'genre2' )).toBeTruthy()
    })
  })

  describe('GET /:id', ()=>{
    it('should be return status 404 if invalid id passed', async()=> {
      const res = await request(server).get('/api/genres/' + '1234')

      expect(res.status).toBe(404)
    })
    it('should be return status 404 if no genre with the given id exist', async()=> {
      const id = mongoose.Types.ObjectId()
      const res = await request(server).get('/api/genres/' + id)

      expect(res.status).toBe(404)
    })
    it('should be return a valid genre if it exist', async()=>{
      const genre = new Genre({ name: 'genre1' })
      await genre.save()

      const res = await request(server).get('/api/genres/' + genre._id)

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('name', genre.name)
    })
  })

  describe('POST /', ()=>{
    let token
    let name

    beforeEach(() => {
      token = new User().generateAuthToken()
      name = 'genretest'
    })

    const execute = async()=> {
      return await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name })
    }

    it('should resturn 401 if client si not logged in', async()=>{
      token = ''
      const res = await execute()

      expect(res.status).toBe(401)
    })

    it('should resturn 400 if genre is less than 5 characters', async()=>{
      name = '1234'
      const res = await execute()

      expect(res.status).toBe(400)
    })

    it('should resturn 400 if genre is more than 50 characters', async()=>{
      name = new Array(52).join('a')
      const res = await execute()

      expect(res.status).toBe(400)
    })

    it('should save the genre if it is valid', async()=>{
      const res = await execute()
      const genre = await Genre.find({ name:'genretest' })

      expect(genre).not.toBeNull()
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('_id')
      expect(res.body).toHaveProperty('name', 'genretest')
    })
  })

})