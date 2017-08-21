const Component = require('../../Component')
const createTagNode = require('../../createNode/createTagNode')
const { TAG_TYPE } = require('../../../constants/nodeTypes')
const Statistic = require('../../Statistic')

describe('Create tag node', () => {

  it('create node with statistic params', () => {

    const templateNode = {
      type: TAG_TYPE,
      tag: 'div',
      props: {},
      childs: [],
    }

    const newNode =
      createTagNode({
        templateNode,
        statistic: new Statistic
      })

    expect(newNode.statistic instanceof Statistic).toBe(true)

  })

  it('return clone of template node', () => {

    const templateNode = {
      type: TAG_TYPE,
      tag: 'div',
      props: { id: 1 },
      ref: {
        name: 'div',
        instance: {}
      },
      childs: []
    }

    expect(
      createTagNode({ templateNode })
    ).toEqual(templateNode)

  })

})
