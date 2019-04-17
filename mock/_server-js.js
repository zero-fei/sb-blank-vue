const fs = require('fs');
const path = require('path');
const proxy = require('express-http-proxy');
const url = require('url');
const assert = require('assert');

const mock = {};
fs.readdirSync(path.join(__dirname + '/js')).forEach(function(file) {
  var filePath = path.join(__dirname + '/js', file);
  var stat = fs.statSync(filePath);
  if (stat.isFile() && file.match(/^[^.].*/) && filePath.endsWith('.js')) {
    Object.assign(mock, require(`./js/${file}`));
  }
});

function parseKey(key) {
  let method = 'get';
  let aPath = key;

  if (key.indexOf(' ') > -1) {
    const splited = key.split(' ');
    method = splited[0].toLowerCase();
    aPath = splited[1];
  }

  return { method, path: aPath };
}

function createMockHandler(method, aPath, value) {
  return function mockHandler(...args) {
    const res = args[1];
    if (typeof value === 'function') {
      value(...args);
    } else {
      res.json(value);
    }
  };
}
function winPath(aPath) {
  return aPath.replace(/\\/g, '/');
}

function createProxy(method, aPath, target) {
  return proxy(target, {
    filter(req) {
      return method ? req.method.toLowerCase() === method.toLowerCase() : true;
    },
    forwardPath(req) {
      let matchPath = req.originalUrl;
      const matches = matchPath.match(aPath);
      if (matches.length > 1) {
        matchPath = matches[1];
      }
      return path.join(winPath(url.parse(target).path), matchPath);
    }
  });
}

function applyJSServer(server) {
  Object.keys(mock).forEach((key) => {
    const keyParsed = parseKey(key);
    assert(!!server[keyParsed.method], `method of ${key} is not valid`);
    assert(
      typeof mock[key] === 'function' || typeof mock[key] === 'object' || typeof mock[key] === 'string',
      `mock value of ${key} should be function or object or string, but got ${typeof mock[key]}`
    );

    if (typeof mock[key] === 'string') {
      let aPath = keyParsed.path;
      if (/\(.+\)/.test(keyParsed.path)) {
        aPath = new RegExp(`^${keyParsed.path}$`);
      }
      server.use(aPath, createProxy(keyParsed.method, aPath, mock[key]));
    } else {
      server[keyParsed.method](keyParsed.path, createMockHandler(keyParsed.method, keyParsed.path, mock[key]));
    }
  });
}

module.exports = applyJSServer;
