const path = require("path");
const CompressionPlugin=require('compression-webpack-plugin')
function resolve (dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  publicPath: '',

  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin).end();
    }
    config.set('externals', {
      'wangeditor': 'wangEditor',
    })
    config.plugin('compressionPlugin').use(new CompressionPlugin)
    config.plugins.delete('prefetch')
    config.resolve.alias
      .set("@", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("views", resolve("src/views"))
    // .set("base", resolve("baseConfig"))
    // .set("public", resolve("public")); esLint
  },
}
