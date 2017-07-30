const { route } = require('vqua-router')
const request = require('request')
const initServer = require('./helpers/initServer')

let routes = []

describe('Handle not found', () => {

  initServer(routes)

  it('GET /notFound | 500 | error message', (done) => {

    request('http://localhost:8080/notFound', (error, response, body) => {

      expect(response.statusCode).toBe(404)
      expect(!!body.match('Error 404')).toBe(true)

      done()

    })

  })

})
