const path = require('path')
const fs = require('fs')
const { promisify } = require('util')

const readFile = promisify(fs.readFile)
const Unsupported = new TypeError('Unsupported operation')


async function connect(session) {
  await session.enableJit()

  const filename = path.join(__dirname, '..', 'agent', 'dist', 'bundle.js')
  const source = await readFile(filename, 'utf8')
  const script = await session.createScript(source)
  await script.load()

  return script.exports
}


function proxy(__exports) {
  const func = __exports.invoke.bind(__exports)
  func.chain = []

  function recursiveGetter(target, name, receiver) {
    target.chain.push(name)
    return new Proxy(target, {
      get: recursiveGetter,
      apply: execute
    })
  }

  function execute(target, thisArg, argArray) {
    const name = target.chain.join('/')
    target.chain = []
    return func(name, argArray)
  }

  return new Proxy(() => {}, {
    get(target, name, receiver) {
      target.chain = [name]
      return new Proxy(target, {
        get: recursiveGetter,
        apply: execute
      })
    },
    apply(target, thisArg, argArray) {
      target.chain = []
      const [name, ...args] = argArray
      return func(name, args)
    },
  })
}


module.exports = { connect, proxy }