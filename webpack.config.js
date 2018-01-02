const path = require("path");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  entry: {
    homePage: "./main.ts",
    fromEventPage: "./scripts/from-event.ts",
    customObserverPage: "./scripts/observer.ts",
    multipleObserversPage: "./scripts/observers.ts",
    createObservablePage: "./scripts/create-observable.ts",
    intervalOperatorPage: "./scripts/interval-operator.ts",
    appExamplePage: "./scripts/app-example.ts"
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
