import './ready'

import { interfaces, invoke, register } from './rpc'


rpc.exports = {
  interfaces,
  invoke
}

function registerModules() {
  const context = require.context('./modules', false, /\.js$/)
  for (let filename of context.keys()) {
    const mod = context(filename)
    const [_, name] = /\.\/(\S+)\.js/.exec(filename)
    modules[name] = {}
    for (let [method, func] of Object.entries(mod)) {
      if (method === 'default') {
        register(func, name)
        modules[name] = func
      } else {
        register(func, [name, func.name].join('/'))
        modules[name][method] = func
      }
    }
  }
}

global.modules = {}
registerModules()
