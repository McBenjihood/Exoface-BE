import api_routes from '@/routes/index';

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

const app = express();

const swaggerDocument = JSON.parse(
    fs.readFileSync(path.join('exoscale-api-openapi-source.json'), 'utf8')
);

swaggerDocument.servers = [
    {
        url: 'http://localhost:4010',
        description: 'Local Prism Mock Server'
    }
];

app.use('/api/exoscale/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', api_routes)

app.listen(3000, () => {
    console.log('Server läuft auf Port 3000');
});

