const http = require('http');

const hostname = '127.0.0.1';
const port = 3333;

const server = http.createServer(function(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end("Docker, nginx and node reverse proxy running...");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});