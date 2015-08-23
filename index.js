var assign = require('object-assign')
var createServer = require('serves')
var createMiddleware = require('watchify-middleware')
var fromArgs = require('browserify/bin/args')

module.exports = watchifyServer
module.exports.fromArgs = watchifyFromArgs

function watchifyFromArgs (args, opt, cb) {
  if (typeof opt === 'function') {
    cb = opt
    opt = {}
  }
  opt = opt || {}
  var bundler = fromArgs(args, assign({
    cache: {},
    packageCache: {},
    debug: true
  }, opt))
  var entry = bundler.argv._ && bundler.argv._[0]
  if (!entry) {
    throw new Error('must specify an entry path')
  }
  opt = assign({}, opt, { entry: entry })
  return watchifyServer(bundler, opt, cb)
}

function watchifyServer (browserify, opt, cb) {
  opt = opt || {}
  if (!opt.entry || typeof opt.entry !== 'string') {
    throw new TypeError('expects opt.entry to be a path')
  }

  // enable by default
  var errorHandler = opt.errorHandler
  if (typeof errorHandler !== 'function' && errorHandler !== false) {
    errorHandler = true
  }

  var middleOpt = assign({}, opt, {
    errorHandler: errorHandler
  })
  var watcher = createMiddleware.emitter(browserify, middleOpt)
  var middleware = watcher.middleware

  watcher.on('log', function (ev) {
    if (opt.silent) return
    if (ev.elapsed) {
      ev.elapsed = ev.elapsed + 'ms'
      ev.url = opt.entry
    }
    ev.name = opt.name || 'watchify'
    console.log(JSON.stringify(ev))
  })

  var serverOpt = assign({}, opt, {
    entry: middleware,
    src: opt.entry,
    port: typeof opt.port === 'number' ? opt.port : 9966
  })
  var server = createServer(serverOpt, cb)
  watcher.on('update', function (contents, deps) {
    server.emit('update', contents, deps)
  })
  return server
}
