const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger Konfiguration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Exoface API',
      version: '1.0.0',
      description: 'Backend für die Exoface Anwendung (Exoscale-Schnittstelle)',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  // Pfad zu den Dateien, die die Dokumentation (Kommentare) enthalten
  apis: ['./src/routes/*.js', './src/app.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Beispiel für eine dokumentierte Route
/**
 * @openapi
 * /api/status:
 *   get:
 *     summary: Gibt den Serverstatus zurück
 *     responses:
 *       200:
 *         description: Server läuft einwandfrei
 */
app.get('/api/status', (req, res) => {
  res.json({ success: true, message: "Das Backend läuft!" });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
  console.log(`Dokumentation verfügbar unter: http://localhost:${PORT}/api-docs`);
});
