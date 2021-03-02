const app = require('../startup/app')
const supertest = require('supertest')
const request = supertest(app)
const mongoose = require('mongoose')

describe('Testing routes', () => {
  it('gets hotels', async (done) => {
    const response = await request.get('/api/hotels')

    expect(response.status).toBe(200)
    done()
  })

  it('gets limited number of hotels as an array', async (done) => {
    const response = await request.get('/api/hotels/20')
    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.any(Array))
    done()
  })

  it('gets error when no token provided', async (done) => {
    const response = await request.get('/api/reservations')

    expect(response.status).toBe(401)
    done()
  })

  it('Throws error when route is not supported', async (done) => {
    const response = await request.get('/someRoute')

    expect(response.status).toBe(404)
    done()
  })
})
