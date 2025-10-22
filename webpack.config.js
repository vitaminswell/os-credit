const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'vimeo-hls-player.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'VimeoHLSPlayer',
    libraryTarget: 'umd',
    libraryExport: 'default',
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  }
};
