const Unsupported = new TypeError('Unsupported operation')

class RPC {
  constructor(session) {
    this.session = session
    this.script = null
    this.ready = false
    this.api = null
  }

  async connect() {
    const handlers = {
      get: (target, name) => (...args) => Reflect.get(target, 'invoke', receiver)(name, args),
      set() { throw Unsupported },
      deleteProperty() { throw Unsupported }
    }

    this.script = await this.loadScript()
    this.api = new Proxy(this.script.exports, handlers)
    this.ready = true
  }

  async loadScript() {
    const path = path.join(__dirname, '..', 'agent', 'dist', 'bundle.js')
    const source = await readFile(path, 'utf8')
    return this.session.createScript(source)
  }
}
