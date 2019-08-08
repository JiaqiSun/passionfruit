const config = require('../lib/config')
const BACKEND = `http://${config.host}:${config.port}`


module.exports = {
  devServer: {
    noInfo: true,
    proxy: {
      '/api': {
        target: BACKEND,
        secure: false
      },
      '/socket.io': {
        target: BACKEND,
        secure: false,
        ws: true,
        changeOrigin: true
      }
    }
  }
}