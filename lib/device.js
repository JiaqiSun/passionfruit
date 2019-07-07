const frida = require('frida')

const { retry } = require('./utils')
const { EarlyInstrumentError } = require('./error')


function serializeIcon(icon) {
  if (!icon) return icon
  const { pixels, height, width, rowstride } = icon
  return { width, height, rowstride, pixels: pixels.toString('base64') }
}


function serializeDevice(dev) {
  const { name, id, icon } = dev
  return { name, id, icon: serializeIcon(icon) }
}


function serializeApp(app) {
  const { name, id, smallIcon, largeIcon, identifier } = app
  return {
    name,
    id,
    identifier,
    smallIcon: serializeIcon(smallIcon),
    largeIcon: serializeIcon(largeIcon),
  }
}


class ExtendedDevice {
  static frida = {
    version: require('frida/package.json').version
  }

  static async list() {
    const notLocal = device => device.type !== 'local' && device.id !== 'tcp'
    const all = await frida.enumerateDevices()
    return all.filter(notLocal).map(serializeDevice)
  }

  static async get(id, timeout = 10 * 1000) {
    return new ExtendedDevice(await frida.getDevice(id, { timeout }))
  }

  static async connect(host) {
    return new ExtendedDevice(await frida.getDeviceManager().addRemoteDevice(host))
  }

  static remove(host) {
    return frida.getDeviceManager().removeRemoteDevice(host)
  }

  static async usb() {
    return new ExtendedDevice(await frida.getUsbDevice())
  }

  constructor(device) {
    this.device = device
  }

  async start(bundle) {
    const apps = await this.device.enumerateApplications()
    const app = apps.find(item => item.identifier === bundle)
    if (!app) throw new AppNotFoundError(bundle)
    if (app.pid) {
      const front = await this.device.getFrontmostApplication()
      if (front && front.pid === app.pid) {
        return await this.device.attach(app.name)
      } else {
        await this.device.kill(app.pid)
        return await this.spawn(bundle)
      }
    }
    return await this.spawn(bundle)
  }

  async open(bundle, url) {
    const pid = await this.device.spawn([bundle], { url })
    await this.device.resume(pid)
    return pid
  }

  async spawn(bundle) {
    const pid = await this.device.spawn(bundle)
    const session = await this.device.attach(pid)
    await this.device.resume(pid)

    const probe = await session.createScript(`
      Module.ensureInitialized('Foundation'); rpc.exports.ok = function() { return true }`)

    await probe.load()
    const ok = await retry(probe.exports.ok.bind(probe.exports))
    if (!ok) throw new EarlyInstrumentError(bundle)
    return session
  }

  async apps() {
    const list = await this.device.enumerateApplications()
    return list.map(serializeApp)
  }

  valueOf() {
    return serializeDevice(this.device)
  }
}


Object.defineProperty(ExtendedDevice.prototype, 'host', {
  enumerable: true,
  get() {
    const prefix = 'tcp@'
    if (this.device.id.startsWith(prefix))
      return this.device.id.slice(prefix.length)
    return null
  }
})

exports.Device = ExtendedDevice