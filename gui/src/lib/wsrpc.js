import io from 'socket.io-client'


export default class WSRpc {
  static install(Vue, _opts) {
    const device = ''
    const bundle = 'com.apple.mobilesafari'
    const socket = io('/session', {
      query: { device, bundle }
    })
  
    const handlers = {
      get: recursiveGetter,
      apply,
    }
  
    function recursiveGetter(target, name) {
      if (typeof name === 'symbol')
        chain = []
      else
        chain.push(name)
      return new Proxy(target, handlers)
    }
  
    let chain = []
    function exec(method, args) {
      return new Promise((resolve, reject) => {
        let ok = false
        socket.emit('rpc', { method, args }, response => {
          if (response.status === 'ok') {
            ok = true
            resolve(response.data)
          } else {
            reject(response.error)
          }
        })
  
        setTimeout(() => {
          if (!ok)
            reject('Request timed out')
        }, 5000)
      })
    }
  
    function apply(_target, _thisArg, argArray) {
      let name, args
      if (chain.length) {
        name = chain.join('/')
        args = argArray
      } else {
        [name, ...args] = argArray
      }
      chain = []
      return exec(name, args)
    }
  
    const proxy = new Proxy(() => {}, handlers)
    Object.defineProperty(Vue.prototype, '$rpc', { get: () => proxy })
  }
}
