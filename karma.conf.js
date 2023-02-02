const path = require('path');
const { AureliaPlugin } = require('aurelia-webpack-plugin');
const webpack = require('webpack');

module.exports =
/**
 * @param {import('karma').Config} config
 */
function(config) {
  const browsers = config.browsers;
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'test/setup.ts'
    ],
    preprocessors: {
      'test/setup.ts': ['webpack', 'sourcemap']
    },
    webpack: {
      mode: 'development',
      resolve: {
        extensions: ['.ts', '.js'],
        modules: [path.resolve(__dirname, 'node_modules')],
        alias: {
          src: path.resolve(__dirname, 'src'),
          // aliasing to this in test folder, instead of src folder
          // to avoid colliding with the legacy build script
          'aurelia-validation': path.resolve(__dirname, 'src/aurelia-validation'),
          test: path.resolve(__dirname, 'test')
        },
        fallback: {
          path: false
        }
      },
      performance: {
        hints: false
      },
      devtool: Array.isArray(browsers) && browsers.includes('ChromeDebugging') ? 'inline-source-map' : 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.[jt]s$/,
            use: [
              {
                loader: 'ts-loader',
                options: {}
              }
            ],
            exclude: /node_modules/
          }
        ]
      },
      plugins: [
        new AureliaPlugin({
          aureliaApp: undefined,
          noWebpackLoader: true,
          dist: 'es2015'
        }),
        new webpack.SourceMapDevToolPlugin({
          test: /\.(ts|js|css)($|\?)/i
        })
      ]
    },
    mime: {
      'text/x-typescript': ['ts']
    },
    logLevel: config.LOG_ERROR, // to disable the WARN 404 for image requests
    reporters: ['progress'],
    webpackServer: { noInfo: true },
    browsers: Array.isArray(browsers) && browsers.length > 0 ? browsers : ['ChromeHeadless'],
    customLaunchers: {
      ChromeDebugging: {
        base: 'Chrome',
        flags: [
          '--remote-debugging-port=9333'
        ],
        debug: true
      }
    },
    mochaReporter: {
      ignoreSkipped: true
    },

    singleRun: false
  });
};
