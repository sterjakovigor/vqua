/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

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

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 96);
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


let modules = {}

const names = [
  'asyncMap',
  'clone',
  'flatten',
  'include',
  'kindOf',
  'pick',
  'omit',
  'union',
  'capitalize',
  'classNames',
  'first',
  'last',
  'intersect',
  'times',
  'findRightIndex',
  'compose'
]

names.forEach((name) => {
  modules[name] = __webpack_require__(67)("./" + name)
})

module.exports = modules


/***/ }),
/* 2 */
/***/ (function(module, exports) {

const include = (array, value) => {
  return array.indexOf(value) > -1
}

module.exports = include


/***/ }),
/* 3 */
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
/* 4 */
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
/* 5 */
/***/ (function(module, exports) {

module.exports = {
  INSERT_NODE:  0,
  CREATE_NODE:  1,
  UPDATE_NODE:  2,
  REPLACE_NODE: 3,
  DELETE_NODE:  4,
}


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = {
  BEFORE_EACH_ITERATION:  0,
  BEFORE_INSTANCE_UPDATE: 1,
  ON_INSTANCE_CREATE:  2,
  AFTER_DOM_CREATE:       3,
}


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const { removeRef } = __webpack_require__(55)
const eachNodes = __webpack_require__(25)
const isNodeForUnmount = __webpack_require__(94)

const { INSTANCE_TYPE } = __webpack_require__(0)

const {
  callBeforeMount, callBeforeUnmount, callBeforeUpdate,
  callAfterUpdate, callAfterMount
} = __webpack_require__(90)


const {
  BEFORE_EACH_ITERATION, ON_INSTANCE_CREATE,
  BEFORE_INSTANCE_UPDATE, AFTER_DOM_CREATE
} = __webpack_require__(6)

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
/* 8 */
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
/* 9 */
/***/ (function(module, exports) {

module.exports = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const flatten = __webpack_require__(4)
const kindOf = __webpack_require__(3)
const include = __webpack_require__(2)

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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const kindOf = __webpack_require__(3)
const include = __webpack_require__(2)

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
/* 12 */
/***/ (function(module, exports) {

module.exports = (...methods) => {

  return (result) => {

    return methods.reduceRight((result, method) => {

      return method(result)

    }, result)

  }

}


/***/ }),
/* 13 */
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
/* 14 */
/***/ (function(module, exports) {

module.exports = (array) => {

  return array[0]

}


/***/ }),
/* 15 */
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
/* 16 */
/***/ (function(module, exports) {

module.exports = (array) => {

  return array[array.length - 1]

}


/***/ }),
/* 17 */
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
/* 18 */
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
/* 19 */
/***/ (function(module, exports) {

module.exports = (start, end) => {

  if (start == end) return [start]

  const create = start < end
    ? (number, index) => start + index
    : (number, index) => start - index

  return (
    Array.from(
      Array(
        Math.abs(start - end) + 1
      )
    )
    .map(create)
  )

}


/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = (count) => {

  return [...Array(count).keys()]

}


/***/ }),
/* 21 */
/***/ (function(module, exports) {

const union = (first, second) => {
  return first.concat(
    second.filter((key) => first.indexOf(key) == -1)
  )
}

module.exports = union


/***/ }),
/* 22 */
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
/* 23 */
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
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

const mapNodes = __webpack_require__(95)

module.exports = (nodes, instance) => {

  if (!nodes) return []

  return mapNodes(nodes, (node) => {

    if (node && node.ref) {

      return Object.assign({}, node, {
        ref: {
          instance,
          name: node.ref,
        }
      })

    }

    return node

  })

}


/***/ }),
/* 25 */
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
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  route: __webpack_require__(63),
  matchRoutes: __webpack_require__(64),
}


/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = (path) => {

  const boundarySlashes = /^\/+|\/+$/g

  return path.replace(boundarySlashes, '').split('/')

}


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

const asyncMap = __webpack_require__(8)

describe('Async map', () => {

  it('return array of increasing indexes with decreasing timers', (done) => {

    asyncMap([null, null, null], (item, index, callback) => {
      setTimeout(() => {
        callback(null, index)
      }, (3 - index) * 10)

    }, (error, items) => {
      expect(items).toEqual([0,1,2])
      done()
    })

  })

  it('return array from indexes', (done) => {

    const items = [null, null, null]

    const mapper = (item, index, callback) => {
      setTimeout(() => {
        callback(null, index)
      }, 10)
    }

    asyncMap(items, mapper, (error, result) => {
      expect(result).toEqual([0,1,2])
      done()
    })

  })

  it('return error', (done) => {

    const items = [1,2,3]

    const mapper = (item, index, callback) => {
      undefinedVariable
    }

    asyncMap(items, mapper, (error, result) => {
      expect(!!error).toBe(true)
      expect(result).toBe(null)
      done()
    })

  })

  it('return new array', (done) => {

    const items = [1,2,3]

    const mapper = (item, index, callback) => {
      setTimeout(() => {
        callback(null, item * 2)
      }, 10)
    }

    asyncMap(items, mapper, (error, result) => {
      expect(result).toEqual([2,4,6])
      done()
    })

  })

  it('return empty array', (done) => {

    const items = []

    const mapper = () => {}

    asyncMap(items, mapper, (error, result) => {
      expect(result).toEqual([])
      done()
    })

  })

})


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

const capitalize = __webpack_require__(9)

describe('Utils', () => {

  it('capitlize', () => {
    expect(
      capitalize('hello-world')
    ).toBe('Hello-world')
  })

})


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

const classNames = __webpack_require__(10)

describe('Class names', () => {

  it('concat strings', () => {

    expect(
      classNames('1', 2, undefined, null, false, true, '3', ['4', 5])
    ).toEqual('1 2 3 4 5')

  })

  it('from object', () => {
    expect(
      classNames('1',['2'],'3', { 4: true }, [{ 5: true, 6: false }])
    ).toEqual('1 2 3 4 5')
  })

})


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

const clone = __webpack_require__(11)

describe('Util', () => {

  it('clone object', () => {

    const object = {
      name: 'Trololo',
      props: {
        color: 'green',
        posts: [
          { id: 1, name: 'Hello world!' }
        ]
      },
      childrens: [
        'ololo',
        {
          name: 'div',
          props: {},
          childrens: []
        }
      ]
    }

    const clonedObject = clone(object)

    object.name = ''
    object.props.color = ''
    object.props.posts.id = ''
    object.props.posts.name = ''
    object.childrens[0] = ''
    object.childrens[1].name = ''
    object.childrens[1].props.name = ''
    object.childrens[1].childrens[0] = ''

    expect(clonedObject).toEqual({
      name: 'Trololo',
      props: {
        color: 'green',
        posts: [
          { id: 1, name: 'Hello world!' }
        ]
      },
      childrens: [
        'ololo',
        {
          name: 'div',
          props: {},
          childrens: []
        }
      ]
    })
  })

})


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

const compose = __webpack_require__(12)

describe('Compose', () => {

  it('return right calculation', () => {

    const plus2 = (number) => {

      return number + 2

    }

    const multiply2 = (number) => {

      return number * 2

    }

    const calculate = compose(multiply2, plus2)

    expect(
      calculate(2)
    ).toBe(8)

  })

})


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

const findRightIndex = __webpack_require__(13)

describe('Find right index', () => {

  it('return number', () => {

    expect(
      findRightIndex([1,2,3,3,4,5], number => number == 4)
    ).toBe(4)

  })

})


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

const first = __webpack_require__(14)

describe('First', () => {

  it('element of array', () => {

    expect(
      first([1,2,3])
    ).toBe(1)

  })

})


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

const flatten = __webpack_require__(4)

describe('Utils', () => {

  it('flatten array', () => {

    expect(
      flatten([1,2,[3,4,[5,6],[7]],8])
    ).toEqual(
      [1,2,3,4,5,6,7,8]
    )

  })

})


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

const include = __webpack_require__(2)

describe('Utils in array', () => {

  it('return true when value in array', () => {

    expect(
      include([1,2,3,4,5], 3)
    ).toBe(true)

  })

})


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

const intersect = __webpack_require__(15)

describe('Intersect', () => {

  it('return intersect values', () => {

    expect(
      intersect([1,2,3,4,5], [3,4,5,6,7])
    ).toEqual(
      [3,4,5]
    )

  })

  it('return empty array', () => {

    expect(
      intersect([1,2,3,4,5], [6,7,8,9,10])
    ).toEqual([])

  })

})


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

const kindOf = __webpack_require__(3)

describe('Utils kind of', () => {

  it('correct type of argument', () => {
    const rules = [
      [ 'example', 'string' ],
      [ 1, 'number' ],
      [ null, 'null' ],
      [ undefined, 'undefined' ],
      [ true, 'boolean' ],
      [ {}, 'object' ],
      [ [], 'array' ],
      [ () => {}, 'function' ],
    ]

    for (const rule of rules) {
      expect(
        kindOf(rule[0])
      ).toBe(rule[1])
    }
  })

})


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

const last = __webpack_require__(16)

describe('Last', () => {

  it('element of array', () => {

    expect(
      last([1,2,3])
    ).toBe(3)

  })

})


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

const omit = __webpack_require__(17)

describe('Utils omit', () => {

  it('new object by not compared keys', () => {
    expect(
      omit({ a: 'a', b: 'b', c: 'c' }, 'a', 'c')
    ).toEqual(
      { b: 'b' }
    )
  })

})


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

const pick = __webpack_require__(18)

describe('Utils pick', () => {

  it('new object by compared keys', () => {
    expect(
      pick({ a: 'a', b: 'b', c: 'c' }, 'a', 'c')
    ).toEqual(
      { a: 'a', c: 'c' }
    )
  })

})


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

const range = __webpack_require__(19)

describe('range', () => {

  it('create array from -3 to 3', () => {

    expect(
      range(-3,3)
    ).toEqual(
      [-3,-2,-1,0,1,2,3]
    )

  })

  it('create array from 3 to -3', () => {

    expect(
      range(3, -3)
    ).toEqual(
      [3, 2, 1, 0, -1, -2, -3]
    )

  })

  it('create array from 3 to 3', () => {

    expect(
      range(3, 3)
    ).toEqual(
      [3]
    )

  })

})


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

const times = __webpack_require__(20)

describe('Times', () => {

  it('return array with numbers', () => {

    expect(
      times(5)
    ).toEqual([0,1,2,3,4])

  })

})


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

const union = __webpack_require__(21)

describe('Utils union', () => {

  it('merge 2 array into one with uniqe values', () => {

    expect(
      union([1,2,3,4,5],[3,4,5,6,7])
    ).toEqual(
      [1,2,3,4,5,6,7]
    )

  })

})


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

const { union } = __webpack_require__(1)
const isPropsEqual = __webpack_require__(72)

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
/* 46 */
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
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

const events = __webpack_require__(46)

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
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

const updateDomNode = __webpack_require__(74)
const updateNodes = __webpack_require__(75)

module.exports = ({ parentDomNode, patchNodes }) => {

  updateNodes({ patchNodes, parentDomNode, updateDomNode })

}


/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = (error, errorExists, errorNotExists) => {

  if (error) {

    errorExists(error)

  } else {

    errorNotExists()

  }

}


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

const { sortLiveNodes } = __webpack_require__(56)
const decorateNodes = __webpack_require__(53)
const createNodes = __webpack_require__(77)
const createCallback = __webpack_require__(76)

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
          decorateNodes(liveNodes, { order: true, dom: domNodes })

        const decoratedTemplateNodes =
          decorateNodes(templateNodes, { order: { startFrom: offset } })

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
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

const { flatten } = __webpack_require__(1)
const { TEXT_TYPE } = __webpack_require__(0)

module.exports = (childs) => {

  return flatten(childs).map((node) => {

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
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

const createNodes = __webpack_require__(86)
const createCallback = __webpack_require__(85)
const { sortLiveNodes, sortTemplateNodes } = __webpack_require__(56)
const decorateNodes = __webpack_require__(53)
const createNodesWithRefs = __webpack_require__(24)
const createTextNodes = __webpack_require__(51)

module.exports = (liveNodes, templateNodes, options, callback) => {

  const filterNodes = (liveNodes, templateNodes) => {

    const textTemplateNodes =
      createTextNodes(templateNodes)

    const sortedTemplateNodes =
      sortTemplateNodes(textTemplateNodes)

    const decoratedLiveNodes =
      decorateNodes(liveNodes, { order: true })

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
      createContext: options.context || {},
      filterNodes,
    })

  return nodes

}


/***/ }),
/* 53 */
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

    const nodeOrder = (
      order
        ? decorateOrder({ index, startFrom: order.startFrom || 0 })
        : {}
    )

    const nodeDom = (
      dom
        ? decorateDom({ dom, index })
        : {}
    )

    return Object.assign({}, liveNode, nodeDom, nodeOrder)

  })

}


/***/ }),
/* 54 */
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
/* 55 */
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
/* 56 */
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
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

const convertTag = __webpack_require__(60)
const convertText = __webpack_require__(61)
const mapNodes = __webpack_require__(62)

module.exports = (nodes) => {

  const TAG_TYPE = 1
  const TEXT_TYPE = 3

  return mapNodes(nodes, (node) => {

    if (node.nodeType == TAG_TYPE) {

      return convertTag(node)

    } else

    if (node.nodeType == TEXT_TYPE) {

      return convertText(node)

    } else {

      return null

    }

  })

}


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

const { route } = __webpack_require__(26)

module.exports = [
  route('/', async (req, res) => {



  }),
  route('/:locale/:articleId', async (req, res) => {



  })
]


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  Component: __webpack_require__(78),
  html: __webpack_require__(91),
  render: __webpack_require__(73),
}


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

const { TAG_TYPE } = __webpack_require__(0)

module.exports = (node) => {

  const props = Array.from(node.attributes).reduce((props, attribute) => {

    return Object.assign({}, props, {
      [attribute.nodeName]: node.getAttribute(attribute.nodeName)
    })

  }, {})

  return {
    type: TAG_TYPE,
    props,
    tag: node.tagName.toLowerCase()
  }

}


/***/ }),
/* 61 */
/***/ (function(module, exports) {

module.exports = (node) => {

  return node.textContent

}


/***/ }),
/* 62 */
/***/ (function(module, exports) {

const loop = (node, createNode) => {

  if (node.nodeType == undefined) {

    return Array.from(node).map((node) => {

      return loop(node, createNode)

    })

  } else {

    const newNode = createNode(node)

    if (typeof newNode == 'object') {

      const childs = loop(node.childNodes, createNode)

      return Object.assign({}, newNode, { childs })

    } else

    if (typeof newNode == 'string') {

      return newNode

    } else {

      return null

    }

  }

}


module.exports = loop


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

const path2segments = __webpack_require__(27)

module.exports = (path, action) => {

  const segments = (typeof path == 'string')
    ? path2segments(path)
    : path

  return { path, action, segments }

}


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

const matchSegments = __webpack_require__(65)
const path2segments = __webpack_require__(27)
const paramsFromSegments = __webpack_require__(66)

module.exports = (routes, path) => {

  const segments = path2segments(path)

  const route = routes.find((route) => {

    return matchSegments(route.segments, segments)

  })

  if (!route) return false

  const params = Array.isArray(route.segments)
    ? paramsFromSegments(route.segments, segments)
    : route.segments.params(segments)


  const request = {
    request: {
      path,
      segments,
      params
    }
  }

  return Object.assign({}, route, request)

}


/***/ }),
/* 65 */
/***/ (function(module, exports) {

module.exports = (templateSegments, requestSegments) => {

  if (!Array.isArray(templateSegments)) {

    return templateSegments.match(requestSegments)

  }

  if (
    templateSegments.length == 1 &&
    templateSegments[0] == '*'
  ) return true

  if (templateSegments.length != requestSegments.length) return false

  return templateSegments.every((templateSegment, index) => {

    const requestSegment = requestSegments[index]

    if (templateSegment[0] == ':') {

      return true

    } else

    if (templateSegment == requestSegment) {

      return true

    } else {

      return false

    }

  })

}


/***/ }),
/* 66 */
/***/ (function(module, exports) {

module.exports = (templateSegments, requestSegments) => {

  return templateSegments.reduce((params, templateSegment, index) => {

    const requestSegment = requestSegments[index]

    if (templateSegment[0] == ':') {

      return Object.assign({}, params, {
        [templateSegment.slice(1)] : requestSegment
      })

    }

    return params

  }, {})


}


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./__tests/asyncMap.spec": 28,
	"./__tests/asyncMap.spec.js": 28,
	"./__tests/capitalize.spec": 29,
	"./__tests/capitalize.spec.js": 29,
	"./__tests/classNames.spec": 30,
	"./__tests/classNames.spec.js": 30,
	"./__tests/clone.spec": 31,
	"./__tests/clone.spec.js": 31,
	"./__tests/compose.spec": 32,
	"./__tests/compose.spec.js": 32,
	"./__tests/findRightIndex.spec": 33,
	"./__tests/findRightIndex.spec.js": 33,
	"./__tests/first.spec": 34,
	"./__tests/first.spec.js": 34,
	"./__tests/flatten.spec": 35,
	"./__tests/flatten.spec.js": 35,
	"./__tests/include.spec": 36,
	"./__tests/include.spec.js": 36,
	"./__tests/intersect.spec": 37,
	"./__tests/intersect.spec.js": 37,
	"./__tests/kindOf.spec": 38,
	"./__tests/kindOf.spec.js": 38,
	"./__tests/last.spec": 39,
	"./__tests/last.spec.js": 39,
	"./__tests/omit.spec": 40,
	"./__tests/omit.spec.js": 40,
	"./__tests/pick.spec": 41,
	"./__tests/pick.spec.js": 41,
	"./__tests/range.spec": 42,
	"./__tests/range.spec.js": 42,
	"./__tests/times.spec": 43,
	"./__tests/times.spec.js": 43,
	"./__tests/union.spec": 44,
	"./__tests/union.spec.js": 44,
	"./asyncMap": 8,
	"./asyncMap.js": 8,
	"./capitalize": 9,
	"./capitalize.js": 9,
	"./classNames": 10,
	"./classNames.js": 10,
	"./clone": 11,
	"./clone.js": 11,
	"./compose": 12,
	"./compose.js": 12,
	"./findRightIndex": 13,
	"./findRightIndex.js": 13,
	"./first": 14,
	"./first.js": 14,
	"./flatten": 4,
	"./flatten.js": 4,
	"./include": 2,
	"./include.js": 2,
	"./intersect": 15,
	"./intersect.js": 15,
	"./kindOf": 3,
	"./kindOf.js": 3,
	"./last": 16,
	"./last.js": 16,
	"./omit": 17,
	"./omit.js": 17,
	"./pick": 18,
	"./pick.js": 18,
	"./range": 19,
	"./range.js": 19,
	"./times": 20,
	"./times.js": 20,
	"./union": 21,
	"./union.js": 21
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 67;


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

const { CREATE_NODE, DELETE_NODE } = __webpack_require__(5)

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
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

const {
  INSERT_NODE, CREATE_NODE, UPDATE_NODE, REPLACE_NODE, DELETE_NODE
} = __webpack_require__(5)

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
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

const { TEXT_TYPE, TAG_TYPE } = __webpack_require__(0)
const sortProps = __webpack_require__(47)
const events = __webpack_require__(46)
const diffProps = __webpack_require__(45)

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
/* 71 */
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
/* 72 */
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
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

const { flatten } = __webpack_require__(1)
const { ROOT_TYPE, INSTANCE_TYPE } = __webpack_require__(0)
const createLiveTree = __webpack_require__(52)
const filterDomNodes = __webpack_require__(54)
const eachNodes = __webpack_require__(25)
const hookNode = __webpack_require__(7)
const { AFTER_DOM_CREATE } = __webpack_require__(6)
const createPatchTree = __webpack_require__(50)
const updateDomTree = __webpack_require__(48)

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
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

const { addRef, removeRef } = __webpack_require__(55)
const { createElement, insertAt, updateProps } = __webpack_require__(70)
const diffProps = __webpack_require__(45)
const sortProps = __webpack_require__(47)
const {
  CREATE_NODE, UPDATE_NODE, DELETE_NODE, REPLACE_NODE, INSERT_NODE
} = __webpack_require__(5)
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

          const {
            addProps, removeProps
          } = diffProps(liveNode.props, templateNode.props)

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
/* 75 */
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
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

const { intersect } = __webpack_require__(1)
const countActionsScore = __webpack_require__(68)
const getNodeActions = __webpack_require__(69)
const { DELETE_NODE, REPLACE_NODE } = __webpack_require__(5)

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
/* 77 */
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
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

const humanizeNodes = __webpack_require__(93)
const { flatten, omit, clone } = __webpack_require__(1)
const countDomNodes = __webpack_require__(23)
const createLiveTree = __webpack_require__(52)
const filterDomNodes = __webpack_require__(54)
const getParentNodes = __webpack_require__(89)
const filterNodesOffsets = __webpack_require__(87)
const createPatchTree = __webpack_require__(50)
const findDomNode = __webpack_require__(71)
const updateDomTree = __webpack_require__(48)
const eachNodes = __webpack_require__(25)
const hookNode = __webpack_require__(7)
const { AFTER_DOM_CREATE } = __webpack_require__(6)
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
      })

    this.node.childs = newLiveNodes

    this.node.childDomNodesCount = countDomNodes(newLiveNodes)

    const filteredLiveNodes = filterDomNodes(liveNodes)

    const filteredTemplateNodes = filterDomNodes(newLiveNodes)

    const parentNodes = getParentNodes(filteredLiveNodes[0])

    const parentOffsets = filterNodesOffsets(parentNodes)

    const offset = parentOffsets[parentOffsets.length - 1]

    const boundaryDomNode = findDomNode(parentNodes[0].dom, parentOffsets)

    const domRootNode = boundaryDomNode.parentNode

    const domRootChildNodes =
      Array.from(domRootNode.childNodes)
        .slice(offset, filteredLiveNodes.length)

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
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

const { flatten, pick } = __webpack_require__(1)
const hookNode = __webpack_require__(7)
const { INSTANCE_TYPE } = __webpack_require__(0)
const createNodesWithRefs = __webpack_require__(24)

module.exports = ({
  templateNode,
  context,
  afterRender,
  beforeRender
} = {}) => {

  const injectedContext =
    templateNode.class.injectContext
      ? pick(context, ...templateNode.class.injectContext())
      : {}

  const defaultProps = templateNode.class.defaultProps()

  const mergedProps = Object.assign({}, defaultProps, templateNode.props)

  const instance = new templateNode.class(mergedProps, injectedContext)

  if (beforeRender) beforeRender(instance)

  const childs = 'render' in instance && flatten([instance.render()]) || null

  const refParams =
    templateNode.ref
      ? { ref: templateNode.ref }
      : {}

  const childsWithRefs = createNodesWithRefs(childs, instance)

  const newInstanceNode =
    Object.assign({}, {
      context,
      instance,
      type: INSTANCE_TYPE,
      ref: templateNode.ref,
      childs: childsWithRefs,
    }, refParams)

  instance.node = newInstanceNode

  return newInstanceNode

}


/***/ }),
/* 80 */
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
/* 81 */
/***/ (function(module, exports) {

module.exports = ({ templateNode }) => {

  const refParams =
    templateNode.ref
      ? { ref: templateNode.ref }
      : {}

  const newTagNode = {
    type: templateNode.type,
    tag: templateNode.tag,
    props: templateNode.props,
    childs: templateNode.childs,
  }

  return Object.assign({}, newTagNode, refParams)

}


/***/ }),
/* 82 */
/***/ (function(module, exports) {

module.exports = ({ templateNode }) => {

  const newTagNode = {
    type: templateNode.type,
    text: templateNode.text,
  }

  return newTagNode

}


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

const createRootNode = __webpack_require__(80)
const createInstanceNode = __webpack_require__(79)
const updateInstanceNode = __webpack_require__(84)
const createTagNode = __webpack_require__(81)
const createTextNode = __webpack_require__(82)
const handleError = __webpack_require__(49)

const {
  CREATE_ROOT, CREATE_TEXT, CREATE_TAG,
  CREATE_INSTANCE, UPDATE_INSTANCE, RESUME_INSTANCE
} = __webpack_require__(22)

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
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

const { flatten, pick } = __webpack_require__(1)
const createNodesWithRefs = __webpack_require__(24)

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

  const childsWithRefs = createNodesWithRefs(childs, liveInstance)

  const newInstanceNode = {
    context,
    type: liveType,
    instance: liveInstance,
    childs: childsWithRefs,
  }

  liveInstance.node = newInstanceNode

  return newInstanceNode

}


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {


const createNode = __webpack_require__(83)
const hookNode = __webpack_require__(7)
const getCreateAction = __webpack_require__(88)
const handleError = __webpack_require__(49)

const {
  BEFORE_EACH_ITERATION, BEFORE_INSTANCE_UPDATE, ON_INSTANCE_CREATE
} = __webpack_require__(6)

const {
  CREATE_ROOT, CREATE_TEXT, CREATE_TAG,
  CREATE_INSTANCE, UPDATE_INSTANCE, RESUME_INSTANCE
} = __webpack_require__(22)

module.exports = ({
  index,
  liveNode,
  templateNode,
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
        newContext: context
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
        newContext: context
      }

      break
    }

    default: {

      return {
        newLiveNode: null,
        isNeedChilds: false,
        newContext: context
      }

    }

  }


}


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

const countDomNodes = __webpack_require__(23)

const createNodes = ({
  liveNodes = [],
  templateNodes = [],
  createNode,
  createOptions = {},
  createContext = {},
  liveParentNode = null,
  filterNodes = (liveNodes, templateNodes) => {
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
  } = filterNodes(liveNodes, templateNodes)

  return filteredLiveNodes.reduce((newLiveNodes, liveNode, index) => {

    const templateNode = filteredTemplateNodes[index] || null

    const {
      newLiveNode,
      isNeedChilds,
      liveChilds,
      templateChilds,
      newContext,
    } = createNode({
      index,
      liveNode,
      templateNode,
      options: createOptions,
      context: createContext,
    })

    if (!newLiveNode) return newLiveNodes

    if (!isNeedChilds) return [ ...newLiveNodes, newLiveNode ]

    const childs =
      createNodes({
        liveParentNode: newLiveNode,
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
/* 87 */
/***/ (function(module, exports) {

module.exports = (nodes) => {
  return nodes.reduce((offsets, node) => {
    return node.hasOwnProperty('offset')
      ? [ ...offsets, node.offset ]
      : offsets
  }, [])
}


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

const {
  ROOT_TYPE, TEXT_TYPE, TAG_TYPE, CLASS_TYPE, INSTANCE_TYPE
} = __webpack_require__(0)

const {
  CREATE_ROOT, CREATE_TAG, CREATE_TEXT,
  CREATE_INSTANCE, UPDATE_INSTANCE, RESUME_INSTANCE
} = __webpack_require__(22)

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
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

const countDomNodes = __webpack_require__(23)
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
/* 90 */
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
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

const { TAG_TYPE, TEXT_TYPE } = __webpack_require__(0)
const tags = __webpack_require__(92)
const { flatten, include, omit } = __webpack_require__(1)
const createTextNodes = __webpack_require__(51)

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
/* 92 */
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


/***/ }),
/* 93 */
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
/* 94 */
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
/* 95 */
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
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

const { render } = __webpack_require__(59)
const { matchRoutes } = __webpack_require__(26)
const routes = __webpack_require__(58)
const dom2vqua = __webpack_require__(57)

const $app = document.getElementById('app')

let liveNodes = dom2vqua($app.childNodes)

const navigate = (path) => {

  new Promise((resolve, reject) => {

    const route = matchRoutes(routes, path)

    if (!route) resolve(false)

    const request = Object.assign({}, route.request)

    const response = { send: resolve }

    route.action.controller(request, response)

  }).then((data) => {

    // const context = { router: { navigate } }
    //
    // liveNodes = render($app, liveNodes, templateNodes, context)

    console.log(data)

  })

}

window.onpopstate = (event) => {

  navigate(document.location.pathname, routes)

}

navigate(document.location.pathname, routes)


/***/ })
/******/ ]);