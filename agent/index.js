import './ready'

import { interfaces, invoke, register } from './rpc'


rpc.exports = {
  interfaces,
  invoke
}

function registerModules() {
  const context = require.context('./modules', false, /\.js$/)
  for (const filename of context.keys()) {
    const mod = context(filename)
    const [, name] = /\.\/(\S+)\.js/.exec(filename)
    for (const [method, func] of Object.entries(mod)) {
      if (method === 'default')
        register(func, name)
      else
        register(func, [name, func.name].join('/'))
    }
  }
}

registerModules()
