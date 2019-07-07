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
    expect(await device.open('com.apple.mobilesafari', 'about:blank')).to.gt(0)
    expect(await device.valueOf()).to.have.keys('name', 'id', 'icon')
    expect(device.host).to.be.null

    const session = await device.spawn('com.apple.calculator')
    await session.detach()

    expect(() => Device.get(null, 0)).to.throw

    const HOST = '192.168.1.1:27042'
    const remote = await Device.connect(HOST)
    expect(remote).instanceOf(Device)
    await Device.remove(remote.host)
  })
})