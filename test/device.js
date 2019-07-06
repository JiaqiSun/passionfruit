const chaiAsPromised = require('chai-as-promised')
const chai = require('chai')

const { Device } = require('../lib/device')

chai.use(chaiAsPromised)
const { expect } = chai

describe('device management', () => {
  it('should', async () => {
    const device = await Device.usb()
    const apps = await device.apps()

    expect(await Device.list()).to.be.an('array')
    expect(apps).to.be.an('array')
    expect(apps.length).to.be.greaterThan(0)
    expect(apps[0]).to.have.keys('id', 'identifier', 'largeIcon', 'name', 'smallIcon')

    const HOST = '192.168.1.1:27042'
    const remote = await Device.connect(HOST)
    expect(remote).instanceOf(Device)
    await Device.remove(remote.host)
  })
})