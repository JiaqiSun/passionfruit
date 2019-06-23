const path = require('path')
const fs = require('fs')
const { promisify } = require('util')

const readFile = promisify(fs.readFile)
const Unsupported = new TypeError('Unsupported operation')

exports.RPC = class RPC {
  constructor(session) {
    this.session = session
    this.script = null
    this.ready = false
    this.api = null
  }

  async connect() {
    const handlers = {
      get: (target, name, receiver) => (...args) => Reflect.get(target, 'invoke', receiver).call(target, name, args),
      set() { throw Unsupported },
      deleteProperty() { throw Unsupported }
    }

    await this.session.enableJit()
    await this.loadScript()

    this.api = new Proxy(this.script.exports, handlers)
    this.ready = true
  }

  async loadScript() {
    const filename = path.join(__dirname, '..', 'agent', 'dist', 'bundle.js')
    const source = await readFile(filename, 'utf8')
    this.script = await this.session.createScript(source)
    await this.script.load()
  }
}

