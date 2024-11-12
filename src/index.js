require('dotenv').config();
const express = require('express');
const promClient = require('./utils/prometheus');
const apiRoutes = require('./routes/api');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rutas de la API
app.use('/api', apiRoutes);

// Rutas personalizadas
app.get('/custom', async (req, res) => {
    const path = req.query.path || 'default';

    if (path === 'default') {
        res.json({ response: "this is a simple test of the custom path" });
    } else {
        try {
            // Realiza una solicitud a la URL contenida en `path`
            const response = await axios.get(path);
            res.json(response.data); // Devuelve la respuesta obtenida
        } catch (error) {
            res.status(500).json({
                error: 'Error connecting to the provided path',
                details: error.message
            });
        }
    }
});

// Exponer métricas para Prometheus
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', promClient.contentType);
    res.send(await promClient.metrics());
});

app.listen(PORT, () => {
    console.log(`API Gateway escuchando en el puerto ${PORT}`);
});
