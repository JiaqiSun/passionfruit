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
    for (let [method, func] of Object.entries(mod))
      register(func, method === 'default' ? `${name}` : `${name}/${func.name}`)
  }
}

registerModules()

console.log(JSON.stringify(invoke('checksec'), null, 2))
console.log(JSON.stringify(interfaces()))