const { route } = require('vqua-router')
const request = require('request')
const initServer = require('./helpers/initServer')
const App = require('./data/App')

let routes = []

describe('Handle action', () => {

  initServer(routes)

  it('GET /send | 200 | [layout with nodes to string]', (done) => {

    routes.push(
      route('/send', (request, response) => {

        response.send(App.v())

      })
    )

    request('http://localhost:8080/send', (error, response, body) => {

      expect(response.statusCode).toBe(200)
      expect(body).toBe('<layout><p>Hello <span>world</span>!</p></layout>')

      done()

    })

  })

  it('GET /send/new-layout | 200 | [new layout with nodes to string]', (done) => {

    routes.push(
      route('/send/new-layout', (request, response) => {

        response.send(App.v(), { layout: html => `<l>${html}</l>` })

      })
    )

    request('http://localhost:8080/send/new-layout', (error, response, body) => {

      expect(response.statusCode).toBe(200)
      expect(body).toBe('<l><p>Hello <span>world</span>!</p></l>')

      done()

    })

  })


})
