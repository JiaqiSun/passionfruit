const path = require('path')
const fs = require('fs')
const { promisify } = require('util')

const readFile = promisify(fs.readFile)

async function connect(session) {
  await session.enableJit()

  const filename = path.join(__dirname, '..', 'agent', 'dist', 'bundle.js')
  const source = await readFile(filename, 'utf8')
  const script = await session.createScript(source)
  await script.load()

  return script.exports
}


function proxy(fridaExports) {
  const func = fridaExports.invoke.bind(fridaExports)
  let chain = []

  function illegal() {
    throw new TypeError('Unsupported operation')
  }

  const handlers = {
    set: illegal,
    deleteProperty: illegal,
    get: recursiveGetter,
    apply,
  }

  function apply(target, _thisArg, argArray) {
    let name, args
    if (chain.length) {
      name = chain.join('/')
      args = argArray
    } else {
      [name, ...args] = argArray
    }
    chain = []
    return func(name, args)
  }

  function recursiveGetter(target, name, _receiver) {
    chain.push(name)
    return new Proxy(target, handlers)
  }

  return new Proxy(func, handlers)
}


module.exports = { connect, proxy }