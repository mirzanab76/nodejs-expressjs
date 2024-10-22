const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'Description of my API',
  },
  host: 'localhost:3000',
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Enter your bearer token in the format **Bearer &lt;token>**'
    },
  },
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['src/server.js']; // path to your main app file

swaggerAutogen(outputFile, endpointsFiles, doc);