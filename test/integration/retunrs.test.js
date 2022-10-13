const mongoose = require('mongoose');
const { Rental } = require('../../models/rentals')
const { User } = require('../../models/users')
const request = require('supertest')


describe('/api/returns', ()=>{
  let server;
  let customerId;
  let movieId;
  let rental;
  let token;

  beforeEach(async()=> {
    server = require('../../index')
    customerId = mongoose.Types.ObjectId()
    movieId = mongoose.Types.ObjectId()
    token = new User().generateAuthToken()

    rental = new Rental({
      customer: {
        _id: customerId,
        name: '12345',
        phone: '12345'
      },
      movie: {
        _id: movieId,
        title: '12345',
        dailyRentalRate: 2
      }
    })
    await server.close()
    await rental.save()
  })

  afterEach(async ()=> {
    await Rental.remove({})// reset the DB at initial state
  })

  const execute = () => {
    return request(server)
    .post('/api/returns')
    .set('x-auth-token', token)
    .send({ customerId, movieId })
  }

  it('shoudl work!', async()=>{
    const result = await Rental.findById(rental._id)
    expect(result).not.toBeNull()
  })

  describe('POST /', ()=>{
    it('Return 401 if client is not logged in', async()=>{
      token = ''

      const result = await execute()

      expect(result.status).toBe(401)
    })

    it('Return 400 if customerId is not provided', async()=>{
      customerId = ''

      const result = await execute()

      expect(result.status).toBe(400)
    })

    it('Return 400 if movieId is not provided', async()=>{
      movieId = ''

      const result = await execute()

      expect(result.status).toBe(400)
    })

    it('Return 404 if no rental found for this customer/movie', async()=>{
      await Rental.remove({})

      const result = await execute()

      expect(result.status).toBe(404)
    })

    it('Return 400 if rental is already processed', async()=>{
      rental.dateReturned = new Date()
      await rental.save()

      const result = await execute()

      expect(result.status).toBe(400)
    })

    it('Return 200 if valid request', async()=>{
      const result = await execute()

      expect(result.status).toBe(200)
    })

    it('Should set the returnDate if input is valid', async()=>{
      await execute()

      const rentalInDb = await Rental.findById(rental._id)
      expect(rentalInDb.dateReturned).toBeDefined()
    })


  })
})

// POST /api/return {customerId, movieId}
// Set the return date
// Calculate the rental fee
// Increase the stock
// Return the rental