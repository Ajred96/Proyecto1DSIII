require('dotenv').config();
const express = require('express');
const promClient = require('./utils/prometheus');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rutas de la API
app.use('/api', apiRoutes);

// Exponer métricas para Prometheus
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', promClient.contentType);
    res.send(await promClient.metrics());
});

app.listen(PORT, () => {
    console.log(`API Gateway escuchando en el puerto ${PORT}`);
});
