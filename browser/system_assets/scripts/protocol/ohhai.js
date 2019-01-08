var {app, protocol} = require('electron')
var path = require('path')
var url = require('url')
var once = require('once')
var fs = require('fs')
var http = require('http')
var crypto = require('crypto')
var listenRandomPort = require('listen-random-port')
var errorPage = require('../../builtin-pages/error-page.js');
//import {archivesDebugPage} from '../networks/dat/debugging'

// constants
// =

// content security policies
const OHHAI_CSP = `
  default-src 'self' OhHai:;
  img-src OhHai: data: http: https;
  script-src 'self' OhHai:;
  media-src 'self' OhHai:;
  style-src 'self' 'unsafe-inline' OhHai:;
`.replace(/\n/g, '')

// globals
// =

var serverPort // port assigned to us
var requestNonce // used to limit access to the server from the outside

// exported api
// =

function setup () {
  // generate a secret nonce
  requestNonce = '' + crypto.randomBytes(4).readUInt32LE(0)

  // setup the protocol handler
  protocol.registerHttpProtocol('OhHai',
    (request, cb) => {
      // send requests to the protocol server
      cb({
        method: request.method,
        url: `http://localhost:${serverPort}/?url=${encodeURIComponent(request.url)}&nonce=${requestNonce}`
      })
    }, err => {
      if (err) {
        throw new Error('Failed to create protocol: OhHai. ' + err)
      }
    }
  )

  // create the internal OhHai HTTP server
  var server = http.createServer(OhHaiServer)
  listenRandomPort(server, { host: '127.0.0.1' }, (err, port) => serverPort = port)
}

// internal methods
// =

async function OhHaiServer (req, res) {
  var cb = once((code, status, contentType, path) => {
    res.writeHead(code, status, {
      'Content-Type': (contentType || 'text/html'),
      'Content-Security-Policy': OHHAI_CSP,
      'Access-Control-Allow-Origin': '*'
    })
    if (typeof path === 'string') {
      var rs = fs.createReadStream(path)
      rs.pipe(res)
      rs.on('error', err => {
        res.writeHead(404)
        res.end(' ') // need to put some content on the wire for some reason
      })
    } else if (typeof path === 'function') {
      res.end(path())
    } else {
      res.end(errorPage(code + ' ' + status))
    }
  })
  var queryParams = url.parse(req.url, true).query
  var requestUrl = queryParams.url
  {
    // strip off the hash
    let i = requestUrl.indexOf('#')
    if (i !== -1) requestUrl = requestUrl.slice(0, i)
  }
  {
    // strip off the query
    let i = requestUrl.indexOf('?')
    if (i !== -1) requestUrl = requestUrl.slice(0, i)
  }


  // check the nonce
  // (only want this process to access the server)
  if (queryParams.nonce !== requestNonce) {
    return cb(403, 'Forbidden')
  }

  // browser pages
  if (requestUrl === 'OhHai://home') {
    return cb(200, 'OK', 'text/html', path.join(__dirname, '/system_assets/Home/Index.html'))
  }
  
  //----------------- Types we can use ---------------------
  //application/javascript
  //text/css
  //text/html

  return cb(404, 'Not Found')
}