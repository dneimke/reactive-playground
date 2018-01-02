const path = require("path");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  entry: {
    homePage: "./main.ts",
    fromEventPage: "./scripts/from-event.ts"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  plugins: [new UglifyJSPlugin()],
  output: {
    filename: "src/dist/[name].js"
  }
};
