#!/usr/bin/env node
var watchifyServer = require('../')
var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    port: 'p',
    dir: 'd',
    host: 'h',
    css: 's',
    errorHandler: 'error-handler'
  },
  boolean: [ 'live', 'debug', 'errorHandler' ],
  default: {
    port: 9966,
    errorHandler: true,
    debug: true
  },
  '--': true
})

var browserifyArgs = argv._.concat(argv['--'])
argv.cwd = process.cwd()
argv.root = argv.dir
watchifyServer.fromArgs(browserifyArgs, argv, function (err, ev) {
  if (err) throw err
  console.log('Listening on %s', ev.url)
})
