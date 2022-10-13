const request = require('supertest')
const { Genre } = require('../../models/genres')
const { User } = require('../../models/users')
const mongoose = require('mongoose');

let server;
let token;

beforeEach(async () => {
  server = require('../../index')
  token = new User().generateAuthToken()
  await server.close()
})
afterEach( async () => {
  await Genre.remove({})// reset the DB at initial state
})

const execute = ()=>{
  return request(server)
  .post('/api/genres')
  .set('x-auth-token', token)
  .send({ name: 'genretest' })
}

describe('auth midleware', () => {
  it('should return 401 if no token is provider', async() => {
    token = ''

    const res = await execute()

    expect(res.status).toBe(401)
  })

  it('should return 400 if token is invalid', async() => {
    token = 'a'

    const res = await execute()

    expect(res.status).toBe(400)
  })

  it('should return 200 if token is valid', async() => {
    const res = await execute()

    expect(res.status).toBe(200)
  })

  it('should return 200 if token is valid', async() => {
    const res = await execute()

    expect(res.status).toBe(200)
  })
})