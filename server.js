const StaticServer = require('static-server');

const server = new StaticServer({
  rootPath: './',
  port: 8000
});

server.start(() => {
  console.log(`Server Started on port ${server.port}`);
});