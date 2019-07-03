const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry:  path.resolve(__dirname, './index.js'),
  // devtool: 'source-map',
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
        }
      })
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
}