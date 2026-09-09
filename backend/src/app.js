const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

const app = express();

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../exoscale-api-openapi-source.json'), 'utf8')
);

swaggerDocument.servers = [
  {
    url: 'http://localhost:4010',
    description: 'Local Prism Mock Server'
  }
];

app.use('/api/exoscale/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3000, () => {
  console.log('Server läuft auf Port 3000');
});

app.post('/api/login', async (req, res) =>{
  const { email, password } = req.body;
  
});