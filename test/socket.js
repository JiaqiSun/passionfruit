import io from 'socket.io-client'

import { expect } from 'chai'

import { server, start, stop } from '../appv2'
import { Device } from '../lib/device'


describe('RPC', () => {
  it('should handle basic RPC usage', async () => {
    await start()

    const usb = await Device.usb()
    const device = usb.device.id

    await new Promise((resolve, reject) => {
      const addr = server.address()
      const host = addr.address.replace(/^::$/, 'localhost')
      const socket = io(`http://${host}:${addr.port}/session`, {
        query: { device, bundle: 'com.apple.mobilesafari' },
      })

      socket.on('ready', () => {
        socket.emit('rpc', { method: 'cookies/list' }, response => {
          const { status, data } = response
          expect(status).equals('ok')
          expect(data).to.be.an('array')
          resolve(true)
        })
      })
      
      setTimeout(reject, 1000)
    })

    stop()
  })

})
