const chaiAsPromised = require('chai-as-promised')
const chai = require('chai')

const frida = require('frida')
const { FridaUtil } = require('../lib/utils')
const { connect, proxy } = require('../lib/rpcv2')

chai.use(chaiAsPromised)
const { expect } = chai


describe('RPC', () => {
  let device, session, rpc
  beforeEach(async () => {
    device = await frida.getUsbDevice()
    try {
      session = await device.attach('Safari')
    } catch (_) {
      session = await FridaUtil.spawn(device, { identifier: 'com.apple.mobilesafari' })
    }
    const __exports = await connect(session)
    // console.log(await __exports.interfaces())
    rpc = proxy(__exports)
  })

  it('should handle basic RPC usage', async () => {
    expect(await rpc('cookies/list')).to.be.an('array')

    expect(await rpc.cookies.list()).to.be.an('array')
    expect(await rpc.checksec()).to.be.an('object')
      .and.to.has.keys(['entitlements', 'encrypted', 'arc', 'canary', 'pie'])

    expect(rpc.non.exist()).to.be.rejected
    expect(() => delete rpc.symbol).to.be.throw
    expect(() => rpc.foo = 'bar').to.be.throw
  })

  it('should covcer the modules', async () => {
    await rpc.syslog.start()

    expect(await rpc.info.info()).to.be.an('object')
      .and.to.has.keys(['tmp', 'home', 'json', 'id', 'bundle', 'binary', 'urls', 'minOS', 'name', 'semVer', 'version'])
    expect(await rpc.info.userDefaults()).to.be.an('object')
    expect(await rpc.symbol.modules()).to.be.an('array')
    expect(await rpc.symbol.imports('MobileSafari')).to.be.an('array')
    expect(await rpc.symbol.exports('WebKit')).to.be.an('array')
    
    await rpc.syslog.stop()
  })

  afterEach(async () => {
    if (session)
      await session.detach()
  })
})