/* eslint no-use-before-define: 0 */

const path = require('path')
const fs = require('fs')
const { promisify } = require('util')

const readFile = promisify(fs.readFile)

const { Session, Script } = require('frida')

/**
 * @param {Session} session
 * @return {Script}
 */
async function connect(session) {
  await session.enableJit()

  const filename = path.join(__dirname, '..', 'agent', 'dist', 'bundle.js')
  const source = await readFile(filename, 'utf8')
  const script = await session.createScript(source)

  return script
}

/**
 * @param {Script} script
 * @return {Proxy}
 */
function proxy(script) {
  const func = script.exports.invoke.bind(script.exports)
  let chain = []

  const handlers = {
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

  function recursiveGetter(target, name) {
    chain.push(name)
    return new Proxy(target, handlers)
  }

  return new Proxy(func, handlers)
}


module.exports = { connect, proxy }
