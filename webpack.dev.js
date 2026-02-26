const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "source-map",
  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },
    watchFiles: ["./src/template.html"],
  },
});