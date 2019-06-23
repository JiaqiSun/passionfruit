const chaiAsPromised = require('chai-as-promised')
const chai = require('chai')

const { FridaUtil } = require('../lib/utils')
const { RPC } = require('../lib/rpcv2')

chai.use(chaiAsPromised)
const { expect } = chai

describe('RPC', () => {
  let device, session
  beforeEach(async () => {
    device = await FridaUtil.getDevice(process.env['DEVICE_ID'])
    session = await device.attach(process.env['APP_BUNDLE_ID'])
  })

  it('invoke RPC', async () => {
    const rpc = new RPC(session)
    await rpc.connect()

    expect(await rpc.api.checksec()).to.be.an('object').and.to.has.keys(['entitlements', 'encrypted', 'arc', 'canary', 'pie'])
    expect(await rpc.invoke('cookies/list')).to.be.an('array')
    expect(rpc.invoke('cookies/non-exist')).to.be.rejected
  })

  afterEach(async () => {
    await session.detach()
  })
})