const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const routes = require('./routes');  // Adjust path as needed
const path = require('path');

const server = Hapi.server({
  port: 3000,
  host: '0.0.0.0',
  routes: {
    cors: {
      origin: ['*'],
    },
    files: {
      relativeTo: path.join(__dirname, '../public')
    }
  },
});

const init = async () => {
  await server.register(Inert);

  server.route(routes);

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return h.file('index.html');
    }
  });

  server.route({
    method: 'GET',
    path: '/images/{param*}',
    handler: {
      directory: {
        path: 'images',
        redirectToSlash: true,
        index: false,
      },
    },
  });

  await server.initialize(); // Only initialize the server

  console.log(`Server initialized`);
};

init();

module.exports = server.listener;  // Export the server's listener
