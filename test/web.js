import request from 'supertest'

import { expect } from 'chai'
import { server, start, stop } from '../appv2'

import { Device } from '../lib/device'

describe('Web', () => {
  before(async () => {
    await start()
  })

  it('should server the page and rest api', async () => {
    request(server).get('/')
      .expect(200)
      .expect('Content-Type', 'text/html')

    const usb = await Device.usb()
    const device = usb.device.id
    {
      const { body } = await request(server).get('/api/devices')
        .expect('Content-Type', /json/)
      expect(body).has.key('version', 'list')
      expect(body.list.find(dev => dev.id === device)).to.be.an('object')
    }

    {
      const { body } = await request(server).get(`/api/device/${usb.device.id}/apps`)
        .expect(200)
        .expect('Content-Type', /json/)
      expect(body).to.be.an('array')
    }

    await request(server).post('/api/url/start').send({
      device,
      bundle: 'com.apple.mobilesafari',
      url: 'about:blank'
    }).expect(200)
  })

  after(async () => {
    await stop()
  })
})