import 'colors'

const frida = require('frida')
const io = require('socket.io')

const { connect, proxy } = require('../lib/rpcv2')
const { Device } = require('./device.js')


const socket = io()
const devices = socket.of('/devices')
const session = socket.of('/session')

session.on('connection', async (socket) => {
  const { device, bundle } = socket.handshake.query

  const dev = await Device.get(device)
  const session = await dev.start(bundle)

  await session.enableJit()
  session.detached.connect((reason) => {
    socket.emit('detached', reason)
    socket.disconnect(true)
  })

  socket
    .on('detach', () =>
      socket.disconnect())
    .on('kill', async (_data, ack) => {
      const { pid } = session
      await session.detach()
      await dev.kill(pid)
      ack(true)
      socket.disconnect()
    }).on('disconnect', async () => {
      await session.detach()
    })

  const agent = await connect(session)
  const rpc = proxy(agent)

  socket.emit('ready')

  socket.on('rpc', async (data, ack) => {
    if (!(typeof data === 'object' && 'method' in data))
      return
    
    const { method } = data
    const args = data.args || []

    try {
      const result = await rpc(method, ...args)
      ack({ status: 'ok', data: result })
    } catch (err) {
      ack({ status: 'error', error: `${err}` })
      console.error('Uncaught RPC error', err.stack || err)
      console.error('method:', method, 'args:', args)
    }
  })

  agent.destroyed.connect(() => {
    socket.emit('SCRIPT_DESTROYED')
    socket.disconnect(true)
  })

  agent.message.connect((message, data) => {
    if (message.type === 'error') {
      console.error('error message from frida'.red)
      console.error((message.stack || message).red)
    } else if (message.type === 'send') {
      // todo
    }
  })

  await agent.load()
  socket.emit('ready')
})


const mgr = frida.getDeviceManager()
const connected = new Map()

export function attach(server) {
  socket.attach(server)

  const wrap = tag => device =>
    devices.emit(tag, new Device(device).valueOf())

  const added = wrap('DEVICE_ADD')
  const removed = wrap('DEVICE_REMOVE')
  mgr.added.connect(added)
  mgr.removed.connect(removed)
  connected.set(server, [added, removed])
}

export function detach(server) {
  const [added, removed] = connected.get(server)
  mgr.added.disconnect(added)
  mgr.removed.disconnect(removed)
}

export const broadcast = session.emit.bind(session)
