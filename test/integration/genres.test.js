const { expectCt } = require('helmet')
const request = require('supertest')
const { Genre } = require('../../models/genres')
const { User } = require('../../models/users')

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
    it('should be return status 404 if not find genre', async()=> {
      const res = await request(server).get('/api/genres/' + '1234')

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
    it('should resturn 401 if client si not logged in', async()=>{
      const token = new User().generateAuthToken()

      const res = await request(server)
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({ name: '1234' })
      
      console.log("🚀 ~ file: genres.test.js ~ line 53 ~ it ~ res", res)
      expect(res.status).toBe(400)
    })

    it('should resturn 400 if genre is less than 5 characters', async()=>{
      const res = await request(server)
        .post('/api/genres')
        .send({ name: 'genre1' })

        expect(res.status).toBe(401)
    })
  })

})