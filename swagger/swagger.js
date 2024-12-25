const swaggerUi = require('swagger-ui-express');
const yaml = require('yaml');
const fs = require('fs');
const file = fs.readFileSync('./swagger/swagger.yaml', 'utf8');
const swaggerDocument = yaml.parse(file);

module.exports = {swaggerUi, swaggerDocument};

