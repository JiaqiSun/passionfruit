const chaiAsPromised = require('chai-as-promised')
const chai = require('chai')

const frida = require('frida')
const { FridaUtil } = require('../lib/utils')
const { connect, proxy } = require('../lib/rpcv2')

chai.use(chaiAsPromised)
const { expect } = chai

describe('RPC', () => {
  let device, session, api
  beforeEach(async () => {
    device = await frida.getUsbDevice()
    try {
      session = await device.attach('Safari')
    } catch (_) {
      session = await FridaUtil.spawn(device, { identifier: 'com.apple.mobilesafari' })
    }
    const __exports = await connect(session)
    // console.log(await __exports.interfaces())
    api = proxy(__exports)
  })

  it('invoke RPC', async () => {
    expect(await api('cookies/list')).to.be.an('array')
    expect(await api.checksec()).to.be.an('object')
      .and.to.has.keys(['entitlements', 'encrypted', 'arc', 'canary', 'pie'])
    expect(await api.info.info()).to.be.an('object')
      .and.to.has.keys(['tmp', 'home', 'json', 'id', 'bundle', 'binary', 'urls', 'minOS', 'name', 'semVer', 'version'])
    expect(await api.info.userDefaults()).to.be.an('object')
    expect(await api.symbol.modules()).to.be.an('array')
    expect(await api.symbol.imports('MobileSafari')).to.be.an('array')
    expect(await api.symbol.exports('WebKit')).to.be.an('array')
  })
  
  it('should reject non extsting call', async () => {
    expect(api('cookies/non-exist')).to.be.rejected
  })

  afterEach(async () => {
    if (session)
      await session.detach()
  })
})