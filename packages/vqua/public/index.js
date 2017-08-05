/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 65);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = {
  ROOT_TYPE:     0,
  TEXT_TYPE:     1,
  TAG_TYPE:      2,
  CLASS_TYPE:    3,
  INSTANCE_TYPE: 4,
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  asyncMap:       __webpack_require__(51),
  clone:          __webpack_require__(54),
  flatten:        __webpack_require__(21),
  include:        __webpack_require__(11),
  kindOf:         __webpack_require__(12),
  pick:           __webpack_require__(62),
  omit:           __webpack_require__(61),
  union:          __webpack_require__(64),
  capitalize:     __webpack_require__(52),
  classNames:     __webpack_require__(53),
  first:          __webpack_require__(57),
  last:           __webpack_require__(60),
  intersect:      __webpack_require__(59),
  times:          __webpack_require__(63),
  findRightIndex: __webpack_require__(56),
  compose:        __webpack_require__(55),
  htmlQuotes:     __webpack_require__(58),
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const humanizeNodes = __webpack_require__(47)
const { flatten, omit, clone } = __webpack_require__(1)
const countDomNodes = __webpack_require__(7)
const createLiveTree = __webpack_require__(9)
const filterDomNodes = __webpack_require__(18)
const getParentNodes = __webpack_require__(45)
const filterNodesOffsets = __webpack_require__(43)
const createPatchTree = __webpack_require__(16)
const findDomNode = __webpack_require__(27)
const updateDomTree = __webpack_require__(14)
const eachNodes = __webpack_require__(10)
const hookNode = __webpack_require__(6)
const { AFTER_DOM_CREATE } = __webpack_require__(5)
const { INSTANCE_TYPE, CLASS_TYPE } = __webpack_require__(0)

class Base {

  static defaultProps() {

    return {}

  }

  static v(props = {}, ...childs) {

    const newProps = Object.assign({}, omit(props, 'ref', 'key'), { childs })

    const refParams =
      props.ref
        ? { ref: props.ref }
        : {}

    const keyParams = props.key
      ? { key: props.key }
      : {}

    const baseParams = {
      type: CLASS_TYPE,
      class: this,
      props: newProps
    }

    return Object.assign({}, baseParams, refParams, keyParams)

  }

  constructor(props, context) {

    this.props = props
    this.state = {}
    this.context = context
    this.nextProps = {}
    this.nextState = {}
    this.nextContext = {}
    this.prevProps = {}
    this.prevState = {}
    this.prevContext = {}
    this.parentRef = null
    this.parentInstance = null
    this.refs = {}

  }


  isNeedUpdate(nextProps, nextState, nextContext) {

    return true

  }

  passContext() {

    return {}

  }

  setState(newState, callback = false) {

    const newContext = clone(this.node.context)

    if (!this.isNeedUpdate(this.props, newState, newContext)) return false

    if ('beforeUpdate' in this) {

      this.beforeUpdate(this.props, newState, newContext)

    }

    this.state = newState

    const contextWithPassed = Object.assign(newContext, this.passContext())

    const liveNodes = this.node.childs

    const templateNodes = flatten([ this.render() ])

    const newLiveNodes =
      createLiveTree(liveNodes, templateNodes, {
        hooks: true,
        linkParent: true,
        childDomNodesCount: true,
        index: true,
        context: clone(contextWithPassed),
        liveParentNode: this.node,
        liveParentInstanceNode: this.node,
      })

    this.node.childs = newLiveNodes

    this.node.childDomNodesCount = countDomNodes(newLiveNodes)

    const filteredLiveNodes = filterDomNodes(liveNodes, this)

    const filteredTemplateNodes = filterDomNodes(newLiveNodes, this)

    const parentNodes = getParentNodes(filteredLiveNodes[0])

    const parentOffsets = filterNodesOffsets(parentNodes)

    const offset = parentOffsets[parentOffsets.length - 1]

    const boundaryDomNode = findDomNode(parentNodes[0].dom, parentOffsets)

    const domRootNode = boundaryDomNode.parentNode

    const domRootChildNodes =
      Array.from(domRootNode.childNodes)
        .slice(offset, offset + filteredLiveNodes.length)

    const patchNodes =
      createPatchTree({
        offset,
        domNodes: domRootChildNodes,
        liveNodes: filteredLiveNodes,
        templateNodes: filteredTemplateNodes,
      })

    updateDomTree({ patchNodes, parentDomNode: domRootNode })

    eachNodes(newLiveNodes, (liveNode) => {

      if (liveNode.type == INSTANCE_TYPE) {

        hookNode(AFTER_DOM_CREATE, liveNode, null, null)

      }

    })

    return true

  }

}

module.exports = Base


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = {
  INSERT_NODE:  0,
  CREATE_NODE:  1,
  UPDATE_NODE:  2,
  REPLACE_NODE: 3,
  DELETE_NODE:  4,
}


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = {
  CREATE_ROOT:     0,
  CREATE_TEXT:     1,
  CREATE_TAG:      2,
  CREATE_INSTANCE: 3,
  UPDATE_INSTANCE: 4,
  RESUME_INSTANCE: 5,
}


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = {
  BEFORE_EACH_ITERATION:  0,
  BEFORE_INSTANCE_UPDATE: 1,
  ON_INSTANCE_CREATE:  2,
  AFTER_DOM_CREATE:       3,
}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const { removeRef } = __webpack_require__(19)
const eachNodes = __webpack_require__(10)
const isNodeForUnmount = __webpack_require__(48)

const { INSTANCE_TYPE } = __webpack_require__(0)

const {
  callBeforeMount, callBeforeUnmount, callBeforeUpdate,
  callAfterUpdate, callAfterMount
} = __webpack_require__(46)


const {
  BEFORE_EACH_ITERATION, ON_INSTANCE_CREATE,
  BEFORE_INSTANCE_UPDATE, AFTER_DOM_CREATE
} = __webpack_require__(5)

module.exports = (action, liveNode, templateNode, context) => {

  switch (action) {

    case BEFORE_EACH_ITERATION: {

      if (liveNode && isNodeForUnmount(liveNode, templateNode)) {

        eachNodes(liveNode, (_liveNode) => {

          if (_liveNode.type == INSTANCE_TYPE) {

            callBeforeUnmount(_liveNode.instance)

          }

          if (_liveNode.ref) {

            removeRef(_liveNode)

          }

        })

      }

      break
    }

    case ON_INSTANCE_CREATE: {

      callBeforeMount(liveNode.instance)

      liveNode.instance.waitAfterMount = true

      break
    }

    case BEFORE_INSTANCE_UPDATE: {

      const nextProps = templateNode.props
      const nextState = liveNode.instance.state
      const nextContext = context

      callBeforeUpdate(liveNode.instance, nextProps, nextState, nextContext)

      liveNode.instance.waitAfterUpdate = true

      break
    }

    case AFTER_DOM_CREATE: {

      if (liveNode.instance.waitAfterMount) {

        callAfterMount(liveNode.instance)

        liveNode.instance.waitAfterMount = false

      }

      if (liveNode.instance.waitAfterUpdate) {

        const { prevProps, prevState, prevContext } = liveNode.instance

        callAfterUpdate(liveNode.instance, prevProps, prevState, prevContext)

        liveNode.instance.waitAfterUpdate = false

      }


      break
    }

    default: {

      throw new Error('Unrecognized hook node action')

    }

  }


}


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const {
  TEXT_TYPE, TAG_TYPE, CLASS_TYPE, INSTANCE_TYPE
} = __webpack_require__(0)

module.exports = (nodes) => {

  return nodes.reduce((counter, node) => {

    if (node && node.type == INSTANCE_TYPE) {

      return counter + node.childDomNodesCount

    } else

    if (node && node.type == TEXT_TYPE || node && node.type == TAG_TYPE) {

      return counter + 1

    } else {

      return counter

    }

  }, 0)

}


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const mapNodes = __webpack_require__(49)

module.exports = (nodes, parentNode) => {

  if (!nodes) return []

  return mapNodes(nodes, (node) => {

    const isNodeRefExist = node && typeof node.ref == 'string'
    const isParentNodeHasInstance = parentNode && parentNode.instance

    if (isNodeRefExist && isParentNodeHasInstance) {

      return Object.assign({}, node, {
        ref: {
          instance: parentNode.instance,
          name: node.ref,
        }
      })

    }

    return node

  })

}


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const { flatten } = __webpack_require__(1)
const createNodes = __webpack_require__(42)
const createCallback = __webpack_require__(41)
const { sortLiveNodes, sortTemplateNodes } = __webpack_require__(20)
const decorateNodes = __webpack_require__(17)
const createNodesWithRefs = __webpack_require__(8)
const createTextNodes = __webpack_require__(40)

module.exports = (liveNodes, templateNodes, options) => {

  const filterNodes = (liveNodes, templateNodes, liveParentInstanceNode) => {

    const textTemplateNodes =
      createTextNodes(flatten([templateNodes]))

    const refsTemplateNodes =
      createNodesWithRefs(textTemplateNodes, liveParentInstanceNode)

    const sortedTemplateNodes =
      sortTemplateNodes(refsTemplateNodes)


    const decoratedLiveNodes =
      decorateNodes(flatten([liveNodes]), { order: true })

    const sortedLiveNodes =
      sortLiveNodes(decoratedLiveNodes, sortedTemplateNodes)

    return {
      filteredLiveNodes: sortedLiveNodes,
      filteredTemplateNodes: sortedTemplateNodes,
    }

  }

  const nodes =
    createNodes({
      liveNodes,
      templateNodes,
      createNode: createCallback,
      createOptions: {
        hooks: true,
        linkParent: true,
        childDomNodesCount: true,
        index: true
      },
      liveParentNode: options.liveParentNode || null,
      liveParentInstanceNode: options.liveParentInstanceNode || null,
      createContext: options.context || {},
      filterNodes,
    })

  return nodes

}


/***/ }),
/* 10 */
/***/ (function(module, exports) {

const loop = (node, callback, level = 0, index = 0) => {

  if (Array.isArray(node)) {

    return node.reduce((lastIndex, _node, index) => {

      return loop(_node, callback, level, lastIndex + 1)

    }, index)

  } else {

    callback(node, level, index)

    if (node && node.childs && node.childs.length > 0) {

      return loop(node.childs, callback, level + 1, index)

    } else {

      return index

    }

  }

}

module.exports = loop


/***/ }),
/* 11 */
/***/ (function(module, exports) {

const include = (array, value) => {
  return array.indexOf(value) > -1
}

module.exports = include


/***/ }),
/* 12 */
/***/ (function(module, exports) {

const checkers = {

  string: (param) => {
    return typeof param == 'string'
  },

  number: (param) => {
    return typeof param == 'number'
  },

  null: (param) => {
    return param === null
  },

  undefined: (param) => {
    return typeof param === 'undefined'
  },

  boolean: (param) => {
    return typeof param == 'boolean'
  },

  object: (param) => {
    return (
      typeof param == 'object' && !Array.isArray(param) && param != null
    )
  },

  array: (param) => {
    return Array.isArray(param)
  },

  function: (param) => {
    return typeof param == 'function'
  },

}

const kindOf = (param) => {
  for (const type in checkers) {
    if (checkers[type](param)) return type
  }
}

module.exports = kindOf


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const events = __webpack_require__(26)

module.exports = (props) => {

  return Object.keys(props).reduce((sortedProps, key) => {

    if (events.hasOwnProperty(key)) {

      const eventProps =
        Object.assign(
          {},
          sortedProps.eventProps,
          { [key]: props[key] }
        )

      return {
        eventProps,
        elementProps: sortedProps.elementProps,
      }

    } else {

      const elementProps =
        Object.assign(
          {},
          sortedProps.elementProps,
          { [key]: props[key] }
        )

      return {
        eventProps: sortedProps.eventProps,
        elementProps,
      }

    }

  }, { eventProps: {}, elementProps: {} })

}


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

const updateDomNode = __webpack_require__(30)
const updateNodes = __webpack_require__(31)

module.exports = ({ parentDomNode, patchNodes }) => {

  updateNodes({ patchNodes, parentDomNode, updateDomNode })

}


/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = (error, errorExists, errorNotExists) => {

  if (error) {

    errorExists(error)

  } else {

    errorNotExists()

  }

}


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

const { sortLiveNodes } = __webpack_require__(20)
const decorateNodes = __webpack_require__(17)
const createNodes = __webpack_require__(33)
const createCallback = __webpack_require__(32)

module.exports = ({ offset, liveNodes, templateNodes, domNodes }) => {

  const patchNodes = (
    createNodes({
      offset,
      limit: templateNodes.length,
      liveNodes,
      templateNodes,
      createNode: createCallback,
      domNodes,
      filterNodes: (liveNodes, templateNodes, { domNodes } = {}) => {

        const decoratedLiveNodes =
          decorateNodes(liveNodes, {
            order: { startFrom: offset },
            dom: domNodes
          })

        const decoratedTemplateNodes =
          decorateNodes(templateNodes, {
            order: { startFrom: offset }
          })

        return {
          filteredLiveNodes: sortLiveNodes(decoratedLiveNodes, templateNodes),
          filteredTemplateNodes: decoratedTemplateNodes
        }

      }
    })
  )

  return patchNodes


}


/***/ }),
/* 17 */
/***/ (function(module, exports) {

const decorateOrder = ({ startFrom, index }) => {
  return { order: startFrom + index }
}

const decorateDom = ({ dom, index }) => {
  return { dom: dom[index] }
}

module.exports = (nodes, { dom = false, order = false }) => {

  if (!nodes) return []

  return nodes.map((liveNode, index) => {

    const nodeOrder = order
      ? decorateOrder({ index, startFrom: order.startFrom || 0 })
      : {}

    const nodeDom = dom
      ? decorateDom({ dom, index })
      : {}

    return Object.assign({}, liveNode, nodeDom, nodeOrder)

  })

}


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

const { omit, flatten } = __webpack_require__(1)
const {
  ROOT_TYPE, TEXT_TYPE, TAG_TYPE, CLASS_TYPE, INSTANCE_TYPE
} = __webpack_require__(0)


const loop = (node, instance = null) => {

  if (Array.isArray(node)) {

    const newNodes = node.reduce((newNodes, _node) => {
      const newNode = loop(_node, instance)
      return (newNode) ? [ ...newNodes,  newNode] : newNodes
    }, [])

    return flatten(newNodes)

  } else

  if (node.type == TAG_TYPE) {

    return Object.assign({},
      omit(node, 'childs'),
      { instance },
      { childs: loop(node.childs, instance) }
    )

  } else

  if (node.type == TEXT_TYPE) {

    return Object.assign({}, { instance }, node)

  } else

  if (node.type == INSTANCE_TYPE) {

    return loop(node.childs, node.instance)

  } else

  if (node.type == ROOT_TYPE) {

    return loop(node.childs, instance)

  } else {

    return null

  }

}

module.exports = loop


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

const { omit } = __webpack_require__(1)

const addRef = (node, payload) => {

  node.ref.instance.refs =
    Object.assign({}, node.ref.instance.refs, {
      [node.ref.name]: payload
    })

}

const removeRef = (node) => {

  node.ref.instance.refs =
    omit(node.ref.instance.refs, node.ref.name)

}

module.exports = { addRef, removeRef }


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

const { flatten, include } = __webpack_require__(1)


const isKeyedNode = node => {
  return Boolean(node && node.key)
}


const getLivePairForTemplate = (liveNode, templateNode, keyedLiveNodes) => {

  if (isKeyedNode(templateNode)) {

    return keyedLiveNodes[templateNode.key] || null

  } else

  if (isKeyedNode(liveNode)) {

    return null

  } else

  if (!templateNode) {

    return null

  } else {

    return liveNode || null

  }
}


const wrapNodesWithTheirKeys = (nodes) => (
  nodes.reduce((keyedNodes, node) => (
    (node && node.key)
      ? Object.assign({}, keyedNodes, { [node.key]: node })
      : keyedNodes
  ), {})
)


const sortUsedLiveNodes = ({ liveNodes, templateNodes, keyedLiveNodes }) => {

  if (!templateNodes) return []

  return templateNodes.map((templateNode, index) => {

    return getLivePairForTemplate(
      liveNodes[index],
      templateNode,
      keyedLiveNodes
    )

  })

}


const sortUnusedLiveNodes = ({ liveNodes, usedOrderIndexes }) => {

  return liveNodes.filter((liveNode) => {

    return !include(usedOrderIndexes, liveNode.order)

  })

}


const sortLiveNodes = (liveNodes = [], templateNodes = []) => {

  const keyedLiveNodes = wrapNodesWithTheirKeys(liveNodes)

  const usedLiveNodes =
    sortUsedLiveNodes({
      liveNodes,
      templateNodes,
      keyedLiveNodes
    })

  const usedOrderIndexes =
    usedLiveNodes.reduce((indexes, usedLiveNode) => {
      return usedLiveNode ? [ ...indexes, usedLiveNode.order ] : indexes
    }, [])

  const unusedLiveNodes =
    sortUnusedLiveNodes({
      liveNodes,
      usedOrderIndexes
    })

  return [ ...usedLiveNodes, ...unusedLiveNodes ]

}


const sortTemplateNodes = (templateNodes = []) => {

  return flatten([templateNodes]).filter(node => node != null)

}


module.exports = {
  sortLiveNodes,
  sortTemplateNodes,
  wrapNodesWithTheirKeys,
  getLivePairForTemplate,
  isKeyedNode,
  sortUsedLiveNodes,
  sortUnusedLiveNodes,
}


/***/ }),
/* 21 */
/***/ (function(module, exports) {

const flatten = (items, newItems = []) => {

  for (const item of items) {

    if (Array.isArray(item)) {

      const _items = item

      newItems = flatten(_items, newItems)

    } else {

      newItems.push(item)

    }

  }

  return newItems
}

module.exports = flatten


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

const { CREATE_NODE, DELETE_NODE } = __webpack_require__(3)

module.exports = (actions) => {

  return actions.reduce((score, action) => {

    switch (action) {

      case CREATE_NODE: {

        return score + 1

      }

      case DELETE_NODE: {

        return score - 1

      }

      default: {

        return score

      }

    }

  }, 0)

}


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

const {
  INSERT_NODE, CREATE_NODE, UPDATE_NODE, REPLACE_NODE, DELETE_NODE
} = __webpack_require__(3)

const { TAG_TYPE, TEXT_TYPE } = __webpack_require__(0)

const actions = [
  {
    name: INSERT_NODE,
    check: ({ liveNode, templateNode }) => {
      return (
        liveNode &&
        templateNode &&
        liveNode.order != templateNode.order
      )
    },
  },
  {
    name: CREATE_NODE,
    check: ({ liveNode, templateNode }) => {
      return (
        !liveNode &&
        templateNode
      )
    }
  },
  {
    name: UPDATE_NODE,
    check: ({ liveNode, templateNode }) => {

      return (
        liveNode &&
        templateNode &&
        (
          liveNode.type == TAG_TYPE &&
          templateNode.type == TAG_TYPE &&
          liveNode.tag == templateNode.tag
          ||
          liveNode.type == TEXT_TYPE &&
          templateNode.type == TEXT_TYPE &&
          liveNode.text != templateNode.text
        )
      )
    }
  },
  {
    name: REPLACE_NODE,
    check: ({ liveNode, templateNode }) => {
      return (
        liveNode &&
        templateNode &&
        (
          liveNode.type != templateNode.type
          ||
          liveNode.type == TAG_TYPE &&
          templateNode.type == TAG_TYPE &&
          liveNode.tag != templateNode.tag
        )
      )
    }
  },
  {
    name: DELETE_NODE,
    check: ({ liveNode, templateNode }) => {
      return (
        liveNode &&
        !templateNode
      ) ? {} : false
    }
  },
]

module.exports = ({ liveNode, templateNode }) => {

  return actions.reduce((names, action) => {

    return action.check({ templateNode, liveNode })
      ? [ ...names, action.name ]
      : names

  }, [])

}


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

const { union } = __webpack_require__(1)
const isPropsEqual = __webpack_require__(28)

module.exports = (leftProps = {}, rightProps = {}) => {

  const keys = union(
    Object.keys(leftProps),
    Object.keys(rightProps)
  )

  return keys.reduce((sortedProps, key) => {

    if (leftProps.hasOwnProperty(key) && !rightProps.hasOwnProperty(key)) {

      return {
        addProps: sortedProps.addProps,
        removeProps: [
          ...sortedProps.removeProps,
          { key, value: leftProps[key] }
        ],
      }

    } else

    if (!leftProps.hasOwnProperty(key) && rightProps.hasOwnProperty(key)) {

      return {
        addProps: [
          ...sortedProps.addProps,
          { key, value: rightProps[key] }
        ],
        removeProps: sortedProps.removeProps,
      }

    } else {

      const addProps = (
        isPropsEqual(leftProps[key], rightProps[key])
          ? sortedProps.addProps
          : [
              ...sortedProps.addProps,
              { key, value: rightProps[key] }
            ]
      )

      return {
        addProps,
        removeProps: sortedProps.removeProps,
      }

    }

  }, { addProps: [], removeProps: [] })

}


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

const { TEXT_TYPE, TAG_TYPE } = __webpack_require__(0)
const sortProps = __webpack_require__(13)
const events = __webpack_require__(26)
const diffProps = __webpack_require__(24)

const updateProps = (
  domNode, liveProps, templateProps, { event = true, element = true } = {}
) => {

  const sortedLiveProps = sortProps(liveProps)
  const sortedTemplateProps = sortProps(templateProps)

  if (element) {

    updateElementProps(
      domNode,
      sortedLiveProps.elementProps,
      sortedTemplateProps.elementProps
    )

  }

  if (event) {

    updateEventProps(
      domNode,
      sortedLiveProps.eventProps,
      sortedTemplateProps.eventProps
    )

  }

}

const updateEventProps = (domNode, liveProps, templateProps) => {

  const { addProps, removeProps } = diffProps(liveProps, templateProps)

  addProps.forEach(prop => addEventProp(domNode, prop))
  removeProps.forEach(prop => removeEventProp(domNode, prop))

}

const updateElementProps = (domNode, liveProps, templateProps) => {

  const { addProps, removeProps } = diffProps(liveProps, templateProps)

  addProps.forEach((prop) => {

    const isPropsForAdd = (
      typeof prop.value == 'string' ||
      typeof prop.value == 'number' ||
      prop.value == true
    )

    if (isPropsForAdd) {

      const booleanProp = (prop.value === true) ? { value: '' } : {}

      const filteredProp = Object.assign({}, prop, booleanProp)

      addElementProp(domNode, filteredProp)

    } else {

      removeElementProp(domNode, prop)

    }

  })

  removeProps.forEach(prop => removeElementProp(domNode, prop))

}

const addElementProp = (domNode, prop) => {

  domNode.setAttribute(prop.key, prop.value)

}

const removeElementProp = (domNode, prop) => {

  domNode.removeAttribute(prop.key)

}

const addEventProp = (domNode, prop) => {

  domNode.addEventListener(events[prop.key], prop.value)

}

const removeEventProp = (domNode, prop) => {

  domNode.removeEventListener(events[prop.key], prop.value)

}

const createElement = (templateNode) => {

  switch (templateNode.type) {

    case TAG_TYPE: {

      const element = document.createElement(templateNode.tag)

      updateProps(element, {}, templateNode.props)

      return element
    }

    case TEXT_TYPE: {

      const element = document.createTextNode(templateNode.text)

      return element
    }

    default: {

      throw new Error('Unknown template node type:', templateNode.type)

    }

  }

}

const insertAt = (domNode, parentDomNode, order) => {

  const beforeDomNode =
    parentDomNode.childNodes[order]
      ? parentDomNode.childNodes[order]
      : parentDomNode.childNodes[parentDomNode.childNodes.length]

  parentDomNode.insertBefore(domNode, beforeDomNode)

}

module.exports = {
  updateProps,
  updateEventProps,
  updateElementProps,
  addElementProp,
  removeElementProp,
  addEventProp,
  removeEventProp,
  createElement,
  insertAt
}


/***/ }),
/* 26 */
/***/ (function(module, exports) {

// https://www.w3schools.com/jsref/dom_obj_event.asp

module.exports = {

  // Mouse Events
  onClick: 'click',
  onContextMenu: 'contextmenu',
  onDblClick: 'dblclick',
  onMouseDown: 'mousedown',
  onMouseEnter: 'mouseenter',
  onMouseLeave: 'mouseleave',
  onMouseMove: 'mousemove',
  onMouseOver: 'mouseover',
  onMouseOut: 'mouseout',
  onMouseUp: 'mouseup',

  // Keyboard Events
  onKeyDown: 'keydown',
  onKeyPress: 'keypress',
  onKeyUp: 'keyup',

  // Frame/Object Events
  onAbort: 'abort',
  onBeforeUnload: 'beforeunload',
  onError: 'error',
  onHashChange: 'hashchange',
  onLoad: 'load',
  onPagesShow: 'pageshow',
  onPageHide: 'pagehide',
  onResize: 'resize',
  onScroll: 'scroll',
  onUnload: 'unload',

  // Form Events
  onBlur: 'blur',
  onChange: 'change',
  onFocus: 'focus',
  onFocusIn: 'focusin',
  onFocusOut: 'focusout',
  onInput: 'input',
  onInvalid: 'invalid',
  onReset: 'reset',
  onSearch: 'search',
  onSelect: 'select',
  onSubmit: 'submit',

  // Drag Events
  onDrag: 'drag',
  onDragEnd: 'dragend',
  onDragEnter: 'dragenter',
  onDragLeave: 'dragleave',
  onDragOver: 'dragover',
  onDragStart: 'dragstart',
  onDrop: 'drop',

  // Clipboard Events
  onCopy: 'copy',
  onCut: 'cut',
  onPaste: 'paste',

  // Print Events
  onAfterPrint: 'afterprint',
  onBeforePrint: 'beforeprint',

  // Media Events
  onAbort: 'abort',
  onCanPlay: 'canplay',
  onCanPlayThrough: 'canplaythrough	',
  onDurationChange: 'durationchange',
  onEmptied: 'emptied',
  onEnded: 'ended',
  onError: 'error',
  onLoadedData: 'loadeddata',
  onLoadedMetadata: 'loadedmetadata',
  onLoadStart: 'loadstart',
  onPause: 'pause',
  onPlay: 'play',
  onPlaying: 'playing',
  onProgress: 'progress',
  onRateChange: 'ratechange',
  onSeeked: 'seeked',
  onSeeking: 'seeking',
  onStalled: 'stalled',
  onSuspend: 'suspend',
  onTimeUpdate: 'timeupdate',
  onVolumeChange: 'volumechange',
  onWaiting: 'waiting',

  // Animation Events
  animationEnd: 'animationend',
  animationIteration: 'animationiteration',
  animationStart: 'animationstart',

  // Transition Events
  transitionEnd: 'transitionend',

  // Server-Sent Events
  onError: 'error',
  onMessage: 'message',
  onOpen: 'open',

  // Misc Events
  onMessage: 'message',
  onOnline: 'online',
  onOffline: 'offline',
  onPopState: 'popstate',
  onShow: 'show',
  onStorage: 'storage',
  onToggle: 'toggle',
  onWheel: 'wheel',

  // Touch Events
  onTouchCancel: 'touchcancel',
  onTouchEnd: 'touchend',
  onTouchMove: 'touchmove',
  onTouchStart: 'touchstart',

}


/***/ }),
/* 27 */
/***/ (function(module, exports) {

const loop = (node, offsets, index = 0) => {

  if (index < offsets.length) {

    return loop(
      node.childNodes[offsets[index]],
      offsets,
      index + 1
    )

  } else {

    return node

  }

}

module.exports = loop


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

const { kindOf } = __webpack_require__(1)

module.exports = (leftProp, rightProp) => {

  const left = {
    prop: leftProp,
    type: kindOf(leftProp)
  }

  const right = {
    prop: rightProp,
    type: kindOf(rightProp)
  }

  if (left.type == right.type) {

    switch (left.type) {

      case 'function': {

        return left.prop.toString() == right.prop.toString()

        break
      }

      default: {

        return left.prop == right.prop

      }

    }

  } else {

    return false

  }


}


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

const { flatten } = __webpack_require__(1)
const { ROOT_TYPE, INSTANCE_TYPE } = __webpack_require__(0)
const createLiveTree = __webpack_require__(9)
const filterDomNodes = __webpack_require__(18)
const eachNodes = __webpack_require__(10)
const hookNode = __webpack_require__(6)
const { AFTER_DOM_CREATE } = __webpack_require__(5)
const createPatchTree = __webpack_require__(16)
const updateDomTree = __webpack_require__(14)

module.exports = (parentDomNode, liveNodes, templateNodes, context = {}) => {

  const templateNodesWithRoot = [
    {
      type: ROOT_TYPE,
      dom: parentDomNode,
      childs: flatten([templateNodes]),
    }
  ]

  const newLiveNodes =
    createLiveTree(
      liveNodes,
      templateNodesWithRoot,
      {
        hooks: true,
        context,
      }
    )

  const templateDomNodes =
    filterDomNodes(newLiveNodes)

  const patchNodes =
    createPatchTree({
      offset: 0,
      liveNodes: [],
      templateNodes: templateDomNodes,
      domNodes: [],
    })

  parentDomNode.innerHTML = ''

  updateDomTree({
    patchNodes,
    parentDomNode
  })

  eachNodes(newLiveNodes, (liveNode) => {

    if (liveNode.type == INSTANCE_TYPE) {

      hookNode(AFTER_DOM_CREATE, liveNode, null, null)

    }

  })

  return newLiveNodes

}


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

const { addRef, removeRef } = __webpack_require__(19)
const { createElement, insertAt, updateProps } = __webpack_require__(25)
const sortProps = __webpack_require__(13)
const {
  CREATE_NODE, UPDATE_NODE, DELETE_NODE, REPLACE_NODE, INSERT_NODE
} = __webpack_require__(3)
const { TEXT_TYPE } = __webpack_require__(0)

module.exports = ({
  actions,
  templateNode = null,
  liveNode = null,
  parentDomNode = null
}) => {

  if (actions.length == 0) return null

  const domNodes = actions.reduce((domNodes, action) => {

    switch (action) {

      case CREATE_NODE: {

        const newDom = createElement(templateNode)

        insertAt(newDom, parentDomNode, templateNode.order)

        if (templateNode.ref) {

          addRef(templateNode, newDom)

        }

        return [ ...domNodes, newDom ]

        break
      }

      case UPDATE_NODE: {

        if (liveNode.type == TEXT_TYPE) {

          liveNode.dom.nodeValue = templateNode.text

        } else {

          updateProps(liveNode.dom, liveNode.props, templateNode.props)

          if (templateNode.ref) {

            addRef(templateNode, liveNode.dom)

          }

        }

        return [ ...domNodes, liveNode.dom ]

        break
      }

      case DELETE_NODE: {

        parentDomNode.removeChild(liveNode.dom)

        if (liveNode.ref) {

          removeRef(liveNode)

        }

        return domNodes

        break
      }

      case REPLACE_NODE: {

        updateProps(liveNode.dom, {}, liveNode.props || {}, {
          element: false,
          event: true
        })

        const newDom = createElement(templateNode)

        if (templateNode.ref) {

          addRef(templateNode, newDom)

        } else

        if (liveNode.ref && !templateNode.ref) {

          removeRef(liveNode)

        }

        parentDomNode.replaceChild(newDom, liveNode.dom)

        return [ ...domNodes, newDom ]

        break
      }

      case INSERT_NODE: {

        insertAt(liveNode.dom, parentDomNode, liveNode.order)

        return [ ...domNodes, liveNode.dom ]

        break
      }

      default: {

        throw new Error('Unknown action type.')

      }

    }

  }, [])

  return domNodes[domNodes.length - 1] || null

}


/***/ }),
/* 31 */
/***/ (function(module, exports) {

const updateNodes = ({ patchNodes, parentDomNode, updateDomNode }) => {

  patchNodes.forEach((patchNode) => {

    const updateParams = Object.assign({}, patchNode, { parentDomNode })

    const domNode = updateDomNode(updateParams)

    if (patchNode.childs.length > 0) {

      updateNodes({
        patchNodes: patchNode.childs,
        parentDomNode: domNode,
        updateDomNode
      })

    }

  })

  return parentDomNode

}

module.exports = updateNodes


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

const { intersect } = __webpack_require__(1)
const countActionsScore = __webpack_require__(22)
const getNodeActions = __webpack_require__(23)
const { DELETE_NODE, REPLACE_NODE } = __webpack_require__(3)

module.exports = ({ liveNode, templateNode, limit }) => {

  const actions = getNodeActions({ liveNode, templateNode })

  const actionsScore = countActionsScore(actions)

  const nextLimit = limit + actionsScore

  const newLiveNode =
    intersect(actions, [ DELETE_NODE, REPLACE_NODE ]).length
      ? Object.assign({}, liveNode, { childs: [] })
      : liveNode

  const newTemplateNode =
    intersect(actions, [ DELETE_NODE ]).length
      ? Object.assign({}, templateNode, { childs: [] })
      : templateNode

  return {
    liveNode: newLiveNode,
    templateNode: newTemplateNode,
    limit,
    actions,
    nextLimit,
  }

}


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

const { times } = __webpack_require__(1)

const createNodes = ({
  offset = 0,
  limit = 0,
  liveNodes = [],
  templateNodes = [],
  domNodes = [],
  createNode,
  filterNodes = (liveNodes, templateNodes) => {
    return {
      filteredLiveNodes: liveNodes,
      filteredTemplateNodes: templateNodes
    }
  }
}) => {

  const { filteredLiveNodes, filteredTemplateNodes } = (
    filterNodes(liveNodes, templateNodes, { domNodes })
  )

  const maxLength = Math.max(
    filteredLiveNodes.length,
    filteredTemplateNodes.length
  )

  return times(maxLength).reduce((patchNodes, index) => {

    const templateNode = filteredTemplateNodes[index] || null
    const liveNode = filteredLiveNodes[index] || null
    const domNode = domNodes && domNodes[index] || null

    const prevPatchNode = patchNodes[patchNodes.length - 1]

    const lastLimit =
      prevPatchNode && prevPatchNode.nextLimit
        ? prevPatchNode.nextLimit
        : limit

    const patchNode =
      createNode({
        index,
        limit: lastLimit,
        offset,
        liveNode,
        templateNode,
      })

    const liveChilds = (
      patchNode.liveNode && patchNode.liveNode.childs || null
    )

    const templateChilds = (
      patchNode.templateNode && patchNode.templateNode.childs || null
    )

    const domChilds = (
      domNode && domNode.childNodes || null
    )

    const childs =
      createNodes({
        offset: 0,
        limit: liveChilds ? liveChilds.length : 0,
        liveNodes: liveChilds,
        templateNodes: templateChilds,
        createNode,
        filterNodes,
        domNodes: domChilds
      })

    return [ ...patchNodes, Object.assign({}, patchNode, { childs }) ]

  }, [])

}

module.exports = createNodes


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

const { flatten, pick } = __webpack_require__(1)
const hookNode = __webpack_require__(6)
const { INSTANCE_TYPE } = __webpack_require__(0)
const createNodesWithRefs = __webpack_require__(8)

module.exports = ({
  templateNode,
  context,
  afterRender,
  beforeRender
} = {}) => {

  const injectedContext = templateNode.class.injectContext
    ? pick(context, ...templateNode.class.injectContext())
    : {}

  const defaultProps = templateNode.class.defaultProps()

  const mergedProps = Object.assign({}, defaultProps, templateNode.props)

  const instance = new templateNode.class(mergedProps, injectedContext)

  if (beforeRender) beforeRender(instance)

  const childs = 'render' in instance && flatten([instance.render()]) || []

  const refParams = templateNode.ref
    ? { ref: templateNode.ref }
    : {}

  const newInstanceNode =
    Object.assign({}, {
      context,
      instance,
      type: INSTANCE_TYPE,
      ref: templateNode.ref,
      childs,
    }, refParams)

  instance.node = newInstanceNode

  return newInstanceNode

}


/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = ({ templateNode }) => {

  const newRootNode = {
    type: templateNode.type,
    dom: templateNode.dom,
    childs: templateNode.childs,
  }

  return newRootNode

}


/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = ({ templateNode }) => {

  const refParams =
    templateNode.ref
      ? { ref: templateNode.ref }
      : {}

    if (templateNode.tag == 'code') {

      // console.log(templateNode)

    }

  const newTagNode = {
    type: templateNode.type,
    tag: templateNode.tag,
    props: templateNode.props,
    childs: templateNode.childs,
  }

  return Object.assign({}, newTagNode, refParams)

}


/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = ({ templateNode }) => {

  const newTagNode = {
    type: templateNode.type,
    text: templateNode.text,
  }

  return newTagNode

}


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

const createRootNode = __webpack_require__(35)
const createInstanceNode = __webpack_require__(34)
const updateInstanceNode = __webpack_require__(39)
const createTagNode = __webpack_require__(36)
const createTextNode = __webpack_require__(37)
const handleError = __webpack_require__(15)

const {
  CREATE_ROOT, CREATE_TEXT, CREATE_TAG,
  CREATE_INSTANCE, UPDATE_INSTANCE, RESUME_INSTANCE
} = __webpack_require__(4)

module.exports = ({
  type = null,
  liveNode = null,
  templateNode = null,
  context = null,
  beforeRender = null,
}, callback) => {

  switch (type) {

    case CREATE_ROOT: {

      const newRootNode = createRootNode({ templateNode })

      return newRootNode

    }

    case CREATE_INSTANCE: {

      const newLiveNode =
        createInstanceNode({
          templateNode,
          context,
          beforeRender,
        })

      if (templateNode.ref) {

        templateNode.ref.instance.refs =
          Object.assign({}, templateNode.ref.instance.refs, {
            [templateNode.ref.name]: newLiveNode.instance
          })

      }

      return newLiveNode

    }

    case UPDATE_INSTANCE: {

      const newLiveNode =
        updateInstanceNode({
          liveNode,
          templateNode,
          context
        })

      return newLiveNode

    }

    case RESUME_INSTANCE: {

      return liveNode

    }

    case CREATE_TAG: {

      const newTagNode = createTagNode({ templateNode })

      return newTagNode

    }

    case CREATE_TEXT: {

      const newTextNode = createTextNode({ templateNode })

      return newTextNode

    }

    default: {

      throw new Error('Unrecognized create node type')

    }

  }


}


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

const { flatten, pick } = __webpack_require__(1)
const createNodesWithRefs = __webpack_require__(8)

module.exports = ({ liveNode, templateNode, context }) => {

  const liveType = liveNode.type
  const liveInstance = liveNode.instance

  liveInstance.prevProps = liveInstance.props
  liveInstance.prevState = liveInstance.state
  liveInstance.prevContext = liveInstance.context

  liveInstance.props = templateNode.props
  liveInstance.state = liveInstance.state

  const injectedContext =
    liveInstance.constructor.injectContext
      ? pick(context, ...liveInstance.constructor.injectContext())
      : {}

  liveInstance.context = injectedContext

  const childs = flatten([liveInstance.render() || null])

  const newInstanceNode = {
    context,
    type: liveType,
    instance: liveInstance,
    childs,
  }

  liveInstance.node = newInstanceNode

  return newInstanceNode

}


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

const { flatten } = __webpack_require__(1)
const { TEXT_TYPE } = __webpack_require__(0)

module.exports = (childs) => {

  return childs.map((node) => {

    if (typeof node == 'undefined') {

      return null

    } else

    if (typeof node != 'object' && node != null) {

      return {
        type: TEXT_TYPE,
        text: typeof node == 'number' ? node : node || '',
        childs: []
      }

    }

    return node

  })

}


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

const createNode = __webpack_require__(38)
const hookNode = __webpack_require__(6)
const getCreateAction = __webpack_require__(44)
const handleError = __webpack_require__(15)

const {
  BEFORE_EACH_ITERATION, BEFORE_INSTANCE_UPDATE, ON_INSTANCE_CREATE
} = __webpack_require__(5)

const {
  CREATE_ROOT, CREATE_TEXT, CREATE_TAG,
  CREATE_INSTANCE, UPDATE_INSTANCE, RESUME_INSTANCE
} = __webpack_require__(4)

module.exports = ({
  index,
  liveNode,
  templateNode,
  liveParentInstanceNode,
  options = {
    hooks: false
  },
  context = {}
}) => {

  if (options.hooks) {
    hookNode(
      BEFORE_EACH_ITERATION,
      liveNode,
      templateNode,
      context
    )
  }

  const createAction = getCreateAction(liveNode, templateNode)

  switch (createAction) {

    case CREATE_ROOT: {

      const newLiveNode =
        createNode({
          type: CREATE_ROOT,
          liveNode,
          templateNode,
        })

      return {
        newLiveNode,
        isNeedChilds: true,
        newContext: context,
        templateChilds: newLiveNode ? newLiveNode.childs : [],
        liveChilds: liveNode ? liveNode.childs : [],
        newLiveParentInstanceNode: liveParentInstanceNode,
      }

    }

    case CREATE_INSTANCE: {

      const newLiveNode =
        createNode({
          type: CREATE_INSTANCE,
          liveNode,
          templateNode,
          context,
          beforeRender: (instance) => {

            if (options.hooks) {
              hookNode(
                ON_INSTANCE_CREATE,
                { instance }
              )
            }

          }
        })

      const newContext =
        Object.assign(
          context,
          newLiveNode.instance.passContext()
        )

      return {
        newLiveNode,
        isNeedChilds: true,
        newContext,
        liveChilds: liveNode ? liveNode.childs : [],
        templateChilds: newLiveNode ? newLiveNode.childs : [],
        newLiveParentInstanceNode: newLiveNode,
      }

    }

    case UPDATE_INSTANCE: {

      if (options.hooks) {
        hookNode(
          BEFORE_INSTANCE_UPDATE,
          liveNode,
          templateNode,
          context
        )
      }

      const newLiveNode =
        createNode({
          type: UPDATE_INSTANCE,
          liveNode,
          templateNode,
          context,
        })

      const newContext =
        Object.assign(
          context,
          newLiveNode.instance.passContext()
        )

      return {
        newLiveNode,
        isNeedChilds: true,
        newContext,
        liveChilds: liveNode && liveNode.childs || [],
        templateChilds: newLiveNode.childs,
        newLiveParentInstanceNode: newLiveNode,
      }

    }

    case RESUME_INSTANCE: {

      const newLiveNode =
        createNode({
          type: RESUME_INSTANCE,
          liveNode,
          templateNode,
        })

      return {
        newLiveNode,
        isNeedChilds: false,
        newContext: context,
        newLiveParentInstanceNode: newLiveNode,
      }

    }

    case CREATE_TAG: {

      const newLiveNode =
        createNode({
          type: CREATE_TAG,
          liveNode,
          templateNode,
        })

      return {
        newLiveNode,
        newContext: context,
        isNeedChilds: true,
        liveChilds: liveNode ? liveNode.childs : [],
        templateChilds: templateNode ? templateNode.childs : [],
        newLiveParentInstanceNode: liveParentInstanceNode,
      }

    }

    case CREATE_TEXT: {

      const newLiveNode =
        createNode({
          type: CREATE_TEXT,
          liveNode,
          templateNode,
        })

      return {
        newLiveNode,
        isNeedChilds: false,
        newContext: context,
        newLiveParentInstanceNode: liveParentInstanceNode,
      }

      break
    }

    default: {

      return {
        newLiveNode: null,
        isNeedChilds: false,
        newContext: context,
        newLiveParentInstanceNode: null,
      }

    }

  }


}


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

const countDomNodes = __webpack_require__(7)

const createNodes = ({
  liveNodes = [],
  templateNodes = [],
  createNode,
  createOptions = {},
  createContext = {},
  liveParentNode = null,
  liveParentInstanceNode = null,
  filterNodes = (liveNodes, templateNodes, liveParentInstanceNode) => {
    return {
      filteredLiveNodes: liveNodes,
      filteredTemplateNodes: templateNodes
    }
  }
}) => {

  if (liveNodes.length + templateNodes.length == 0) return []

  const {
    filteredLiveNodes,
    filteredTemplateNodes
  } = filterNodes(liveNodes, templateNodes, liveParentInstanceNode)

  return filteredLiveNodes.reduce((newLiveNodes, liveNode, index) => {

    const templateNode = filteredTemplateNodes[index] || null

    const {
      newLiveNode,
      isNeedChilds,
      liveChilds,
      templateChilds,
      newContext,
      newLiveParentInstanceNode,
    } = createNode({
      index,
      liveNode,
      templateNode,
      options: createOptions,
      context: createContext,
      liveParentInstanceNode,
    })

    if (!newLiveNode) return newLiveNodes

    if (!isNeedChilds) return [ ...newLiveNodes, newLiveNode ]

    const childs =
      createNodes({
        liveParentNode: newLiveNode,
        liveParentInstanceNode: newLiveParentInstanceNode,
        liveNodes: liveChilds || [],
        templateNodes: templateChilds || [],
        createNode,
        createOptions,
        createContext: newContext,
        filterNodes,
        index
      })

    const nodeIndex =
      createOptions.index
        ? { index }
        : {}

    const childDomNodesCount  =
      createOptions.childDomNodesCount
        ? { childDomNodesCount: countDomNodes(childs) }
        : {}

    const childNodes = { childs }

    const parentNode =
      createOptions.linkParent
        ? { parent: liveParentNode }
        : {}

    const extendedLiveNode =
      Object.assign(
        newLiveNode,
        parentNode,
        childNodes,
        childDomNodesCount,
        nodeIndex
      )

    return [ ...newLiveNodes, extendedLiveNode ]

  }, [])

}

module.exports = createNodes


/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = (nodes) => {
  return nodes.reduce((offsets, node) => {
    return node.hasOwnProperty('offset')
      ? [ ...offsets, node.offset ]
      : offsets
  }, [])
}


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

const {
  ROOT_TYPE, TEXT_TYPE, TAG_TYPE, CLASS_TYPE, INSTANCE_TYPE
} = __webpack_require__(0)

const {
  CREATE_ROOT, CREATE_TAG, CREATE_TEXT,
  CREATE_INSTANCE, UPDATE_INSTANCE, RESUME_INSTANCE
} = __webpack_require__(4)

module.exports = (liveNode, templateNode) => {

  if (templateNode) {

    if (templateNode.type == ROOT_TYPE) {

      return CREATE_ROOT

    } else

    if (templateNode.type == TEXT_TYPE) {

      return CREATE_TEXT

    } else

    if (templateNode.type == TAG_TYPE) {

      return CREATE_TAG

    } else

    if (templateNode.type == CLASS_TYPE) {

      if (
        liveNode &&
        typeof liveNode == 'object' &&
        liveNode.type == INSTANCE_TYPE &&
        liveNode.instance instanceof templateNode.class
      ) {

        const props = templateNode.props
        const state = liveNode.instance.state

        if (liveNode.instance.isNeedUpdate(props, state)) {

          return UPDATE_INSTANCE

        } else {

          return RESUME_INSTANCE

        }

      } else {

        return CREATE_INSTANCE

      }

    }


  } else {

    return null

  }

}


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

const countDomNodes = __webpack_require__(7)
const { INSTANCE_TYPE } = __webpack_require__(0)

const loop = (node, nodes = [], offset = 0) => {

  if (node.parent) {

    if (node.parent.type == INSTANCE_TYPE) {

      const newOffset =
        countDomNodes(
          node.parent.childs.slice(0, node.index)
        ) + offset

      return (
        loop(
          node.parent,
          nodes,
          newOffset
        )
      )

    } else {

      const newOffset =
        countDomNodes(
          node.parent.childs.slice(0, node.index)
        ) + offset

      return (
        loop(
          node.parent,
          [
            Object.assign({}, node, { offset: newOffset }),
            ...nodes
          ],
          0
        )
      )

    }

  } else {

    return [ node, ...nodes ]

  }

}

module.exports = loop


/***/ }),
/* 46 */
/***/ (function(module, exports) {

// Before render dom

const callBeforeMount = (instance) => {

  if ('beforeMount' in instance) {

    instance.beforeMount()

  }


}

const callBeforeUpdate = (instance, nextProps, nextState, nextContext) => {

  if ('beforeUpdate' in instance) {

    instance.beforeUpdate(nextProps, nextState, nextContext)

  }

}

const callBeforeUnmount = (instance) => {

  if ('beforeUnmount' in instance) {

    instance.beforeUnmount()

  }

}

// After render dom

const callAfterMount = (instance) => {

  if ('afterMount' in instance) {

    instance.afterMount()

  }

}

const callAfterUpdate = (instance, prevProps, prevState, prevContext) => {

  if ('afterUpdate' in instance) {

    instance.afterUpdate(prevProps, prevState, prevContext)

  }

}

module.exports = {
  callBeforeMount,
  callBeforeUnmount,
  callBeforeUpdate,
  callAfterMount,
  callAfterUpdate
}


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

const { include, omit } = __webpack_require__(1)
const {
  TEXT_TYPE, TAG_TYPE, CLASS_TYPE, INSTANCE_TYPE
} = __webpack_require__(0)

const loop = (node, level = 0) => {

  const NEW_LINE = '\n'
  const INDENT = '  '.repeat(level)

  if (Array.isArray(node)) {

    return node.reduce((string, node) => {
      return string + loop(node, level)
    }, '')

  } else

  if (node.type == TEXT_TYPE) {

    return INDENT + node.text + NEW_LINE

  } else

  if (node.type == TAG_TYPE) {

    const childs = node.childs ? loop(node.childs, level + 1) : ''
    const props = omit(node.props, 'childs')

    return (
      INDENT +
      node.tag +
      '(' + JSON.stringify(props) + ')' +
      NEW_LINE +
      childs
    )


  } else

  if (node.type == CLASS_TYPE) {

    const childs = node.childs ? loop(node.childs, level + 1) : ''
    const props = omit(node.props, 'childs')

    return (
      INDENT +
      node.class.name +
      '(' + JSON.stringify(props) + ')' +
      NEW_LINE +
      childs
    )

  } else

  if (node.type == INSTANCE_TYPE) {

    const childs = node.childs ? loop(node.childs, level + 1) : ''
    const props = omit(node.instance.props, 'childs')

    return (
      INDENT +
      node.instance.constructor.name.toLowerCase() +
      '(' + JSON.stringify(props) + ')' +
      ' ' +
      JSON.stringify(node.instance.state) +
      NEW_LINE +
      childs
    )

  }

  return ''

}

module.exports = loop


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

const {
  ROOT_TYPE, TEXT_TYPE, TAG_TYPE, CLASS_TYPE, INSTANCE_TYPE
} = __webpack_require__(0)

module.exports = (liveNode, templateNode) => {

  switch (liveNode.type) {

    case ROOT_TYPE: {

      return false

    }

    case INSTANCE_TYPE: {

      if (
        templateNode && templateNode.type == CLASS_TYPE &&
        liveNode.instance instanceof templateNode.class
      ) {

        return false

      } else {

        return true

      }

      break
    }

    case TAG_TYPE: {

      if (
        templateNode &&
        templateNode.type == TAG_TYPE &&
        templateNode.tag == liveNode.tag
      ) {

        return false

      } else {

        return true

      }

      break
    }

    case TEXT_TYPE: {

      if (
        templateNode && 
        templateNode.type == TEXT_TYPE &&
        templateNode.text == liveNode.text
      ) {

        return false

      } else {

        return true

      }

      break
    }

    default: {

      return false

    }


  }

}


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

const { kindOf } = __webpack_require__(1)

const loop = (node, callback) => {

  const nodeType = kindOf(node)

  if (nodeType == 'array') {

    return node.map((_node) => {

      return loop(_node, callback)

    })

  } else

  if (nodeType == 'object') {

    const childs =
      node && node.childs && node.childs.length > 0
        ? loop(node.childs, callback)
        : []

    const newChilds = node.childs ? { childs } : {}

    return Object.assign({}, callback(node), newChilds)

  } else {

    return node

  }

}

module.exports = loop


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./action/__tests/countActionsScore.spec.js": 66,
	"./action/__tests/getNodeActions.spec.js": 67,
	"./dom/__tests/diffProps.spec.js": 68,
	"./dom/__tests/domActions.spec.js": 69,
	"./dom/__tests/findDomNode.spec.js": 70,
	"./dom/__tests/isPropsEqual.spec.js": 71,
	"./dom/__tests/render.spec.js": 72,
	"./dom/__tests/sortProps.spec.js": 73,
	"./dom/__tests/updateTree/index.spec.js": 74,
	"./dom/__tests/updateTree/updateCallback.spec.js": 75,
	"./dom/__tests/updateTree/updateNodes.spec.js": 76,
	"./helpers/__tests/handleError.spec.js": 77,
	"./patch/__tests/createTree/createCallback.spec.js": 78,
	"./patch/__tests/createTree/createNodes.spec.js": 79,
	"./patch/__tests/createTree/index.spec.js": 80,
	"./virtual/__tests/Component.spec.js": 81,
	"./virtual/__tests/assignDomNodes.spec.js": 82,
	"./virtual/__tests/countDomNodes.spec.js": 83,
	"./virtual/__tests/createNodesWithRefs.spec.js": 84,
	"./virtual/__tests/createTextNodes.spec.js": 85,
	"./virtual/__tests/decorateNodes.spec.js": 86,
	"./virtual/__tests/eachNodes.spec.js": 87,
	"./virtual/__tests/filterDomNodes.spec.js": 88,
	"./virtual/__tests/filterNodesOffsets.spec.js": 89,
	"./virtual/__tests/getCreateAction.spec.js": 90,
	"./virtual/__tests/getParentNodes.spec.js": 91,
	"./virtual/__tests/humanizeNodes.spec.js": 92,
	"./virtual/__tests/isNodeForUnmount.spec.js": 93,
	"./virtual/__tests/mapNodes.spec.js": 94,
	"./virtual/__tests/refs.spec.js": 95,
	"./virtual/__tests/sortNodes.spec.js": 96,
	"./virtual/createNode/__tests/createInstanceNode.spec.js": 98,
	"./virtual/createNode/__tests/createRootNode.spec.js": 99,
	"./virtual/createNode/__tests/createTagNode.spec.js": 100,
	"./virtual/createNode/__tests/createTextNode.spec.js": 101,
	"./virtual/createNode/__tests/index.spec.js": 102,
	"./virtual/createNode/__tests/updateInstanceNode.spec.js": 103,
	"./virtual/createTree/__tests/createCallback.spec.js": 104,
	"./virtual/createTree/__tests/createNodes.spec.js": 105,
	"./virtual/createTree/__tests/index.spec.js": 106,
	"./virtual/hookNode/__tests/hooks.spec.js": 107,
	"./virtual/hookNode/__tests/index.spec.js": 108,
	"./virtual/html/__tests/index.spec.js": 109
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 50;

/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports = (items, mapper, callback) => {

  if (items.length == 0) return callback(null, [])

  let counter = 0

  let results = []

  items.forEach((item, index) => {

    new Promise((resolve, reject) => {

      mapper(item, index, (error, result) => {

        if (error) {

          reject(error)

        } else {

          resolve(result)

        }

      })

    }).then((result) => {

      results[index] = result

      if (items.length == ++counter)
        callback(null, results)

    }).catch((error) => {

      callback(error, null)

    })

  })

}


/***/ }),
/* 52 */
/***/ (function(module, exports) {

module.exports = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

const flatten = __webpack_require__(21)
const kindOf = __webpack_require__(12)
const include = __webpack_require__(11)

module.exports = (...args) => {

  const unpackObjects = (args) => {

    return args.map((arg) => {

      const argType = kindOf(arg)

      if (argType == 'array') {

        return unpackObjects(arg)

      } else

      if (argType == 'object') {

        return Object.keys(arg).map((key) => {

          return arg[key] ? key : false

        })

      } else {

        return arg

      }

    })

  }

  return (
    flatten( unpackObjects(args) )
      .filter((arg) => {
        return include(['number', 'string'], typeof arg)
      })
      .join(' ')
  )

}


// const flattenNames = flatten(args)
//
// const objectNames = flattenNames.map((arg) => {
//
//   if(kindOf(arg) == 'object') {
//
//     Object.keys(arg).map((key) => {
//
//       if (arg[key]) {
//
//         return key
//
//       }
//
//       return false
//
//     })
//
//   }
//
//   return arg
//
// })
//
// const cleanedClassNames =
//
// return classNames..join(' ')


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

const kindOf = __webpack_require__(12)
const include = __webpack_require__(11)

const clone = (argument) => {

  const argumentType = kindOf(argument)


  if (argumentType == 'object') {

    const object = argument

    const newObject = {}

    for (const key in object) {

      const value = object[key]

      const valueType = kindOf(value)

      if (include(['array','object'], valueType)) {

        newObject[key] = clone(value)

      } else {

        newObject[key] = value

      }

    }

    return newObject

  } else


  if (argumentType == 'array') {

    const array = argument

    const newArray = []

    for (const value of array) {

      const valueType = kindOf(value)

      if (include(['array','object'], valueType)) {

        newArray.push(clone(value))

      } else {

        newArray.push(value)

      }

    }

    return newArray


  } else {

    throw new Error('Cloned argument should be type of Array or Object.')

  }

}

module.exports = clone


/***/ }),
/* 55 */
/***/ (function(module, exports) {

module.exports = (...methods) => {

  return (result) => {

    return methods.reduceRight((result, method) => {

      return method(result)

    }, result)

  }

}


/***/ }),
/* 56 */
/***/ (function(module, exports) {

module.exports = (items, match) => {

  const loop = (items, index) => {

    if (index == -1) return -1

    return match(items[index])
      ? index
      : loop(items, index - 1)
  }

  return loop(items, items.length - 1)

}


/***/ }),
/* 57 */
/***/ (function(module, exports) {

module.exports = (array) => {

  return array[0]

}


/***/ }),
/* 58 */
/***/ (function(module, exports) {

const OPEN_QUOTE_SPECIAL = '&lt;'
const CLOSE_QUOTE_SPECIAL = '&gt;'

const OPEN_QUOTE_SIMPLE = '<'
const CLOSE_QUOTE_SIMPLE = '>'

const SPECIAL_TO_SIMPLE = {
  [OPEN_QUOTE_SPECIAL]:  OPEN_QUOTE_SIMPLE,
  [CLOSE_QUOTE_SPECIAL]: CLOSE_QUOTE_SIMPLE
}

const SIMPLE_TO_SPECIAL = {
  [OPEN_QUOTE_SIMPLE]:  OPEN_QUOTE_SPECIAL,
  [CLOSE_QUOTE_SIMPLE]: CLOSE_QUOTE_SPECIAL
}

const SIMPLE_QUOTES =
  new RegExp(OPEN_QUOTE_SIMPLE + '|' + CLOSE_QUOTE_SIMPLE, 'g')

const SPECIAL_QUOTES =
  new RegExp(OPEN_QUOTE_SPECIAL + '|' + CLOSE_QUOTE_SPECIAL, 'g')

const encode = (string) => (
  string.replace(SIMPLE_QUOTES, match => SIMPLE_TO_SPECIAL[match])
)

const decode = (string) => (
  string.replace(SPECIAL_QUOTES, match => SPECIAL_TO_SIMPLE[match])
)

module.exports = { encode, decode }


/***/ }),
/* 59 */
/***/ (function(module, exports) {

module.exports = (left, right) => {

  if (!Array.isArray(left) || !Array.isArray(right)) return null

  return left.reduce((values, value) => {

    return right.indexOf(value) > -1
      ? [ ...values, value ]
      : values

  }, [])

}


/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports = (array) => {

  return array[array.length - 1]

}


/***/ }),
/* 61 */
/***/ (function(module, exports) {

const omit = (object, ...keys) => {
  const newObject = {}
  Object.keys(object).forEach((key) => {
    if (keys.indexOf(key) == -1)
      newObject[key] = object[key]
  })
  return newObject

}

module.exports = omit


/***/ }),
/* 62 */
/***/ (function(module, exports) {

const pick = (object, ...keys) => {
  const newObject = {}
  keys.forEach((key) => {
    if (key in object)
      newObject[key] = object[key]
  })
  return newObject
}

module.exports = pick


/***/ }),
/* 63 */
/***/ (function(module, exports) {

module.exports = (count) => {

  return [...Array(count).keys()]

}


/***/ }),
/* 64 */
/***/ (function(module, exports) {

const union = (first, second) => {
  return first.concat(
    second.filter((key) => first.indexOf(key) == -1)
  )
}

module.exports = union


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

const context = __webpack_require__(50)
context.keys().forEach(context)


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

const {
  INSERT_NODE, CREATE_NODE, UPDATE_NODE, REPLACE_NODE, DELETE_NODE
} = __webpack_require__(3)
const countActionsScore = __webpack_require__(22)

describe('Count actions score for', () => {

  it('create action', () => {
    expect(
      countActionsScore([ CREATE_NODE ])
    ).toBe(1)
  })

  it('delete action', () => {
    expect(
      countActionsScore([ DELETE_NODE ])
    ).toBe(-1)
  })

  it('other actions', () => {
    expect(
      countActionsScore([ INSERT_NODE, UPDATE_NODE, REPLACE_NODE ])
    ).toBe(0)
  })

})


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

const getNodeActions = __webpack_require__(23)
const {
  INSERT_NODE, CREATE_NODE, UPDATE_NODE, REPLACE_NODE, DELETE_NODE
} = __webpack_require__(3)
const {
  TAG_TYPE, TEXT_TYPE
} = __webpack_require__(0)

describe('Get node actions', () => {

  it('move node', () => {

    expect(
      getNodeActions({
        liveNode: { order: 1 },
        templateNode: { order: 2 },
      })
    ).toEqual([ INSERT_NODE ])

  })

  it('create node', () => {

    expect(
      getNodeActions({
        liveNode: null,
        templateNode: {},
      })
    ).toEqual([ CREATE_NODE ])

  })

  it('update tag node', () => {

    expect(
      getNodeActions({
        liveNode: {
          type: TAG_TYPE,
        },
        templateNode: {
          type: TAG_TYPE,
        },
      })
    ).toEqual([ UPDATE_NODE ])

  })

  it('update node for text', () => {

    expect(
      getNodeActions({
        liveNode: {
          type: TEXT_TYPE,
          text: 'text',
        },
        templateNode: {
          type: TEXT_TYPE,
          text: 'text 1',
        },
      })
    ).toEqual([ UPDATE_NODE ])

  })

  it('replace node', () => {

    expect(
      getNodeActions({
        liveNode: {
          type: TAG_TYPE,
        },
        templateNode: {
          type: TEXT_TYPE,
        },
      })
    ).toEqual([ REPLACE_NODE ])

  })

  it('delete node', () => {

    expect(
      getNodeActions({
        liveNode: {},
        templateNode: null,
      })
    ).toEqual([ DELETE_NODE ])

  })

})


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

const diffProps = __webpack_require__(24)

describe('Get props diff for', () => {

  it('addProps props for string, number, boolean', () => {

    expect(
      diffProps(
        {
          a: 'a',
          b: 1,
          c: true,
        },
        {
          a: 'b',
          b: 2,
          c: false,
        }
      )
    ).toEqual({
      addProps: [
        { key: 'a', value: 'b' },
        { key: 'b', value: 2 },
        { key: 'c', value: false },
      ],
      removeProps: []
    })

  })

  it('addProps props for function', () => {

    const propsDiff = diffProps(
      {
        a: () => true
      },
      {
        a: () => false
      }
    )

    expect(
      propsDiff.addProps[0].value.toString()
    ).toEqual(
      '() => false'
    )

  })

  it('delete props for string, number, boolean', () => {

    expect(
      diffProps(
        {
          a: 'a',
          b: 1,
          c: true,
        },
        {}
      )
    ).toEqual({
      addProps: [],
      removeProps: [
        { key: 'a', value: 'a' },
        { key: 'b', value: 1 },
        { key: 'c', value: true },
      ]
    })

  })

  it('delete props for function', () => {

    const propsDiff = diffProps(
      {
        a: () => true
      },
      {}
    )

    expect(
      propsDiff.removeProps[0].value.toString()
    ).toEqual(
      '() => true'
    )

  })



})


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

const { TEXT_TYPE, TAG_TYPE } = __webpack_require__(0)

const {
  updateProps,
  updateEventProps,
  updateElementProps,
  addElementProp,
  removeElementProp,
  addEventProp,
  removeEventProp,
  createElement,
  insertAt
} = __webpack_require__(25)

describe('Dom actions', () => {

  it('Add element prop', () => {

    const domNode = document.createElement('div')
    addElementProp(domNode, { key: 'id', value: '1' })
    expect(domNode.id).toBe('1')

  })

  it('Remove element prop', () => {

    const domNode = document.createElement('div')
    domNode.id = 1
    removeElementProp(domNode, { key: 'id' })
    expect(domNode.id).toBe('')

  })

  it('Add event prop', () => {

    let id = 0

    const domNode = document.createElement('div')
    addEventProp(domNode, { key: 'onClick', value: () => { id = 1 } })
    domNode.click()
    expect(id).toBe(1)

  })

  it('Remove event prop', () => {

    let id = 0

    const handleClick = () => { id++ }

    const domNode = document.createElement('div')
    domNode.addEventListener('click', handleClick)
    domNode.click()
    expect(id).toBe(1)

    removeEventProp(domNode, { key: 'onClick', value: handleClick })
    domNode.click()
    expect(id).toBe(1)

  })

  it('Update element props', () => {

    const domNode = document.createElement('div')

    domNode.setAttribute('id', 1)
    domNode.setAttribute('class', 'test')

    updateElementProps(
      domNode,
      { id: 0, class: 'test' },
      { id: 1, class: false, selected: true }
    )

    expect(domNode.id).toBe('1')
    expect(domNode.className).toBe('')
    expect(domNode.getAttribute('selected')).toBe('')

  })


  it('Update event props', () => {

    let id = 0

    const domNode = document.createElement('div')

    updateEventProps(
      domNode,
      { onClick: () => { id = -1 } },
      { onClick: () => { id = 1 } }
    )

    domNode.click()

    expect(id).toBe(1)

  })

  it('Update only event props', () => {

    let id = 0

    const domNode = document.createElement('div')
    domNode.id = '0'

    updateProps(
      domNode,
      { id: 0 },
      { id: 1, onClick: () => { id = 1 } },
      { event: true, element: false }
    )

    domNode.click()

    expect(id).toBe(1)
    expect(domNode.id).toBe('0')

  })

  it('Update only element props', () => {

    let id = 0

    const domNode = document.createElement('div')
    domNode.id = '0'

    updateProps(
      domNode,
      { id: 0 },
      { id: 1, onClick: () => { id = 1 } },
      { event: false, element: true }
    )

    domNode.click()

    expect(id).toBe(0)
    expect(domNode.id).toBe('1')

  })

  it('Create tag element', () => {

    const domNode =
      createElement({
        type: TAG_TYPE,
        tag: 'div',
        props: { id: 1, class: 'test' }
      })

    expect(domNode.id).toBe('1')
    expect(domNode.className).toBe('test')
    expect(domNode.nodeType).toBe(1)

  })

  it('Create text element', () => {

    const domNode =
      createElement({
        type: TEXT_TYPE,
        text: 'test'
      })

    expect(domNode.nodeType).toBe(3)
    expect(domNode.textContent).toBe('test')

  })

  it('Insert at exisiting place', () => {

    const domNode = document.createElement('span')

    const parentDomNode = document.createElement('div')
    parentDomNode.appendChild( document.createElement('p') )
    parentDomNode.appendChild( document.createElement('p') )

    insertAt(domNode, parentDomNode, 1)

    expect(parentDomNode.childNodes[1].isSameNode(domNode)).toBe(true)

  })

  it('Insert at not exisiting place', () => {

    const domNode = document.createElement('span')

    const parentDomNode = document.createElement('div')

    insertAt(domNode, parentDomNode, 2)

    expect(parentDomNode.childNodes[0].isSameNode(domNode)).toBe(true)

  })

})


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

const findDomNode = __webpack_require__(27)

describe('Find node by offset', () => {

  it('return dom node', () => {

    const createDiv = () => document.createElement('div')

    const parentNode = createDiv()
    const targetNode = createDiv()

    parentNode.appendChild( createDiv() )
    parentNode.appendChild( createDiv() )

    parentNode.childNodes[1].appendChild( createDiv() )
    parentNode.childNodes[1].appendChild( createDiv() )
    parentNode.childNodes[1].appendChild( createDiv() )

    parentNode.childNodes[1].childNodes[2].appendChild( createDiv() )
    parentNode.childNodes[1].childNodes[2].appendChild( createDiv() )
    parentNode.childNodes[1].childNodes[2].appendChild( createDiv() )
    parentNode.childNodes[1].childNodes[2].appendChild( targetNode )

    const findedNode = findDomNode(parentNode, [1,2,3])

    expect(
      findedNode.isEqualNode(targetNode)
    ).toBe(true)

  })

})


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

const isPropsEqual = __webpack_require__(28)

describe('Is props equal for', () => {

  describe('function', () => {

    it('equal', () => {

      expect(
        isPropsEqual(
          () => { return 1 },
          () => { return 1 }
        )
      ).toBe(true)

    })

    it('not equal', () => {

      expect(
        isPropsEqual(
          () => { return 1 },
          () => { return 2 }
        )
      ).toBe(false)

    })

  })

  describe('string', () => {

    it('equal', () => {

      expect(
        isPropsEqual(
          'hello',
          'hello'
        )
      ).toBe(true)

    })

    it('not equal', () => {

      expect(
        isPropsEqual(
          'hello',
          'world'
        )
      ).toBe(false)

    })

  })

  describe('number', () => {

    it('equal', () => {

      expect(
        isPropsEqual(
          1,
          1
        )
      ).toBe(true)

    })

    it('not equal', () => {

      expect(
        isPropsEqual(
          1,
          2
        )
      ).toBe(false)

    })

  })

  describe('boolean', () => {

    it('equal', () => {

      expect(
        isPropsEqual(
          true,
          true
        )
      ).toBe(true)

    })

    it('not equal', () => {

      expect(
        isPropsEqual(
          true,
          false
        )
      ).toBe(false)

    })

  })

})


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

const render = __webpack_require__(29)

const { TEXT_TYPE, TAG_TYPE } = __webpack_require__(0)

describe('Render dom', () => {

  it('example', () => {

    const parentDomNode = document.createElement('div')

    const templateNodes = [
      {
        type: TAG_TYPE,
        tag: 'div',
        props: { id: 1 },
        childs: []
      },
      {
        type: TAG_TYPE,
        tag: 'div',
        props: { id: 2 },
        childs: [
          {
            type: TEXT_TYPE,
            text: 'hello world',
          },
          {
            type: TAG_TYPE,
            tag: 'div',
            props: { id: '2.1' },
            childs: []
          },
        ]
      },
      {
        type: TAG_TYPE,
        tag: 'div',
        props: { id: 3 },
        childs: []
      },
    ]

    const newLiveNodes = render(parentDomNode, [], templateNodes)

    expect(parentDomNode.childNodes[0].id).toBe('1')
    expect(parentDomNode.childNodes[1].id).toBe('2')
    expect(
      parentDomNode.childNodes[1].childNodes[0].textContent
    ).toBe('hello world')
    expect(parentDomNode.childNodes[1].childNodes[1].id).toBe('2.1')
    expect(parentDomNode.childNodes[2].id).toBe('3')


  })

})


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

const sortProps = __webpack_require__(13)

describe('Sort props', () => {

  it('for element props', () => {

    const elementProps = {
      id: 'orange',
      style: 'color: orange',
    }

    expect(
      sortProps(elementProps)
    ).toEqual({
      elementProps: elementProps,
      eventProps: {}
    })

  })

  it('for event props', () => {

    const eventProps = {
      onClick: () => { console.log('click') },
      onKeyDown: () => { console.log('key down') }
    }

    expect(
      sortProps(eventProps)
    ).toEqual({
      elementProps: {},
      eventProps: eventProps,
    })

  })

})


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

const updateDomTree = __webpack_require__(14)
const {
  CREATE_NODE, UPDATE_NODE, DELETE_NODE, REPLACE_NODE, INSERT_NODE
} = __webpack_require__(3)
const {
  TAG_TYPE, TEXT_TYPE
} = __webpack_require__(0)


describe('Update dom tree', () => {

  it('create node', () => {

    const parentDomNode = document.createElement('div')

    const patchNodes = [
      {
        templateNode: {
          type: TAG_TYPE,
          tag: 'div',
          props: {},
          childs: []
        },
        actions: [
          CREATE_NODE
        ],
        childs: []
      }
    ]

    updateDomTree({ patchNodes, parentDomNode })

    expect(
      parentDomNode.childNodes[0].tagName
    ).toBe('DIV')

  })

})


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

const updateNode = __webpack_require__(30)
const {
  CREATE_NODE, UPDATE_NODE, DELETE_NODE, REPLACE_NODE, INSERT_NODE
} = __webpack_require__(3)
const {
  TAG_TYPE, TEXT_TYPE
} = __webpack_require__(0)

describe('Update dom callback', () => {

  it('create node', () => {

    const parentDomNode = document.createElement('div')

    const actions = [ CREATE_NODE ]

    let instance = { refs: {} }

    const templateNode = {
      type: TAG_TYPE,
      tag: 'div',
      props: { id: 1 },
      childs: [],
      ref: {
        name: 'div',
        instance,
      }
    }

    const newDomNode =
      updateNode({ actions, templateNode, parentDomNode })

    expect(
      parentDomNode.childNodes[0].isSameNode(newDomNode)
    ).toBeTruthy()

    expect(
      instance.refs.div.isSameNode(newDomNode)
    ).toBe(true)


  })

  it('update text node', () => {

    const actions = [ UPDATE_NODE ]

    const domNode = document.createTextNode('text')

    const liveNode = {
      type: TEXT_TYPE,
      text: 'text',
      dom: domNode,
    }

    const templateNode = {
      type: TEXT_TYPE,
      text: 'text2',
    }

    const newDomNode = updateNode({ actions, templateNode, liveNode })

    expect(
      newDomNode.isSameNode(domNode)
    ).toBeTruthy()

    expect(newDomNode.nodeValue).toBe('text2')

  })

  it('update tag node', () => {

    let instance = { refs: {} }

    const actions = [ UPDATE_NODE ]

    const domNode = document.createElement('div')

    domNode.setAttribute('id', '1')

    const liveNode = {
      type: TAG_TYPE,
      tag: 'div',
      props: { id: 1 },
      childs: [],
      dom: domNode,
    }

    const templateNode = {
      type: TAG_TYPE,
      tag: 'div',
      props: { id: 2 },
      ref: {
        name: 'div',
        instance,
      },
      childs: [],
    }

    const newDomNode = updateNode({ actions, templateNode, liveNode })

    expect(
      newDomNode.isSameNode(domNode)
    ).toBeTruthy()

    expect(newDomNode.id).toBe('2')

    expect(
      instance.refs.div.isSameNode(domNode)
    ).toBe(true)

  })

  it('delete node', () => {

    const actions = [ DELETE_NODE ]

    const parentDomNode = document.createElement('div')

    const domNode = document.createElement('span')

    parentDomNode.appendChild( domNode )

    const liveNode = {
      type: TAG_TYPE,
      tag: 'span',
      props: { id: 1, onClick: () => {} },
      childs: [],
      dom: domNode,
    }

    const newDomNode = updateNode({ actions, liveNode, parentDomNode })

    expect(parentDomNode.childNodes.length).toBe(0)

  })

  it('delete node with it ref', () => {

    let instance = { refs: { span: {} } }

    const actions = [ DELETE_NODE ]

    const parentDomNode = document.createElement('div')

    const domNode = document.createElement('span')

    parentDomNode.appendChild( domNode )

    const liveNode = {
      type: TAG_TYPE,
      tag: 'span',
      props: { id: 1, onClick: () => {} },
      childs: [],
      dom: domNode,
      ref: {
        instance,
        name: 'span',
      }
    }

    const newDomNode = updateNode({ actions, liveNode, parentDomNode })

    expect(instance.refs.span).toBeUndefined()

  })

  it('replace node', () => {

    const parentDomNode = document.createElement('div')

    const oldDomNode = document.createElement('div')

    parentDomNode.appendChild( oldDomNode )

    const actions = [ REPLACE_NODE ]

    const liveNode = {
      type: TAG_TYPE,
      tag: 'div',
      props: {},
      childs: [],
      dom: oldDomNode
    }

    const templateNode = {
      type: TAG_TYPE,
      tag: 'span',
      props: {},
      childs: []
    }

    const newDomNode =
      updateNode({
        actions,
        templateNode,
        liveNode,
        parentDomNode
      })

    expect(newDomNode.tagName).toBe('SPAN')

  })

  it('replace node with add ref', () => {

    const parentDomNode = document.createElement('div')

    const oldDomNode = document.createElement('div')

    parentDomNode.appendChild( oldDomNode )

    let instance = { ref: {} }

    const actions = [ REPLACE_NODE ]

    const liveNode = {
      type: TAG_TYPE,
      tag: 'div',
      props: {},
      childs: [],
      dom: oldDomNode
    }

    const templateNode = {
      type: TAG_TYPE,
      tag: 'span',
      props: {},
      childs: [],
      ref: {
        name: 'span',
        instance
      },
    }

    const newDomNode =
      updateNode({
        actions,
        templateNode,
        liveNode,
        parentDomNode
      })

    expect(
      instance.refs.span.tagName
    ).toBe('SPAN')

  })

  it('replace node with remove ref', () => {

    const parentDomNode = document.createElement('div')

    const oldDomNode = document.createElement('div')

    parentDomNode.appendChild( oldDomNode )

    let instance = { refs: { div: document.createElement('div') } }

    const actions = [ REPLACE_NODE ]

    const liveNode = {
      type: TAG_TYPE,
      tag: 'div',
      props: {},
      childs: [],
      dom: oldDomNode,
      ref: {
        name: 'div',
        instance,
      }
    }

    const templateNode = {
      type: TAG_TYPE,
      tag: 'span',
      props: {},
      childs: [],
    }

    const newDomNode =
      updateNode({
        actions,
        templateNode,
        liveNode,
        parentDomNode
      })

    expect(
      instance.refs.div
    ).toBeUndefined()

  })

  it('insert node', () => {

    const parentDomNode = document.createElement('div')

    const oldDomNode = document.createElement('span')

    const actions = [ INSERT_NODE ]

    const liveNode = {
      type: TAG_TYPE,
      tag: 'span',
      props: {},
      childs: [],
      dom: oldDomNode,
      order: 0
    }

    const insertedNode =
      updateNode({ actions, parentDomNode, liveNode })

    expect(
      parentDomNode.childNodes[0].isSameNode(insertedNode)
    ).toBeTruthy()

    expect(
      insertedNode.isSameNode(oldDomNode)
    ).toBeTruthy()

  })

  it('nothing actions', () => {

    const actions = []

    expect(
      updateNode({ actions })
    ).toBeNull()


  })

  it('unknow action node', () => {

    const JAMES_BOND = '007'

    const actions = [ JAMES_BOND ]

    expect(
      () => { updateNode({ actions }) }
    ).toThrowError()

  })


})


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

const { omit } = __webpack_require__(1)
const { CREATE_NODE } = __webpack_require__(3)
const updateNodes = __webpack_require__(31)

describe('Update dom nodes, call update callback', () => {

  it('with patch node and parent dom node', () => {

    const parentDomNode = { tagName: 'div' }

    const patchNodes = [{ templateNode: { tag: 'div' }, childs: [] }]

    const spy = { updateDomNode: () => {} }

    spyOn(spy, 'updateDomNode')

    updateNodes({ patchNodes, parentDomNode, updateDomNode: spy.updateDomNode })

    const args = spy.updateDomNode.calls.allArgs()[0][0]

    expect(args.parentDomNode).toEqual(parentDomNode)
    expect(args.templateNode).toEqual(patchNodes[0].templateNode)

  })

  it('with dom node from result of update node', () => {

    const parentDomNodes = [{ tagName: 'div' }, { tagName: 'span' }]

    const patchNodes = [
      {
        templateNode: { tag: 'div' },
        childs: [
          {
            templateNode: { tag: 'div' },
            childs: []
          }
        ]
      }
    ]

    const spy = { updateDomNode: () => { return parentDomNodes[1] } }

    spyOn(spy, 'updateDomNode').and.callThrough()

    updateNodes({
      patchNodes,
      parentDomNode: parentDomNodes[0],
      updateDomNode: spy.updateDomNode
    })

    const args = spy.updateDomNode.calls.allArgs()[1][0]
    expect(args.parentDomNode).toEqual(parentDomNodes[1])

  })

})


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

const handleError = __webpack_require__(15)

describe('Handle error', () => {

  it('call errorExists() with error argument', () => {

    const spy = { errorExists: () => {} }

    const error = new Error('Some error')

    spyOn(spy, 'errorExists').and.callThrough()

    handleError(error, spy.errorExists)

    expect(
      spy.errorExists.calls.allArgs()
    ).toEqual([[error]])

  })

  it('call errorNotExists() when error doesn\'t present', () => {

    const spy = { errorNotExists: () => {} }

    spyOn(spy, 'errorNotExists').and.callThrough()

    handleError(null, null, spy.errorNotExists)

    expect(
      spy.errorNotExists.calls.allArgs()
    ).toEqual([[]])

  })

})


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

const createNode = __webpack_require__(32)
const {
  TEXT_TYPE, TAG_TYPE
} = __webpack_require__(0)

describe('Create patch node', () => {

  it('copy liveNode, templateNode, limit', () => {

    const patchNode =
      createNode({
        liveNode: {},
        templateNode: {},
        limit: 0,
      })

    expect(patchNode.liveNode).toEqual({})
    expect(patchNode.templateNode).toEqual({})
    expect(patchNode.limit).toEqual(0)

  })

  it('calculate nextLimit', () => {

    const patchNode =
      createNode({
        liveNode: {
          type: TAG_TYPE,
          props: {},
          childs: [],
        },
        templateNode: null,
        limit: 2,
      })

    expect(patchNode.nextLimit).toBe(1)

  })

  it('calculate node actions', () => {

    const patchNode =
      createNode({
        liveNode: {
          type: TAG_TYPE,
          props: {},
          childs: [],
        },
        templateNode: null,
        limit: 2,
      })

    expect(patchNode.actions.length).toBe(1)

  })

})


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

const { omit } = __webpack_require__(1)
const createNodes = __webpack_require__(33)
const { TEXT_TYPE, TAG_TYPE } = __webpack_require__(0)

describe('Create patch nodes', () => {

  it('filter nodes', () => {

    const allNodes = [
      { id: 1, childs: [] },
      { id: 2, childs: [] },
      { id: 3, childs: [] }
    ]

    const patchNodes =
      createNodes({
        limit: 0,
        domNodes: allNodes,
        liveNodes: allNodes,
        templateNodes: allNodes,
        filterNodes: (liveNodes, templateNodes) => {

          const compareNodes = (a, b) => a.id < b.id

          return {
            filteredLiveNodes: liveNodes.sort(compareNodes),
            filteredTemplateNodes: templateNodes.sort(compareNodes),
          }
        },
        createNode: ({ templateNode, liveNode }) => {
          return { templateNode, liveNode }
        },
      })

    expect(patchNodes).toEqual([
      {
        templateNode: { id: 3, childs: [] },
        liveNode: { id: 3, childs: [] },
        childs: [],
      },
      {
        templateNode: { id: 2, childs: [] },
        liveNode: { id: 2, childs: [] },
        childs: [],
      },
      {
        templateNode: { id: 1, childs: [] },
        liveNode: { id: 1, childs: [] },
        childs: [],
      },
    ])

  })

  it('call createNode for childs with all arguments', () => {

    const allNodes = [
      {
        type: TAG_TYPE,
        tag: 'div',
        childs: [
          {
            type: TAG_TYPE,
            tag: 'span',
            childs: [
              {
                type: TEXT_TYPE,
                text: 'text',
                childs: [],
              }
            ]
          },
          {
            type: TAG_TYPE,
            tag: 'p',
            childs: [],
          }
        ],
      }
    ]

    const patchNodes =
      createNodes({
        limit: 0,
        liveNodes: allNodes,
        templateNodes: allNodes,
        createNode: params => params,
      })

    expect(patchNodes).toEqual([
      {
        index: 0,
        limit: 0,
        offset: 0,
        liveNode: allNodes[0],
        templateNode: allNodes[0],
        childs: [
          {
            index: 0,
            limit: 2,
            offset: 0,
            liveNode: allNodes[0].childs[0],
            templateNode: allNodes[0].childs[0],
            childs: [
              {
                index: 0,
                limit: 1,
                offset: 0,
                liveNode: allNodes[0].childs[0].childs[0],
                templateNode: allNodes[0].childs[0].childs[0],
                childs: [],
              },
            ],
          },
          {
            index: 1,
            limit: 2,
            offset: 0,
            liveNode: allNodes[0].childs[1],
            templateNode: allNodes[0].childs[1],
            childs: [],
          },
        ]
      }
    ])


  })




  it('call createNode with last returned limit', () => {

    const allNodes = [{ childs: [] }, { childs: [] }, { childs: [] }]

    const patchNodes =
      createNodes({
        limit: 0,
        domNodes: allNodes,
        liveNodes: allNodes,
        templateNodes: allNodes,
        createNode: (params) => {
          return Object.assign({}, params, { nextLimit: params.index + 1 })
        },
      })

    expect(patchNodes[0].nextLimit).toBe(1)
    expect(patchNodes[1].nextLimit).toBe(2)
    expect(patchNodes[2].nextLimit).toBe(3)

  })

  it('call createNode with index argument', () => {

    const allNodes = [{ childs: [] }, { childs: [] }]

    const patchNodes =
      createNodes({
        domNodes: allNodes,
        liveNodes: allNodes,
        templateNodes: allNodes,
        createNode: params => params,
      })

      expect(patchNodes[0].index).toEqual(0)
      expect(patchNodes[1].index).toEqual(1)

  })

  it('call createNode with limit argument', () => {

    const allNodes = [{ childs: [] }, { childs: [] }]

    const patchNodes =
      createNodes({
        limit: 2,
        domNodes: allNodes,
        liveNodes: allNodes,
        templateNodes: allNodes,
        createNode: params => params,
      })

    expect(patchNodes[0].limit).toBe(2)
    expect(patchNodes[1].limit).toBe(2)


  })

  it('call createNode with offset argument', () => {

    const allNodes = [{ childs: [] }, { childs: [] }]

    const patchNodes =
      createNodes({
        offset: 2,
        domNodes: allNodes,
        liveNodes: allNodes,
        templateNodes: allNodes,
        createNode: params => params,
      })

    expect(patchNodes[0].offset).toBe(2)
    expect(patchNodes[1].offset).toBe(2)

  })

})


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

const createTree = __webpack_require__(16)
const {
  TEXT_TYPE, TAG_TYPE
} = __webpack_require__(0)
const {
  INSERT_NODE, CREATE_NODE, UPDATE_NODE, REPLACE_NODE, DELETE_NODE
} = __webpack_require__(3)

describe('Create patch tree', () => {

  it('update actions', () => {

    const domNodes = [
      { childs: [] },
      { childs: [] },
      { childs: [] },
      { childs: [] }
    ]

    const liveNodes = [
      {
        type: TAG_TYPE,
        tag: 'div',
        props: {},
        childs: []
      },
      {
        type: TEXT_TYPE,
        text: 'some text',
        childs: []
      },
      {
        type: TAG_TYPE,
        tag: 'div',
        props: { id: 1 },
        childs: [],
        key: 1
      },
      {
        type: TAG_TYPE,
        tag: 'p',
        props: { id: 1 },
        childs: [],
        key: 2
      },
      {
        type: TAG_TYPE,
        tag: 'p',
        props: { id: 1 },
        childs: [],
      },
    ]

    const templateNodes = [
      {
        type: TAG_TYPE,
        tag: 'p',
        props: { id: 1 },
        childs: []
      },
      {
        type: TEXT_TYPE,
        text: 'some another text',
        childs: []
      },
      {
        type: TAG_TYPE,
        tag: 'div',
        props: { id: 1 },
        key: 1,
        childs: [],
      },
      {
        type: TAG_TYPE,
        tag: 'p',
        props: { id: 1 },
        key: 3,
        childs: [],
      },
      {
        type: TAG_TYPE,
        tag: 'p',
        props: { id: 1 },
        key: 2,
        childs: [],
      },
    ]

    const patchNodes =
      createTree({
        domNodes,
        liveNodes,
        templateNodes,
      })

    expect(patchNodes[0].actions).toEqual([ REPLACE_NODE ])
    expect(patchNodes[1].actions).toEqual([ UPDATE_NODE ])
    expect(patchNodes[2].actions).toEqual([ UPDATE_NODE ])
    expect(patchNodes[3].actions).toEqual([ CREATE_NODE ])
    expect(patchNodes[4].actions).toEqual([ INSERT_NODE, UPDATE_NODE ])
    expect(patchNodes[5].actions).toEqual([ DELETE_NODE ])

  })

})


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

const {
  TEXT_TYPE, TAG_TYPE, INSTANCE_TYPE, CLASS_TYPE
} = __webpack_require__(0)
const Component = __webpack_require__(2)
const render = __webpack_require__(29)

describe('Component', () => {

  it('v() helper create node', () => {

    class App extends Component {}

    expect(
      App.v({ id: 1, ref: 'app' }, 'test')
    ).toEqual({
      type: CLASS_TYPE,
      props: {
        id: 1,
        childs: [
          'test'
        ]
      },
      class: App,
      ref: 'app'
    })

  })

  it('update state', () => {

    class App extends Component {

      constructor(props) {
        super(props)
        this.state = { count: 0 }
      }

      render() {
        return [
          {
            type: TAG_TYPE,
            tag: 'div',
            props: {},
            childs: [
              {
                type: TEXT_TYPE,
                text: this.state.count
              }
            ]
          }
        ]
      }

    }

    const templateNodes = [
      {
        type: CLASS_TYPE,
        class: App,
        props: {},
        childs: []
      }
    ]

    const rootDomNode = document.createElement('div')

    const liveNodes = render(rootDomNode, [], templateNodes)

    const instance = liveNodes[0].childs[0].instance

    instance.setState({ count: instance.state.count + 1 })

    expect(
      rootDomNode.childNodes[0].childNodes[0].textContent
    ).toBe('1')


  })

})


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

const assignDomNodes = __webpack_require__(97)

describe('Assign dom nodes', () => {

  it('return new array', () => {

    const liveNodes = [
      {
        tag: 'div',
        childs: [
          {
            tag: 'div',
            childs: []
          },
          {
            tag: 'div',
            childs: []
          },
        ]
      }
    ]

    const domNodes = [
      {
        id: 1,
        childNodes: [
          {
            id: 2,
            childNodes: []
          },
          {
            id: 3,
            childNodes: []
          },
        ]
      }
    ]

    assignDomNodes({ liveNodes, domNodes })

    expect(liveNodes[0].dom.id).toBe(1)
    expect(liveNodes[0].childs[0].dom.id).toBe(2)
    expect(liveNodes[0].childs[1].dom.id).toBe(3)

  })

})


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

const countDomNodes = __webpack_require__(7)
const {
  TEXT_TYPE, TAG_TYPE, CLASS_TYPE, INSTANCE_TYPE
} = __webpack_require__(0)

describe('Count dom nodes for', () => {

  it('null', () => {

    expect(
      countDomNodes([null])
    ).toBe(0)

  })

  it('text', () => {

    expect(
      countDomNodes([{ type: TEXT_TYPE, text: 'Hello world' }])
    ).toBe(1)

  })

  it('tag', () => {

    expect(
      countDomNodes([{ type: TAG_TYPE, tag: 'div' }])
    ).toBe(1)

  })

  it('object', () => {

    expect(
      countDomNodes([{ type: INSTANCE_TYPE, childDomNodesCount: 1 }])
    ).toBe(1)

  })

  it('multiple nodes', () => {

    expect(
      countDomNodes([
        null,
        { type: TEXT_TYPE },
        { type: TAG_TYPE },
        { type: INSTANCE_TYPE, childDomNodesCount: 1 },

      ])
    ).toBe(3)

  })

})


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

const createNodesWithRefs = __webpack_require__(8)

describe('Create nodes with refs', () => {

  it('return new array ob ojects with asigned instance and ref name', () => {

    expect(
      createNodesWithRefs([{ ref: 'test' }], { instance: 'instance' })
    ).toEqual([
      {
        ref: {
          name: 'test',
          instance: 'instance'
        },
      }
    ])

  })

})


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

const createTextNodes = __webpack_require__(40)
const { TAG_TYPE, TEXT_TYPE } = __webpack_require__(0)

describe('Create child nodes', () => {

  it('return one level nesting array with tag and text nodes', () => {

    const newNodes =
      createTextNodes([
        'test',
        {
          type: TAG_TYPE,
          tag: 'div',
          props: {},
          childs: []
        },
        false,
        true,
        123,
        undefined
      ])

    expect(newNodes).toEqual([
      {
        type: TEXT_TYPE,
        text: 'test',
        childs: []
      },
      {
        type: TAG_TYPE,
        tag: 'div',
        props: {},
        childs: []
      },
      {
        type: TEXT_TYPE,
        text: '',
        childs: []
      },
      {
        type: TEXT_TYPE,
        text: true,
        childs: []
      },
      {
        type: TEXT_TYPE,
        text: 123,
        childs: []
      },
      null
      ,
    ])

  })

})


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

const decorateNodes = __webpack_require__(17)
const { TAG_TYPE, TEXT_TYPE } = __webpack_require__(0)

describe('Decorate live nodes', () => {

  it('decorate with order with startFrom param', () => {

    const liveNodes = [{}, {}]

    const decoratedNodes =
      decorateNodes(liveNodes, { order: { startFrom: 2 } })

    expect(
      decoratedNodes[0].order
    ).toBe(2)

    expect(
      decoratedNodes[1].order
    ).toBe(3)

  })

  it('decorate with order', () => {

    const liveNodes = [{}, {}]

    const decoratedNodes = decorateNodes(liveNodes, { order: true })

    expect(
      decoratedNodes[0].order
    ).toBe(0)

    expect(
      decoratedNodes[1].order
    ).toBe(1)


  })

  it('decorate with dom node', () => {

    const liveNodes = [
      {
        type: TAG_TYPE,
        tag: 'div',
      },
      {
        type: TEXT_TYPE,
        text: 'text',
      }
    ]

    const textNode = document.createTextNode('text')
    const tagNode = document.createElement('div')

    const domNodes = [ tagNode, textNode ]

    const decoratedNodes = decorateNodes(liveNodes, { dom: domNodes })

    expect(
      decoratedNodes[0].dom.isSameNode(tagNode)
    ).toBe(true)

    expect(
      decoratedNodes[1].dom.isSameNode(textNode)
    ).toBe(true)

  })

})


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

const eachNodes = __webpack_require__(10)

describe('Virtual tree iterate', () => {

  it('call function at each iteration', () => {

    const virtualTree = {
      name: 'div',
      props: {},
      childs: [
        'example',
        {
          name: new Object,
          props: {},
          childs: [
            {
              name: Object,
              props: {},
              childs: []
            },
          ]
        },
        'example',
      ]
    }

    const assertions = [
      (element, level) => {
        return level == 0 && element.name == 'div'
      },
      (element, level) => {
        return level == 1 && element == 'example'
      },
      (element, level) => {
        return level == 1 && element.name instanceof Object
      },
      (element, level) => {
        return level == 2 && element.name == Object
      },
      (element, level) => {
        return level == 1 && element == 'example'
      },

    ]

    eachNodes(virtualTree, (virtualElement, level, index) => {

      expect(
        assertions[index](virtualElement, level)
      ).toBe(true)

    })

  })

})


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

const filterDomNodes = __webpack_require__(18)
const {
  ROOT_TYPE, TEXT_TYPE, TAG_TYPE, INSTANCE_TYPE, CLASS_TYPE
} = __webpack_require__(0)

describe('Get virtual DOM elements:', () => {

  it('pass parent instance to all nodes', () => {

    const nodes = [
      {
        type: INSTANCE_TYPE,
        instance: { id: 1 },
        childs: [
          {
            type: TAG_TYPE,
            id: 1,
            childs: [
              {
                type: INSTANCE_TYPE,
                instance: { id: 2 },
                childs: [
                  {
                    id: 2,
                    type: TAG_TYPE,
                    childs: [
                      {
                        id: 3,
                        type: TEXT_TYPE,
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]

    const domNodes = filterDomNodes(nodes)

    expect(domNodes[0].instance).toEqual({ id: 1 })
    expect(domNodes[0].childs[0].instance).toEqual({ id: 2 })
    expect(domNodes[0].childs[0].childs[0].instance).toEqual({ id: 2 })

  })

  it('by array', () => {

    const nodes = [
      {
        type: ROOT_TYPE,
        childs: [
          {
            type: INSTANCE_TYPE,
            childs: [
              {
                type: TAG_TYPE,
                tag: 'div',
                childs: [
                  {
                    type: INSTANCE_TYPE,
                    childs: [
                      {
                        type: TEXT_TYPE,
                        text: 'text',
                      },
                    ]
                  }
                ]
              },
            ]
          },
          {
            type: TAG_TYPE,
            text: 'div',
            childs: []
          },
        ]
      }
    ]

    const willBe = [
      {
        type: TAG_TYPE,
        tag: 'div',
        instance: null,
        childs: [
          {
            type: TEXT_TYPE,
            instance: null,
            text: 'text',
          },        ]
      },
      {
        type: TAG_TYPE,
        instance: null,
        text: 'div',
        childs: []
      },
    ]

    expect(
      filterDomNodes(nodes)
    ).toEqual(willBe)
  })

})


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

const filterNodesOffsets = __webpack_require__(43)

describe('Filter nodes offsets', () => {

  it('return array of numbers', () => {
    expect(
      filterNodesOffsets([
        {},
        { offset: 0 },
        { offset: 1 },
        { offset: 2 },
      ])
    ).toEqual([0,1,2])

  })

})


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

const getCreateAction = __webpack_require__(44)

const {
  CREATE_ROOT, CREATE_TAG, CREATE_TEXT,
  CREATE_INSTANCE, UPDATE_INSTANCE, RESUME_INSTANCE
} = __webpack_require__(4)

const {
  ROOT_TYPE, TEXT_TYPE, TAG_TYPE, CLASS_TYPE, INSTANCE_TYPE
} = __webpack_require__(0)

describe('Get create action:', () => {

  it('create root', () => {

    expect(
      getCreateAction(null, { type: ROOT_TYPE, childs: [] })
    ).toBe(CREATE_ROOT)

  })

  it('create text', () => {

    expect(
      getCreateAction(null, { type: TEXT_TYPE, text: 'some text' })
    ).toBe(CREATE_TEXT)

  })

  it('create tag', () => {

    expect(
      getCreateAction(null, { type: TAG_TYPE, tag: 'div' })
    ).toBe(CREATE_TAG)

  })

  it('create instance with existed live node', () => {

    expect(
      getCreateAction(
        { type: INSTANCE_TYPE, instance: new Date },
        { type: CLASS_TYPE, class: Array }
      )
    ).toBe(CREATE_INSTANCE)

  })

  it('create instance with null live node', () => {

    expect(
      getCreateAction(
        null,
        { type: CLASS_TYPE, class: Array }
      )
    ).toBe(CREATE_INSTANCE)

  })

  it('update instance', () => {

    expect(
      getCreateAction(
        { type: INSTANCE_TYPE, instance: { isNeedUpdate: () => true } },
        { type: CLASS_TYPE, class: Object }
      )
    ).toBe(UPDATE_INSTANCE)

  })

  it('resume instance', () => {

    expect(
      getCreateAction(
        { type: INSTANCE_TYPE, instance: { isNeedUpdate: () => false } },
        { type: CLASS_TYPE, class: Object }
      )
    ).toBe(RESUME_INSTANCE)

  })



})


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

const {
  ROOT_TYPE, TEXT_TYPE, TAG_TYPE, INSTANCE_TYPE, CLASS_TYPE
} = __webpack_require__(0)

const Component = __webpack_require__(2)

const createLiveTree = __webpack_require__(9)

const getParentNodes = __webpack_require__(45)

describe('Get instance update info', () => {

  it('array of numbers', () => {

    class App3 extends Component {

      render() {
        return null
      }

    }

    class App2 extends Component {

      render() {
        return [
          {
            type: TAG_TYPE,
            childs: []
          },
          // 2
          {
            type: TAG_TYPE,
            childs: [
              {
                type: TAG_TYPE,
                childs: []
              },
              {
                type: TAG_TYPE,
                childs: []
              },
              {
                type: TAG_TYPE,
                childs: []
              },
              // 3
              {
                type: CLASS_TYPE,
                class: App3,
                childs: []
              },
            ]
          },
        ]
      }

    }

    class App1 extends Component {

      render() {
        return [
          // 1
          {
            type: TAG_TYPE,
            childs: [
              {
                type: TAG_TYPE,
                childs: []
              },
              {
                type: CLASS_TYPE,
                class: App2,
              },
              {
                type: TAG_TYPE,
                childs: []
              },
            ]
          },
          {
            type: TAG_TYPE,
            childs: []
          },
        ]
      }

    }

    const templateNodes = [
      {
        type: ROOT_TYPE,
        liveRootDom: { name: 'liveRootDom' },
        childs: [
          {
            type: TAG_TYPE,
            childs: []
          },
          {
            type: CLASS_TYPE,
            class: App1,
          }
        ],
      }
    ]

    const newLiveNodes = createLiveTree([], templateNodes, {})


    const targetNode = (
      newLiveNodes[0].childs[1].childs[0].childs[1].childs[1].childs[3]
    )

    const parentNodes = getParentNodes(targetNode)

    expect(
      parentNodes.map(node => node.offset)
    ).toEqual([undefined, 1,2,3])

  })

})


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

const humanizeNodes = __webpack_require__(47)

const {
  TEXT_TYPE, TAG_TYPE, CLASS_TYPE, INSTANCE_TYPE
} = __webpack_require__(0)

describe('Humanize virtual tree', () => {

  it('valid string', () => {

    class App {

      constructor(props) {
        this.props = props
        this.state = { active: true }
      }

    }

    const virtualTree = [
      {
        type: TAG_TYPE,
        tag: 'div',
        props: { id: 1 },
        childs: [
          {
            type: TEXT_TYPE,
            text: 'Hello world!',
          },
          {
            type: TAG_TYPE,
            tag: 'div',
            props: { id: 2 },
            childs: [],
          },
          {
            type: CLASS_TYPE,
            class: App,
            props: { id: 3 },
            childs: [],
          },
          {
            type: INSTANCE_TYPE,
            instance: new App({ id: 4 }),
            childs: [],
          },
        ]
      },
    ]

    expect(
      humanizeNodes(virtualTree)
    ).toBe(
      'div({"id":1})\n' +
      '  Hello world!\n' +
      '  div({"id":2})\n' +
      '  App({"id":3})\n' +
      '  app({"id":4}) {"active":true}\n'
    )

  })


})


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

const {
  TEXT_TYPE, TAG_TYPE, CLASS_TYPE, INSTANCE_TYPE
} = __webpack_require__(0)

const isNodeForUnmount = __webpack_require__(48)

describe('Is node for unmount for', () => {

  it('return false for unknow node type', () => {
    expect(
      isNodeForUnmount(
        {
          type: 123,
        },
        {
          type: TEXT_TYPE
        }
      )
    ).toBe(false)
  })

  describe('live text', () => {

    it('template text with same text', () => {
      expect(
        isNodeForUnmount(
          {
            type: TEXT_TYPE,
            text: 'example',
          },
          {
            type: TEXT_TYPE,
            text: 'example',
          }
        )
      ).toBe(false)
    })

    it('template text with different text', () => {
      expect(
        isNodeForUnmount(
          {
            type: TEXT_TYPE,
            text: 'example',
          },
          {
            type: TEXT_TYPE,
            text: 'example 2',
          }
        )
      ).toBe(true)
    })

    it('template tag', () => {
      expect(
        isNodeForUnmount(
          {
            type: TEXT_TYPE,
          },
          {
            type: TAG_TYPE,
          }
        )
      ).toBe(true)
    })

    it('template class', () => {

      class App {}

      expect(
        isNodeForUnmount(
          {
            type: TEXT_TYPE,
          },
          {
            type: CLASS_TYPE,
            class: App,
          }
        )
      ).toBe(true)
    })

  })

  describe('live tag', () => {

    it('template text', () => {
      expect(
        isNodeForUnmount(
          {
            type: TAG_TYPE,
          },
          {
            type: TEXT_TYPE,
          }
        )
      ).toBe(true)
    })

    it('template same tag', () => {
      expect(
        isNodeForUnmount(
          {
            type: TAG_TYPE,
            tag: 'p',
          },
          {
            type: TAG_TYPE,
            tag: 'p',
          }
        )
      ).toBe(false)
    })

    it('template different tag', () => {
      expect(
        isNodeForUnmount(
          {
            type: TAG_TYPE,
            tag: 'p',
          },
          {
            type: TAG_TYPE,
            tag: 'div',
          }
        )
      ).toBe(true)
    })

    it('template class', () => {
      expect(
        isNodeForUnmount(
          {
            type: TAG_TYPE,
          },
          {
            type: CLASS_TYPE,
          }
        )
      ).toBe(true)
    })

  })

  describe('live instance', () => {

    it('template text', () => {
      expect(
        isNodeForUnmount(
          {
            type: INSTANCE_TYPE,
          },
          {
            type: TEXT_TYPE,
          }
        )
      ).toBe(true)
    })

    it('template tag', () => {
      expect(
        isNodeForUnmount(
          {
            type: INSTANCE_TYPE,
          },
          {
            type: TAG_TYPE,
          }
        )
      ).toBe(true)
    })

    it('template same class', () => {

      class App {}

      expect(
        isNodeForUnmount(
          {
            type: INSTANCE_TYPE,
            instance: new App,
          },
          {
            type: CLASS_TYPE,
            class: App,
          }
        )
      ).toBe(false)
    })

    it('template different class', () => {

      class App {}
      class App2 {}

      expect(
        isNodeForUnmount(
          {
            type: INSTANCE_TYPE,
            instance: new App,
          },
          {
            type: CLASS_TYPE,
            class: App2,
          }
        )
      ).toBe(true)
    })

  })

})


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

const mapNodes = __webpack_require__(49)

describe('Map nodes', () => {

  it('return new tree of nodes', () => {

    const nodes = [
      {
        id: 1,
        childs: [
          {
            id: 2,
            childs: [],
          },
          'some text',
          {
            id: 3,
            childs: [],
          },
        ]
      }
    ]

    const newNodes = mapNodes(nodes, (node) => {

      return Object.assign({}, node, { id: node.id * 2 })

    })

    expect(newNodes).toEqual([
      {
        id: 2,
        childs: [
          {
            id: 4,
            childs: [],
          },
          'some text',
          {
            id: 6,
            childs: [],
          },
        ]
      }
    ])

  })

})


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

const { addRef, removeRef } = __webpack_require__(19)

describe('Ref', () => {

  it('add', () => {

    let instance = {
      refs: {}
    }

    const node = {
      ref: {
        name: 'test',
        instance,
      }
    }

    addRef(node, { name: 'test', instance: node.ref.instance })

    expect(instance.refs.test).toBeTruthy()

  })

  it('remove', () => {

    let instance = {
      refs: {
        test: true
      }
    }

    const node = {
      ref: {
        name: 'test',
        instance,
      }
    }

    removeRef(node)

    expect(instance.refs.test).toBeUndefined()
  })

})


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

const {
  isKeyedNode,
  getLivePairForTemplate,
  wrapNodesWithTheirKeys,
  sortUsedLiveNodes,
  sortUnusedLiveNodes,
  sortLiveNodes,
  sortTemplateNodes,
  separateLiveNodes,
} = __webpack_require__(20)

describe('Sort nodes:', () => {

  describe('sort live nodes', () => {

    it('by empty template nodes', () => {

      const liveNodes = [
        { text: 'hello' },
        { tag: 'div', key: 1 },
        { tag: 'div', key: 3 },
      ]

      const templateNodes = []

      expect(
        sortLiveNodes(liveNodes, templateNodes)
      ).toEqual([
        { text: 'hello' },
        { tag: 'div', key: 1 },
        { tag: 'div', key: 3 },
      ])

    })

    it('by template nodes', () => {

      const liveNodes = [
        { text: 'hello',      order: 0 },
        { tag: 'div', key: 1, order: 1 },
        { tag: 'div', key: 3, order: 2 },
      ]

      const templateNodes = [
        { text: 'hola' },
        { text: 'bonjour' },
        { tag: 'div', key: 2 },
        { tag: 'div', key: 1 },
        { text: 'hello world'},
      ]

      expect(
        sortLiveNodes(liveNodes, templateNodes)
      ).toEqual([
        { text: 'hello', order: 0 },
        null,
        null,
        { tag: 'div', key: 1, order: 1 },
        null,
        { tag: 'div', key: 3, order: 2 },
      ])

    })

  })

  describe('sort template nodes', () => {

    it('flatten and remove null values from array', () => {
      expect(
        sortTemplateNodes([
          null,
          [
            { text: 'hello' },
            [null],
          ],
          { text: 'world' }
        ])
      ).toEqual([
        { text: 'hello' },
        { text: 'world' }
      ])
    })

  })

  describe('sort live nodes', () => {

    describe('sort used live nodes', () => {

      it('when used exists', () => {

        const liveNodes = [
          { tag: 'div' },
          { tag: 'div', key: 1 },
          'text',
          { tag: 'div', key: 2 },
        ]
        const templateNodes = [
          'text',
          { tag: 'div' },
          { tag: 'div', key: 2 },
          'text',
          { tag: 'div', key: 1 },
        ]
        const keyedLiveNodes = wrapNodesWithTheirKeys(liveNodes)

        expect(
          sortUsedLiveNodes({ liveNodes, templateNodes, keyedLiveNodes })
        ).toEqual([
          { tag: 'div' },
          null,
          { tag: 'div', key: 2 },
          null,
          { tag: 'div', key: 1 },
        ])
      })

    })

    describe('sort unused live nodes', () => {

      it('when unused exists', () => {

        const liveNodes = [
          { tag: 'div', key: 1, order: 1 },
          { tag: 'div', key: 2, order: 2 },
          { tag: 'div', key: 3, order: 3 },
          { tag: 'div', key: 4, order: 4 },
        ]

        const usedOrderIndexes = [1,3]

        expect(
          sortUnusedLiveNodes({
            liveNodes, usedOrderIndexes
          })
        ).toEqual([
          { tag: 'div', key: 2, order: 2 },
          { tag: 'div', key: 4, order: 4 },
        ])

      })

    })

  })

  describe('find live pair for template', () => {

    it('when ', () => {

      const liveNode = { tag: 'p' }
      const templateNode = null
      const keyedLiveNodes = {}

      expect(
        getLivePairForTemplate(liveNode, templateNode, keyedLiveNodes)
      ).toBe(null)

    })

    it('when template node doesn\'t keyed and live is keyed', () => {
      const liveNode = { tag: 'p', key: 1 }
      const templateNode = { tag: 'div' }
      const keyedLiveNodes = {}

      expect(
        getLivePairForTemplate(liveNode, templateNode, keyedLiveNodes)
      ).toEqual(
        null
      )
    })

    it('when live keyed node exists', () => {

      const liveNode = { tag: 'p' }
      const templateNode = { tag: 'div', key: 1 }
      const keyedLiveNodes = { 1: { tag: 'div', key: 1 } }

      expect(
        getLivePairForTemplate(liveNode, templateNode, keyedLiveNodes)
      ).toEqual(
        { tag: 'div', key: 1 }
      )
    })

    it('when live keyed node doesn\'t exists', () => {

      const liveNode = { tag: 'p' }
      const templateNode = { tag: 'div', key: 1 }
      const keyedLiveNodes = { 2: { tag: 'div', key: 1 } }

      expect(
        getLivePairForTemplate(liveNode, templateNode, keyedLiveNodes)
      ).toEqual(
        null
      )
    })

    it('when template node is not keyed ', () => {

      const liveNode = { tag: 'p' }
      const templateNode = { tag: 'div' }
      const keyedLiveNodes = {}

      expect(
        getLivePairForTemplate(liveNode, templateNode, keyedLiveNodes)
      ).toEqual(
        { tag: 'p' }
      )
    })

  })

  describe('is keyed node', () => {

    it('for element with key props', () => {
      expect(
        isKeyedNode(
          { tag: 'div', key: 1 }
        )
      ).toBe(true)
    })

    it('for element without key props', () => {
      expect(
        isKeyedNode(
          { tag: 'div' }
        )
      ).toBe(false)
    })

    it('for element without key props', () => {
      expect(
        isKeyedNode(
          null
        )
      ).toBe(false)
    })

  })

  describe('wrap nodes with keys', () => {

    it('when keyed nodes exists', () => {
      expect(
        wrapNodesWithTheirKeys([
          null,
          { tag: 'span',        },
          { tag: 'div',  key: 1 },
          'text',
          { tag: 'p',    key: 2 }
        ])
      ).toEqual({
        1: { tag: 'div',  key: 1 },
        2: { tag: 'p',    key: 2 }
      })
    })

    it('when keyed nodes doesn\'t exists', () => {
      expect(
        wrapNodesWithTheirKeys([
          null,
          'text',
        ])
      ).toEqual({})
    })


  })

})


/***/ }),
/* 97 */
/***/ (function(module, exports) {

const loop = ({ liveNodes, domNodes }) => {

  liveNodes.forEach((liveNode, index) => {

    liveNode.dom = domNodes[index]

    if (liveNode.childs) {

      loop({
        liveNodes: liveNode.childs,
        domNodes: domNodes[index].childNodes
      })

    }

  })

}

module.exports = loop


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

const Component = __webpack_require__(2)
const createInstanceNode = __webpack_require__(34)
const {
  TAG_TYPE, TEXT_TYPE, CLASS_TYPE, INSTANCE_TYPE
} = __webpack_require__(0)

describe('Create instance node', () => {

  it('merge default props with template props', () => {

    class App extends Component {

      static defaultProps() {
        return {
          defaultProps: true,
          templateProps: false,
        }
      }

    }

    const templateNode = {
      nodeType: CLASS_TYPE,
      props: { templateProps: true },
      class: App,
      childs: []
    }

    const node = createInstanceNode({ templateNode })

    expect(node.instance.props).toEqual({
      defaultProps: true,
      templateProps: true,
    })

  })

  it('set set props and context to instance', () => {

    class App extends Component {

      static injectContext() {

        return ['id']

      }

    }

    const templateNode = {
      nodeType: CLASS_TYPE,
      props: { id: 'props' },
      class: App,
      childs: []
    }

    const node =
      createInstanceNode({
        templateNode,
        context: { id: 'context' }
      })

    expect(node.instance.props).toEqual({ id: 'props' })
    expect(node.instance.context).toEqual({ id: 'context' })

  })

  it('clone ref from template node', () => {

    let instance = { id: 1 }

    class App extends Component {

      render() {
        return null
      }

    }

    const templateNode = {
      nodeType: CLASS_TYPE,
      props: {},
      class: App,
      childs: [],
      ref: {
        name: 'app',
        instance
      }
    }

    const node = createInstanceNode({ templateNode })

    expect(node.ref.name).toBe('app')
    expect(node.ref.instance).toEqual(instance)

  })

})


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

const Component = __webpack_require__(2)
const createRootNode = __webpack_require__(35)
const { ROOT_TYPE } = __webpack_require__(0)

describe('Create root node', () => {

  it('return clone of root node', () => {

    const templateNode = {
      type: ROOT_TYPE,
      dom: {},
      childs: []
    }

    expect(
      createRootNode({ templateNode })
    ).toEqual(templateNode)

  })

})


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

const Component = __webpack_require__(2)
const createTagNode = __webpack_require__(36)
const { TAG_TYPE } = __webpack_require__(0)

describe('Create tag node', () => {

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


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

const Component = __webpack_require__(2)
const createTextNode = __webpack_require__(37)
const { TEXT_TYPE } = __webpack_require__(0)

describe('Create text node', () => {

  it('return clone of text node', () => {

    const templateNode = {
      type: TEXT_TYPE,
      text: 'some text'
    }

    expect(
      createTextNode({ templateNode })
    ).toEqual(templateNode)

  })

})


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

const createNode = __webpack_require__(38)
const Component = __webpack_require__(2)

const {
  ROOT_TYPE, CLASS_TYPE, INSTANCE_TYPE, TAG_TYPE, TEXT_TYPE
} = __webpack_require__(0)

const {
  CREATE_ROOT, CREATE_TEXT, CREATE_TAG,
  CREATE_INSTANCE, UPDATE_INSTANCE, RESUME_INSTANCE
} = __webpack_require__(4)

describe('Create node', () => {

  it('throw error when pass unknown type', () => {

    expect(() => {
      createNode({})
    }).toThrowError('Unrecognized create node type')

  })

  it('create instance node', () => {

    class App extends Component {}

    const templateNode = {
      type: CLASS_TYPE,
      class: App,
      childs: [],
    }

    const node =
      createNode({
        type: CREATE_INSTANCE,
        templateNode,
        context: {}
      })

    expect(node.childs).toEqual([])
    expect(node.type).toEqual(INSTANCE_TYPE)
    expect(node.instance instanceof templateNode.class).toBe(true)

  })

  it('after create instance assign ref instance', () => {

    class App extends Component {}

    class Menu extends Component {

      render() {
        return null
      }

    }

    const app = new App

    const templateNode = {
      type: CLASS_TYPE,
      class: Menu,
      childs: [],
      ref: {
        name: 'Menu',
        instance: app
      }
    }

    const node =
      createNode({
        type: CREATE_INSTANCE,
        templateNode,
        context: {}
      })

    expect(app.refs['Menu'] instanceof Menu).toBe(true)

  })

  it('update instance node', () => {

    class App extends Component {

      render() {
        return {}
      }

    }

    const liveNode = {
      type: INSTANCE_TYPE,
      instance: new App({ id: 1 }, { id: 1 }),
      childs: []
    }

    const templateNode = {
      type: CLASS_TYPE,
      class: App,
      props: { id: 2 },
      childs: []
    }

    const context = { id: 2 }

    const node =
      createNode({
        type: UPDATE_INSTANCE,
        liveNode,
        templateNode,
        context
      })

    expect(node.type).toEqual(INSTANCE_TYPE)
    expect(node.instance instanceof templateNode.class).toBe(true)

  })

  it('resume instance node', () => {

    const liveNode = {
      type: INSTANCE_TYPE,
      instance: {},
      childs: []
    }

    const node =
      createNode({
        type: RESUME_INSTANCE,
        liveNode,
        context: {}
      })

    expect(node).toEqual(liveNode)

  })

  it('create tag node', () => {

    const templateNode = {
      type: TAG_TYPE,
      tag: 'div',
      props: {},
      childs: [],
    }

    const node =
      createNode({
        type: CREATE_TAG,
        templateNode,
        context: {}
      })

    expect(node).toEqual(templateNode)

  })

  it('create text node', () => {

    const templateNode = {
      type: TEXT_TYPE,
      text: 'some text',
    }

    const node =
      createNode({
        type: CREATE_TEXT,
        templateNode,
        context: {}
      })

    expect(node).toEqual(templateNode)

  })

  it('create root node', () => {

    const templateNode = {
      type: ROOT_TYPE,
      dom: {},
      childs: []
    }

    const node =
      createNode({
        type: CREATE_ROOT,
        templateNode,
        context: {}
      })

    expect(node).toEqual(templateNode)

  })

})


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

const Component = __webpack_require__(2)
const updateInstanceNode = __webpack_require__(39)
const { CLASS_TYPE } = __webpack_require__(0)

describe('Update instance with next params: props, state, context', () => {

  class App extends Component {

    static injectContext() {

      return ['id']

    }

    constructor(props, context) {
      super(props, context)
      this.state = {
        id: 1
      }
    }

    render() {
      return this.props.id
    }

  }

  it('create node with new instance params', () => {

    const templateNode = {
      type: CLASS_TYPE,
      props: { id: 2 },
      childs: []
    }

    const liveNode = {
      type: CLASS_TYPE,
      instance: new App({ id: 1 }, { id: 1 })
    }

    const newNode =
      updateInstanceNode({
        liveNode,
        templateNode,
        context: { id: 2 }
      })

    expect(newNode.instance.prevProps.id).toBe(1)
    expect(newNode.instance.prevState.id).toBe(1)
    expect(newNode.instance.prevContext.id).toBe(1)

    expect(newNode.instance.props.id).toBe(2)
    expect(newNode.instance.state.id).toBe(1)
    expect(newNode.instance.context.id).toBe(2)

  })

  it('after update childs is from template node ', () => {

    const liveNode = {
      type: CLASS_TYPE,
      instance: new App({ id: 1 }, { id: 1 }),
      childs: [ 1 ]
    }

    const templateNode = {
      type: CLASS_TYPE,
      props: { id: 2 },
      childs: [ 2 ]
    }

    const newNode =
      updateInstanceNode({
        liveNode,
        templateNode,
        context: { id: 2 }
      })

    expect(newNode.childs).toEqual([2])

  })

})


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

const Component = __webpack_require__(2)

const createCallback = __webpack_require__(41)

const {
  CREATE_TEXT, CREATE_TAG, CREATE_INSTANCE, UPDATE_INSTANCE, RESUME_INSTANCE
} = __webpack_require__(4)

const {
  TEXT_TYPE, TAG_TYPE, CLASS_TYPE, INSTANCE_TYPE
} = __webpack_require__(0)

describe('Create tree, create callback:', () => {

  it('for liveNode without template', () => {

    const node =
      createCallback({
        liveNode: {},
        templateNode: {},
        context: {}
      })

    expect(node).toEqual({
      newLiveNode: null,
      isNeedChilds: false,
      newContext: {},
      newLiveParentInstanceNode: null,
    })

  })

  describe('hook when options.hooks is true and when false doesn\'t', () => {

    it('before each iteration call before unmount', () => {

      class App extends Component { beforeUnmount() {} }

      class App2 extends Component {}

      const app = new App

      spyOn(app, 'beforeUnmount').and.callThrough()

      const liveNode = {
        type: INSTANCE_TYPE,
        instance: app
      }

      const templateNode = {
        type: CLASS_TYPE,
        class: App2,
        childs: [],
      }

      const newLiveNode =
        createCallback({
          liveNode,
          templateNode,
          options: { hooks: true }
        })

      expect(app.beforeUnmount).toHaveBeenCalled()

      app.beforeUnmount.calls.reset()

      const newLiveNode2 =
        createCallback({
          liveNode,
          templateNode
        })

      expect(app.beforeUnmount).not.toHaveBeenCalled()

    })

    it('after instance create call before mount', () => {

      const spy = { beforeMount: () => {} }

      class App extends Component {

        beforeMount() {
          spy.beforeMount()
        }

      }

      spyOn(spy, 'beforeMount')

      const templateNode = {
        type: CLASS_TYPE,
        class: App,
        childs: [],
      }

      const liveNode = null

      const node =
        createCallback({
          liveNode,
          templateNode,
          options: { hooks: true }
        })

      expect(spy.beforeMount).toHaveBeenCalled()

      spy.beforeMount.calls.reset()

      const node2 =
        createCallback({
          liveNode,
          templateNode
        })

      expect(spy.beforeMount).not.toHaveBeenCalled()

    })

    it('before instance update call before update', () => {

      class App extends Component {

        beforeUpdate() {}

        render() {}
      }


      const app = new App

      const liveNode = {
        type: INSTANCE_TYPE,
        instance: app,
        childs: [],
      }

      const templateNode = {
        type: CLASS_TYPE,
        class: App,
        props: { id: 1 },
        childs: [],
      }

      const context = { id: 1 }

      spyOn(app, 'beforeUpdate')

      const node =
        createCallback({
          liveNode, templateNode, context, options: { hooks: true }
        })

      expect(
        app.beforeUpdate.calls.allArgs()
      ).toEqual([
        [{ id: 1 }, {}, { id: 1 }],
      ])

      app.beforeUpdate.calls.reset()

      const node2 =
        createCallback({
          liveNode,
          templateNode,
          context
        })

      expect(app.beforeUpdate).not.toHaveBeenCalled()

    })

  })

  describe('create node', () => {

    it('create instance', () => {

      class App extends Component {}

      const liveNode = null

      const templateNode = {
        type: CLASS_TYPE,
        class: App,
        props: { id: 1 },
      }

      const context = { id: 1 }

      const newLiveNodeParams =
        createCallback({
          liveNode, templateNode, context
        })

      const {
        isNeedChilds,
        newLiveNode,
        newContext,
        newLiveParentInstanceNode
      } = newLiveNodeParams

      expect(isNeedChilds).toBe(true)
      expect(newLiveNode.instance instanceof App).toBe(true)
      expect(newLiveNode.instance.props).toEqual({ id: 1 })
      expect(newContext).toEqual({ id: 1 })
      expect(newLiveParentInstanceNode.instance instanceof App).toBe(true)

    })

    it('update instance when is need update', () => {

      class App extends Component {

        isNeedUpdate() {
          return true
        }

        render() {
          return null
        }

      }

      const liveNode = {
        type: INSTANCE_TYPE,
        instance: new App({ id: 1 }, { id: 1 }),
        childs: [],
      }

      const templateNode = {
        type: CLASS_TYPE,
        class: App,
        props: { id: 2 },
        childs: [],
      }

      const context = { id: 2 }

      const newLiveNodeParams =
        createCallback({
          liveNode,
          templateNode,
          context,
        })

      const {
        isNeedChilds,
        newLiveNode,
        newContext,
        liveParentNode,
        newLiveParentInstanceNode
      } = newLiveNodeParams

      expect(isNeedChilds).toBe(true)
      expect(newLiveNode.childs).toEqual([ null ])
      expect(newContext).toEqual({ id: 2 })
      expect(newLiveParentInstanceNode.instance instanceof App).toBe(true)

    })

    it('resume instance when it doesn\'t need update', () => {

      class App extends Component {

        isNeedUpdate() {
          return false
        }

        render() {
          return null
        }

      }

      const liveNode = {
        type: INSTANCE_TYPE,
        instance: new App({ id: 1 }, { id: 1 }),
        childs: [],
      }

      const templateNode = {
        type: CLASS_TYPE,
        class: App,
        props: { id: 2 },
        childs: [],
      }

      const context = { id: 2 }

      const newLiveNodeParams =
        createCallback({
          liveNode,
          templateNode,
          context
        })

      const {
        isNeedChilds,
        newLiveNode,
        newContext,
        newLiveParentInstanceNode
      } = newLiveNodeParams

      expect(isNeedChilds).toBe(false)
      expect(newLiveNode.childs).toEqual([])
      expect(newLiveNode.instance.nextProps).toEqual({})
      expect(newLiveNode.instance.nextContext).toEqual({})
      expect(newContext).toEqual({ id: 2 })
      expect(newLiveParentInstanceNode.instance instanceof App).toBe(true)

    })


    it('create tag', () => {

      const templateNode = {
        type: TAG_TYPE,
        tag: 'div',
        props: { id: 1 },
        childs: []
      }

      const newLiveNodeParams =
        createCallback({
          templateNode,
          liveNode: null,
          context: true,
          liveParentInstanceNode: null,
        })

      const {
        isNeedChilds,
        newLiveNode,
        newContext,
        newLiveParentInstanceNode
      } = newLiveNodeParams

      expect(newLiveNode).toEqual(templateNode)
      expect(isNeedChilds).toBe(true)
      expect(newContext).toBe(true)
      expect(newLiveParentInstanceNode).toBe(null)


    })

    it('create text', () => {

      const templateNode = {
        type: TEXT_TYPE,
        text: 'some text'
      }

      const newLiveNodeParams =
        createCallback({
          templateNode,
          liveNode: null,
          context: true,
          liveParentInstanceNode: null,
        })

      const {
        isNeedChilds,
        newLiveNode,
        newContext,
        newLiveParentInstanceNode
      } = newLiveNodeParams

      expect(templateNode).toEqual(newLiveNode)
      expect(newContext).toBe(true)
      expect(isNeedChilds).toBe(false)
      expect(newLiveParentInstanceNode).toBe(null)

    })

  })

})


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

const createNodes = __webpack_require__(42)
const { omit } = __webpack_require__(1)
const {
  ROOT_TYPE, TEXT_TYPE, TAG_TYPE, CLASS_TYPE, INSTANCE_TYPE
} = __webpack_require__(0)

describe('Create nodes:', () => {

  it('link parent nodes', () => {

    const templateNodes = [
      {
        id: 1,
        childs: [
          {
            id: 2,
            childs: [
              {
                id: 3,
                childs: []
              }
            ]
          }
        ]
      }
    ]


    const nodes =
      createNodes({
        liveNodes: templateNodes,
        templateNodes,
        createOptions: {
          linkParent: true
        },
        createNode: ({ templateNode, liveNode }) => {
          return {
            newLiveNode: { id: templateNode.id },
            templateChilds: templateNode.childs,
            liveChilds: liveNode.childs,
            isNeedChilds: true
          }
        }
      })

    expect(nodes[0].parent).toBe(null)
    expect(nodes[0].childs[0].parent.id).toBe(1)
    expect(nodes[0].childs[0].childs[0].parent.id).toBe(2)

    expect(nodes[0].childs[0].parent.childs[0].parent.id).toBe(1)


  })

  it('index nodes', () => {

    const templateNodes = [
      {
        id: 1,
        childs: [
          {
            id: 2,
            childs: []
          },
          {
            id: 3,
            childs: []
          },
        ]
      }
    ]

    const nodes =
      createNodes({
        liveNodes: templateNodes,
        templateNodes,
        createOptions: {
          index: true
        },
        createNode: ({ templateNode, liveNode }) => {
          return {
            newLiveNode: { id: templateNode.id },
            templateChilds: templateNode.childs,
            liveChilds: liveNode.childs,
            isNeedChilds: true
          }
        }
      })

    expect(nodes[0].index).toBe(0)
    expect(nodes[0].childs[0].index).toBe(0)
    expect(nodes[0].childs[1].index).toBe(1)

  })

  it('count dom nodes childs', () => {

    const templateNodes = [
      {
        type: TAG_TYPE,
        tag: 'div',
        props: {},
        childs: [
          {
            type: TAG_TYPE,
            tag: 'div',
            props: {},
            childs: [
              {
                type: TAG_TYPE,
                tag: 'div',
                props: {},
                childs: []
              },
            ]
          },
          {
            type: TAG_TYPE,
            tag: 'div',
            props: {},
            childs: []
          },
        ]
      }
    ]

    const nodes =
      createNodes({
        liveNodes: templateNodes,
        templateNodes,
        createOptions: {
          childDomNodesCount: true
        },
        createNode: ({ templateNode, liveNode }, callback) => {
          return {
            newLiveNode: { type: templateNode.type },
            templateChilds: templateNode.childs,
            liveChilds: liveNode.childs,
            isNeedChilds: true
          }
        }
      })

    expect(nodes[0].childDomNodesCount).toBe(2)
    expect(nodes[0].childs[0].childDomNodesCount).toBe(1)
    expect(nodes[0].childs[0].childs[0].childDomNodesCount).toBe(0)
    expect(nodes[0].childs[1].childDomNodesCount).toBe(0)

  })

  it('filter nodes', () => {

    const nodes =
      createNodes({
        liveNodes: [1, 2],
        templateNodes: [1, 2],
        createNode: ({ liveNode, templateNode }, callback) => {
          return { newLiveNode: [ liveNode, templateNode ] }
        },
        filterNodes: (liveNodes, templateNodes) => {
          return {
            filteredLiveNodes: liveNodes.reverse(),
            filteredTemplateNodes: templateNodes.reverse(),
          }
        }
      })

    expect(nodes).toEqual([[2,2], [1, 1]])

  })

  it('filter nodes with liveParentInstanceNode param', () => {

    const nodes =
      createNodes({
        liveNodes: [1, 2],
        templateNodes: [1, 2],
        liveParentInstanceNode: {},
        createNode: ({ liveNode, templateNode }, callback) => {
          return { newLiveNode: [ liveNode, templateNode ] }
        },
        filterNodes: (liveNodes, templateNodes, liveParentInstanceNode) => {
          return {
            filteredLiveNodes: [liveParentInstanceNode],
            filteredTemplateNodes: [liveParentInstanceNode],
          }
        }
      })

    expect(nodes).toEqual([[{}, {}]])

  })

  it('pass context to childrens', () => {

    const templateNodes = [
      {
        passContext: { one: 1 },
        childs: [
          {
            passContext: { two: 2 }
          },
          {
            passContext: { two: 2 },
            childs: [
              {
                passContext: { three: 3 }
              },
            ]
          }
        ]
      }
    ]

    const nodes =
      createNodes({
        liveNodes: templateNodes,
        templateNodes,
        createNode: ({ templateNode, liveNode, context }) => {

          const node = Object.assign({}, templateNode.passContext, context)

          return {
            newLiveNode: node,
            isNeedChilds: templateNode.hasOwnProperty('childs'),
            newContext: omit(node, 'childs'),
            liveChilds: liveNode.childs,
            templateChilds: templateNode.childs,
          }

        }
      })

    expect(nodes).toEqual([
      {
        one: 1,
        childs: [
          {
            one: 1,
            two: 2,
          },
          {
            one:   1,
            two:   2,
            childs: [
              {
                one:   1,
                two:   2,
                three: 3,
              }
            ]
          },
        ]
      }
    ])

  })


  it('create array of numbers', () => {

    const nodes =
      createNodes({
        liveNodes: [1, 2, 3],
        templateNodes: [3, 2, 1],
        createNode: ({ liveNode, templateNode }, callback) => {
          return { newLiveNode: liveNode + templateNode }
        },
      })

    expect(nodes).toEqual([4, 4, 4])

  })


  it('array of objects without childs', () => {

    const templateNodes = [
      {
        tag: 'div',
        childs: [
          {
            tag: 'div'
          },
        ]
      }
    ]

    const nodes =
      createNodes({
        liveNodes: templateNodes,
        templateNodes,
        createNode: ({ templateNode }, callback) => {
          return {
            newLiveNode: { tag: templateNode.tag }
          }
        }
      })

    expect(nodes).toEqual([{ tag: 'div' }])

  })


  it('array of objects with childs', () => {

    const templateNodes = [
      { tag: 'div', childs: [
        { tag: 'div', childs: [
          { tag: 'div', childs: [] },
        ] },
        { tag: 'div', childs: [
          { tag: 'div', childs: [] },
          { tag: 'div', childs: [] },
        ] },
        { tag: 'div', childs: [
          { tag: 'div', childs: [] },
        ] },
      ] }
    ]

    const nodes =
      createNodes({
        liveNodes: templateNodes,
        templateNodes,
        createNode: ({ templateNode, liveNode }, callback) => {
          return {
            newLiveNode: { tag: templateNode.tag },
            templateChilds: templateNode.childs,
            liveChilds: liveNode.childs,
            isNeedChilds: true
          }
        }
      })

    expect(nodes).toEqual(templateNodes)

  })


  it('empty array', () => {

    const nodes =
      createNodes({
        liveNodes: [],
        templateNodes: []
      })

    expect(nodes).toEqual([])

  })


})


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

const Component = __webpack_require__(2)

const createTree = __webpack_require__(9)

const {
  ROOT_TYPE, TEXT_TYPE, TAG_TYPE, CLASS_TYPE, INSTANCE_TYPE
} = __webpack_require__(0)

describe('Create tree', () => {

  it('by another tree', () => {

    class App extends Component {

      static injectContext() {

        return ['id']

      }

      constructor(props, context) {
        super(props, context)
        this.state = { id: 1 }
      }

      render() {
        return [
          {
            type: TAG_TYPE,
            tag: 'div',
            props: { id: this.props.id },
            childs: [
              {
                type: TEXT_TYPE,
                text: this.props.id == 1 ? 'Hello world' : 'Hello',
              }
            ]
          }
        ]
      }

    }

    const liveNodes = [
      {
        type: ROOT_TYPE,
        childs: [
          {
            type: INSTANCE_TYPE,
            instance: new App({ id: 1 }, { id: 1 }),
          },
        ]
      }
    ]

    const templateNodes = [
      {
        type: ROOT_TYPE,
        childs: [
          {
            type: CLASS_TYPE,
            class: App,
            props: { id: 2 },
            childs: [
              {
                type: TAG_TYPE,
                tag: 'div',
                props: { id: 2 },
                childs: [
                  {
                    type: TEXT_TYPE,
                    text: 'Hello',
                  }
                ]
              },
            ]
          },
        ]
      }
    ]

    const newLiveNodes =
      createTree(
        liveNodes,
        templateNodes,
        { context: { id: 'context' }
      })

    expect(newLiveNodes[0].type).toBe(ROOT_TYPE)
    expect(newLiveNodes[0].childs.length).toBe(1)

    expect(newLiveNodes[0].childs[0].type).toBe(INSTANCE_TYPE)
    expect(newLiveNodes[0].childs[0].instance instanceof App).toBe(true)
    expect(newLiveNodes[0].childs[0].instance.props).toEqual({ id: 2 })
    expect(
      newLiveNodes[0].childs[0].instance.context
    ).toEqual({ id: 'context' })
    expect(newLiveNodes[0].childs[0].childs.length).toBe(1)

    expect(newLiveNodes[0].childs[0].childs[0].type).toBe(TAG_TYPE)
    expect(newLiveNodes[0].childs[0].childs[0].tag).toBe('div')
    expect(newLiveNodes[0].childs[0].childs[0].props).toEqual({ id: 2 })
    expect(newLiveNodes[0].childs[0].childs[0].childs.length).toBe(1)

    expect(newLiveNodes[0].childs[0].childs[0].childs[0].type).toBe(TEXT_TYPE)
    expect(newLiveNodes[0].childs[0].childs[0].childs[0].text).toBe('Hello')

  })

})


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

const {
  callBeforeMount, callBeforeUnmount, callBeforeUpdate,
  callAfterMount, callAfterUpdate
} = __webpack_require__(46)

const Component = __webpack_require__(2)

describe('Instance hooks', () => {

  it('call before mount', () => {

    const instance = {
      beforeMount: () => {}
    }

    spyOn(instance, 'beforeMount').and.callThrough()

    callBeforeMount(instance)

    expect(instance.beforeMount).toHaveBeenCalled()

  })

  it('call before update', () => {

    const instance = {
      beforeUpdate: () => {}
    }

    spyOn(instance, 'beforeUpdate').and.callThrough()

    callBeforeUpdate(instance, 1, 2, 3)

    expect(
      instance.beforeUpdate.calls.allArgs()
    ).toEqual([[1,2,3]])

  })

  it('call before unmount', () => {

    const instance = {
      beforeUnmount: () => {}
    }

    spyOn(instance, 'beforeUnmount').and.callThrough()

    callBeforeUnmount(instance)

    expect(instance.beforeUnmount).toHaveBeenCalled()

  })

  it('call after mount', () => {

    const instance = {
      afterMount: () => {}
    }

    spyOn(instance, 'afterMount').and.callThrough()

    callAfterMount(instance)

    expect(instance.afterMount).toHaveBeenCalled()

  })

  it('call after update', () => {

    const instance = {
      afterUpdate: () => {}
    }

    spyOn(instance, 'afterUpdate').and.callThrough()

    callAfterUpdate(instance, 1, 2, 3)

    expect(
      instance.afterUpdate.calls.allArgs()
    ).toEqual([[1, 2, 3]])

  })

})


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

const Component = __webpack_require__(2)
const hookNode = __webpack_require__(6)

const {
  TEXT_TYPE, TAG_TYPE, CLASS_TYPE, INSTANCE_TYPE
} = __webpack_require__(0)

const {
  BEFORE_EACH_ITERATION, ON_INSTANCE_CREATE,
  BEFORE_INSTANCE_UPDATE, AFTER_DOM_CREATE,
} = __webpack_require__(5)

describe('Hook node', () => {

  it('throw new error when unknow hook action was passed', () => {

    expect(() => {
      hookNode(null, null, null, null)
    }).toThrow(
      new Error('Unrecognized hook node action')
    )

  })

  describe('after dom create', () => {

    it('call after mount when waitAfterMount flag present', () => {

      class App {

        afterMount() {}

      }

      const app = new App

      app.waitAfterMount = true

      const liveNode = {
        type: INSTANCE_TYPE,
        instance: app,
        childs: []
      }

      spyOn(app, 'afterMount').and.callThrough()

      hookNode(AFTER_DOM_CREATE, liveNode, null, null)

      expect(
        app.afterMount.calls.count()
      ).toBe(1)

    })

    it('call after update when waitAfterUpdate flag present', () => {

      class App {

        afterUpdate() {}

      }

      const app = new App

      app.prevProps = { id: 1 }
      app.prevState = { id: 1 }
      app.prevContext = { id: 1 }
      app.waitAfterUpdate = true

      const liveNode = {
        type: INSTANCE_TYPE,
        instance: app,
        childs: []
      }

      spyOn(app, 'afterUpdate').and.callThrough()

      hookNode(AFTER_DOM_CREATE, liveNode, null, null)

      expect(
        app.afterUpdate.calls.allArgs()
      ).toEqual([
        [{ id: 1 }, { id: 1 }, { id: 1 }]
      ])

    })

  })


  it('before instance update call before update', () => {

    class App {

      beforeUpdate() {}

    }

    const app = new App

    const liveNode = {
      type: INSTANCE_TYPE,
      instance: app,
      childs: []
    }

    const templateNode = {
      type: CLASS_TYPE,
      class: App,
      props: { id: 1 },
      childs: []
    }

    const context = { id: 1 }

    spyOn(app, 'beforeUpdate').and.callThrough()

    hookNode(BEFORE_INSTANCE_UPDATE, liveNode, templateNode, context)

    expect(
      app.beforeUpdate.calls.allArgs()
    ).toEqual([
      [{ id: 1 }, undefined, { id: 1 }]
    ])

  })


  it('before instance update set after update flag', () => {

    class App {

      beforeUpdate() {}

    }

    const app = new App

    const liveNode = {
      type: INSTANCE_TYPE,
      instance: app,
      childs: []
    }

    const templateNode = {
      type: CLASS_TYPE,
      class: App,
      props: { id: 1 },
      childs: []
    }

    const context = { id: 1 }

    hookNode(BEFORE_INSTANCE_UPDATE, liveNode, templateNode, context)

    expect(
      app.waitAfterUpdate
    ).toBe(true)

  })


  it('after instance create call before mount', () => {

    class App {

      beforeMount() {}

    }

    const app = new App

    const liveNode = {
      type: INSTANCE_TYPE,
      instance: app,
      childs: []
    }

    spyOn(app, 'beforeMount').and.callThrough()

    hookNode(ON_INSTANCE_CREATE, liveNode, null, {})

    expect(
      app.beforeMount.calls.count()
    ).toBe(1)

  })


  it('after instance set wait before unmount flag', () => {

    class App {

      beforeMount() {}

    }

    const app = new App

    const liveNode = {
      type: INSTANCE_TYPE,
      instance: app,
      childs: []
    }

    hookNode(ON_INSTANCE_CREATE, liveNode, null, {})

    expect(
      app.waitAfterMount
    ).toBe(true)

  })


  it('before each iteration call before unmount', () => {

    class App extends Component {

      beforeUnmount() {}

    }

    class App2 {}

    const instances = [ new App, new App, new App ]

    const liveNode = {
      type: INSTANCE_TYPE,
      instance: instances[0],
      childs: [
        {
          type: INSTANCE_TYPE,
          instance: instances[1],
        },
        {
          type: TEXT_TYPE,
        },
        {
          type: INSTANCE_TYPE,
          instance: instances[2],
        },
      ]
    }

    const templateNode = {
      type: CLASS_TYPE,
      class: App2,
      childs: [
        {
          type: TEXT_TYPE,
        }
      ]
    }

    spyOn(instances[0], 'beforeUnmount').and.callThrough()
    spyOn(instances[1], 'beforeUnmount').and.callThrough()
    spyOn(instances[2], 'beforeUnmount').and.callThrough()

    hookNode(BEFORE_EACH_ITERATION, liveNode, templateNode, {})

    instances.forEach((instance) => {
      expect(
        instance.beforeUnmount.calls.count()
      ).toBe(1)
    })

  })

  it('before each iteration remove refs from nodes for unmount', () => {

    let instance = { refs: { app: true, div: true } }

    const liveNode = {
      type: INSTANCE_TYPE,
      instance: {},
      props: {},
      ref: {
        name: 'app',
        instance,
      },
      childs: [
        {
          type: TAG_TYPE,
          tag: 'div',
          props: {},
          childs: [],
          ref: {
            name: 'div',
            instance,
          }
        }
      ]
    }

    const templateNode = null

    hookNode(BEFORE_EACH_ITERATION, liveNode, templateNode, {})

    expect(
      Object.keys(instance.refs).length
    ).toBe(0)

  })

})


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

const { TAG_TYPE, TEXT_TYPE } = __webpack_require__(0)
const html = __webpack_require__(110)

describe('Html helpers', () => {

  it('create template node from div helper', () => {

    const { div } = html

    expect(
      div({ id: 1, ref: 'div' }, 'test')
    ).toEqual({
      type: TAG_TYPE,
      tag: 'div',
      props: { id: 1 },
      ref: 'div',
      childs: [
        'test'
      ]
    })

  })

  it('create template node from h helper', () => {

    const { h } = html

    expect(
      h('div', { id: 1, ref: 'div' }, ['test'])
    ).toEqual({
      type: TAG_TYPE,
      tag: 'div',
      props: { id: 1 },
      ref: 'div',
      childs: [
        'test'
      ]
    })

  })

})


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

const { TAG_TYPE, TEXT_TYPE } = __webpack_require__(0)
const tags = __webpack_require__(111)
const { flatten, include, omit } = __webpack_require__(1)

const h = (tag, props = {}, childs) => {

  const refParams = props.ref
    ? { ref: props.ref }
    : {}

  const keyParams = props.key
    ? { key: props.key }
    : {}

  const newProps = omit(props, 'ref', 'key')

  const baseParams = {
    tag,
    type: TAG_TYPE,
    props: newProps,
    childs
  }

  return Object.assign({}, baseParams, refParams, keyParams)


}

module.exports.h = h

tags.forEach((tag) => {

  module.exports[tag] = (props = {}, ...childs) => {

    return h(tag, props, childs)

  }

})


/***/ }),
/* 111 */
/***/ (function(module, exports) {

module.exports = [
	"a",
	"abbr",
	"address",
	"area",
	"article",
	"aside",
	"audio",
	"b",
	"base",
	"bdi",
	"bdo",
	"blockquote",
	"body",
	"br",
	"button",
	"canvas",
	"caption",
	"cite",
	"code",
	"col",
	"colgroup",
	"data",
	"datalist",
	"dd",
	"del",
	"details",
	"dfn",
	"dialog",
	"div",
	"dl",
	"dt",
	"em",
	"embed",
	"fieldset",
	"figcaption",
	"figure",
	"footer",
	"form",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"head",
	"header",
	"hr",
	"html",
	"i",
	"iframe",
	"img",
	"input",
	"ins",
	"kbd",
	"keygen",
	"label",
	"legend",
	"li",
	"link",
	"main",
	"map",
	"mark",
	"math",
	"menu",
	"menuitem",
	"meta",
	"meter",
	"nav",
	"noscript",
	"object",
	"ol",
	"optgroup",
	"option",
	"output",
	"p",
	"param",
	"picture",
	"pre",
	"progress",
	"q",
	"rb",
	"rp",
	"rt",
	"rtc",
	"ruby",
	"s",
	"samp",
	"script",
	"section",
	"select",
	"small",
	"source",
	"span",
	"strong",
	"style",
	"sub",
	"summary",
	"sup",
	"svg",
	"table",
	"tbody",
	"td",
	"template",
	"textarea",
	"tfoot",
	"th",
	"thead",
	"time",
	"title",
	"tr",
	"track",
	"u",
	"ul",
	"var",
	"video",
	"wbr"
]


/***/ })
/******/ ]);