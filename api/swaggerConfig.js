import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Shows',
    version: '1.0.0',
    description: 'Documentación de la API para shows, login y carga de imágenes.',
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 5047}`,
      //url: 'http://localhost:5000',
      //url: 'https://api.pampacode.com',
      description: 'Servidor local',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    {
      name: 'Shows',
      description: 'Operaciones con shows',
    },
    {
      name: 'Auth',
      description: 'Autenticación de usuarios',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // documenta todos los archivos en tu carpeta de rutas
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
