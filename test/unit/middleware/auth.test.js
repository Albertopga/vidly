const { User } = require('../../../models/users')
const auth = require('../../../middleware/auth')
const mongoose = require('mongoose')

describe('auth middleware', ()=>{
  it('should populate req.user with the payload of a valida jwt', ()=>{
    // prepare the necessary parameters to call the midleware
    const user = { _id: mongoose.Types.ObjectId(), isAdmin: true }
    const token = new User(user).generateAuthToken()
    const req = {
      header: jest.fn().mockReturnValue(token)
    }
    const res = {}
    const next = jest.fn()
    // call the midleware
    auth(req, res, next)
    // assertions
    expect(req.user).toMatchObject(user)
  })

})