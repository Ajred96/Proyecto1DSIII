require('dotenv').config();
const express = require('express');
const promClient = require('./utils/prometheus');
const axios = require('axios');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swaggerConfig');
const sagaMiddleware = require('./middlewares/sagaMiddleware');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas de inventario
app.get('/productos', async (req, res) => {
    try {
        // Realiza una solicitud a la URL contenida en `path`
        const path = 'http://stock-service/article/all?ascendingOrder=true&comparator=article';
        const response = await axios.get(path);
        res.json(response.data); // Devuelve la respuesta obtenida
    } catch (error) {
        res.status(500).json({
            error: 'Error connecting to the provided path get all',
            details: error.response?.data || 'No additional error data'
        });
    }
});

app.post('/productos', async (req, res) => {
    try {
        const path = 'http://stock-service/article/';
        const body = req.body; // Captura el body de la solicitud POST

        // Realiza la solicitud POST con axios, adjuntando el body
        const response = await axios.post(path, body);

        // Devuelve la respuesta del servicio en la respuesta de la API Gateway
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Error connecting to the provided path create product',
            details: error.response?.data || 'No additional error data'
        });
    }
});

app.put('/actualizarProductos', async (req, res) => {
    try {
        const path = 'http://stock-service/article/';
        const body = req.body; // Captura el body de la solicitud POST

        // Realiza la solicitud POST con axios, adjuntando el body
        const response = await axios.post(path, body);

        // Devuelve la respuesta del servicio en la respuesta de la API Gateway
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Error connecting to the provided path create product',
            details: error.response?.data || 'No additional error data'
        });
    }
});

app.post('/categorias', async (req, res) => {
    try {
        const path = 'http://stock-service/category/';
        const body = req.body; // Captura el body de la solicitud POST

        // Realiza la solicitud POST con axios, adjuntando el body
        const response = await axios.post(path, body);

        // Devuelve la respuesta del servicio en la respuesta de la API Gateway
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Error connecting to the provided path create product',
            details: error.response?.data || 'No additional error data'
        });
    }
});

app.post('/marcas', async (req, res) => {
    try {
        const path = 'http://stock-service/brand/';
        const body = req.body; // Captura el body de la solicitud POST

        // Realiza la solicitud POST con axios, adjuntando el body
        const response = await axios.post(path, body);

        // Devuelve la respuesta del servicio en la respuesta de la API Gateway
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Error connecting to the provided path create product',
            details: error.response?.data || 'No additional error data'
        });
    }
});

/**
 * // Rutas de autenticación
 * router.post('/auth', authController.authenticate);
 *
 * // IMPLEMENTACION SAGA
 * router.post('/order', sagaMiddleware, (req, res) => {
 *     const {action, payload} = req.body;
 *
 *     if (action === 'createOrder') {
 *         const {order, payment} = payload;
 *         // Aquí realizar la lógica para crear la orden
 *         // ...
 *         res.status(200).send({message: 'Orden creada con éxito'});
 *     } else {
 *         res.status(400).send({message: 'Acción no reconocida'});
 *     }
 * });
 * router.post('/createOrder', orderController.createOrder);
 * router.post('/order/cancel', orderController.cancel);
 *
 * // Rutas de pagos
 * router.post('/payment', paymentController.processPayment);
 *
 * // Rutas de favoritos
 * router.get('/favorites', favoritesController.getFavorites);
 */

// Exponer métricas para Prometheus
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', promClient.contentType);
    res.send(await promClient.metrics());
});

app.listen(PORT, () => {
    console.log(`API Gateway escuchando en el puerto ${PORT}`);
    console.log(`Swagger docs are available at http://localhost:${PORT}/api-docs`);
});
