import Koa from 'koa'
import logger from 'koa-logger'
import json from 'koa-json'
import bodyParser from 'koa-bodyparser'
import send from 'koa-send'
import Router from 'koa-router'
import path from 'path'

import { createServer } from 'http'
import { Device } from './lib/device.js'
import { broadcast, attach, detach } from './lib/channelsv2'


export const app = new Koa()
const router = new Router({ prefix: '/api' })

router
  .get('/devices', async ctx => {
    ctx.body = {
      version: Device.frida.version,
      list: await Device.list()
    }
  })
  .get('/device/:device/apps', async (ctx) => {
    const device = await Device.get(ctx.params.device)
    ctx.body = await device.apps()
  })
  .post('/url/start', async (ctx) => {
    const { device, bundle, url } = ctx.request.body
    const dev = await Device.get(device)
    const pid = await dev.open(bundle, url)
    ctx.body = { status: 'ok', pid }
  })

app.use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())

if (process.env.NODE_ENV === 'development') {
  app.use(json({
    pretty: false,
    param: 'pretty',
  }))
} else {
  app.use(async (ctx, next) => {
    const opt = { root: path.join(__dirname, 'gui') }
    if (ctx.path.startsWith('/static/'))
      await send(ctx, ctx.path, opt)
    else
      await send(ctx, '/index.html', opt)
    next()
  })
  app.use(logger())
}

export const server = createServer(app.callback())

export function start(opt) {
  attach(server)
  process.on('unhandledRejection', err =>
    broadcast('unhandledRejection', {
      err: err.toString(),
      stack: err.stack,
    }))

  return new Promise(resolve =>
    server.listen(opt, () => {
      const addr = server.address()
      const host = addr.address.replace(/^::$/, 'localhost')
      console.info(`listening on http://${host}:${addr.port}`.green)
      resolve(server)
    }))
}

export function stop() {
  detach(server)
  server.close()
}

