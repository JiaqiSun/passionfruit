const { expect } = require('chai')

const { FridaUtil } = require('../lib/utils')
const { RPC } = require('../lib/rpcv2')

describe('RPC', () => {
  let device, session
  beforeEach(async () => {
    device = await FridaUtil.getDevice(process.env['DEVICE_ID'])
    session = await device.attach(process.env['APP_BUNDLE_ID'])
  })

  it('invoke RPC', async () => {
    const rpc = new RPC(session)
    await rpc.connect()
    rpc.script.destroyed.connect((err) => {
      console.error(err)
    })

    expect(await rpc.api.checksec()).to.be.an('object')
    expect(await rpc.api.cookies()).to.be.an('array')
  })

  afterEach(async () => {
    await session.detach()
  })
})