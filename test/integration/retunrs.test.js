const mongoose = require('mongoose');
const { Rental } = require('../../models/rentals')
const request = require('supertest')

// POST /api/return {customerId, movieId}
// Return 401 if client is not logged in
// Return 400 if customerId is not provided
// Return 400 if movieId is not provided
// Return 404 if no rental found for this customer/movie
// Return 400 if rental already processed
// Return 200 if valid request
// Set the return date
// Calculate the rental fee
// Increase the stock
// Return the rental


describe('/api/returns', ()=>{
  let server;
  let customerId;
  let movieId;
  let rental;
  beforeEach(async()=> {
    server = require('../../index')
    customerId = mongoose.Types.ObjectId()
    movieId = mongoose.Types.ObjectId()

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
    await rental.save()
  })

  afterEach(async ()=> {
    await server.close()
    await Rental.remove({})// reset the DB at initial state
  })

  it('shoudl work!', async()=>{
    const result = await Rental.findById(rental._id)
    expect(result).not.toBeNull()
  })

  describe('POST /', ()=>{
    it('Return 401 if client is not logged in', async()=>{
      const result = await request(server)
        .post('/api/returns')
        .send({ customerId, movieId })

      expect(result.status).toBe(401)
    })
  })
})