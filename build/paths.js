var path = require('path');
var fs = require('fs');

// hide warning //
var emitter = require('events');
emitter.defaultMaxListeners = 20;

var appRoot = 'src/';
var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

var paths = {
  root: appRoot,
  source: appRoot + '**/*.js',
  html: appRoot + '**/*.html',
  style: 'styles/**/*.css',
  output: 'dist/',
  doc:'./doc',
  e2eSpecsSrc: 'test/e2e/src/*.js',
  e2eSpecsDist: 'test/e2e/dist/',
  packageName: pkg.name,
  useTypeScriptForDTS: false,
  importsToAdd: [],
  sort: true
};

paths.ignore = ['aurelia-validation.js'];
paths.files = [
  paths.source
];

module.exports = paths;
