const createRoute = require('../createRoute')

describe('Create route', () => {

  it('object with segments, path, action', () => {

    const route = createRoute('/posts/:id', 'posts-show')

    expect(route).toEqual({
      segments: ['posts', ':id'],
      path: '/posts/:id',
      action: 'posts-show',
      props: {},
      childs: []
    })

  })

})
