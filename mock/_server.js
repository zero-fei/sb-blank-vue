const express = require('express');
const jsonServer = require('json-server');

const applyJsonServer = require('./_server-json');
const applyJSServer = require('./_server-js');

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);
// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
  res.jsonp(req.query);
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server

server.use(jsonServer.bodyParser);

// 处理js
applyJSServer(server);
// 处理json
applyJsonServer(server);

// Use static router
server.use(express.static('./public'));

server.listen(process.env.port || 3005, () => {
  console.log('JSON Server is running at:', process.env.port || 3005);
});
