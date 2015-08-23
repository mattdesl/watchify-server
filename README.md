# watchify-server

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

This is a bare-bones development server for [watchify](https://www.npmjs.com/package/watchify). For a more feature-rich development server built on the same underlying modules, see [budo](https://www.npmjs.com/package/budo).

Features at a glance:

- serves a [default HTML index](https://www.npmjs.com/package/simple-html-index)
- browserifies your entry file with incremental rebuilding
- serves your static files on port `9966` or the next available port
- suspends server response until the build is finished, so you are never served a stale or empty bundle
- logs build timing to `stdout` with [ndjson](http://ndjson.org/)
- build errors will be printed to the browser console by default

## Install

```sh
npm install watchify-server [-g|--save]
```

## Example

Example with CLI:

```sh
watchify-server index.js --port 8000 --dir public/
```

It might look like this with npm scripts and [garnish](https://github.com/mattdesl/garnish) for pretty-printing:

```js
  "devDependencies": {
    "watchify-server": "^1.0.0",
    "garnish": "^2.3.0"
  },
  "scripts": {
    "start": "watchify-server src/app.js --port 8000 --dir public | garnish"
  }
```

## Usage

[![NPM](https://nodei.co/npm/watchify-server.png)](https://www.npmjs.com/package/watchify-server)

Typically this module is used via a CLI, but it also exposes a simple JavaScript API.

### CLI

```sh
Usage:
  watchify-server entry.js [options] -- [browserify]

Options:
  --port, -p          port to listen on, default 9966
  --host, -h          host to listen on, default localhost
  --dir, -d           directory for static content, default process.cwd()
  --no-debug          turns off source maps
  --no-error-handler  turns off syntax error handling
  --index             optional file path to override default index.html
  --title             title of HTML index
  --css, -s           optional style sheet href, relative to --dir
```

Browserify options are passed after the `--` full stop.

The `--title` and `--css` arguments are only applicable to the default `index.html` handler.

### API

*Note:* The API does not set any default config on the browserify instance, so it is up to the developer to set `debug`, `packageCache`, and `cache`.

#### `server = watchifyServer(browserify, opt, [cb])`

Creates a new watchify server that wraps the specified `browserify` instance. Options:

- `entry` (required) the path to the entry file to browserify
- `silent` set to `true` to disable logs

Other options are passed to [watchify-middleware](https://www.npmjs.com/package/watchify-middleware) and [serves](https://www.npmjs.com/package/serves), but defaults `port` to 9966 and `errorHandler` to true.

The returned server emits `'update'` events from `watchify-middleware`.

The callback takes the form `callback(err, ev)` with the following event parameters when the server starts listening:

```js
{
  url: String  // 'http://localhost:8080/' 
  port: Number // 8080 
  host: String // 'localhost' 
}
```

#### `server = watchifyServer.fromArgs(browserifyArgs, [opt], [cb])`

Creates a new watchify server from the given command-line browserify args array, with optional `opt` overrides and a callback.

The `entry` is resolved by browserify arg parsing, so `opt` is optional and `cb` can be passed as the second parameter.

## See Also

- [budo](https://www.npmjs.com/package/budo) - a more feature-rich development server (live reload, browser launching, better error reporting, etc)
- [watchify-middleware](https://www.npmjs.com/package/watchify-middleware) - the underlying middleware for pending server requests
- [serves](https://www.npmjs.com/package/serves) - the underlying server utility for this tool
- [simple-html-index](https://www.npmjs.com/package/simple-html-index) - the default HTML index used in this tool
- [inject-lr-script](https://www.npmjs.com/package/inject-lr-script) - may be useful for injecting LiveReload into the `index` handler

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/watchify-server/blob/master/LICENSE.md) for details.
