require('./tracing');

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const swaggerUi = require('swagger-ui-express');
const {json} = require("express");
const {v4: uuidv4} = require('uuid');

const {setupMetrics} = require('./utils/prometheus');
const logger = require('./logger');
const expressWinston = require('express-winston');
const swaggerSpec = require('../swaggerConfig');
const config = require('./config');

// Inicializar Express
const app = express();
const PORT = process.env.PORT || 3000;

// // Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());

// Middleware para generar un UUID en cada solicitud
app.use((req, res, next) => {
    req.id = uuidv4();
    logger.info(`Request ID: ${req.id}`);
    next();
});

// Middleware para registrar todas las solicitudes
app.use(expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}} | Request ID: {{req.id}}",
    expressFormat: true,
    colorize: false
}));

// Registrar errores en caso de fallo
app.use(expressWinston.errorLogger({
    winstonInstance: logger
}));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Configuración de métricas Prometheus
setupMetrics(app);

// Función genérica para manejar solicitudes HTTP
async function handleRequest(req, res, method, path, data = null) {
    try {
        const config = {method, url: path};
        if (data) config.data = data;

        const response = await axios(config);
        res.json(response.data);
    } catch (error) {
        // Registra el error en el logger
        logger.error(`Error en la solicitud ${method} ${path} | Request ID: ${req.id} | Error: ${error.message}`, {
            requestData: data,
            errorDetails: error.response?.data || error.message,
            statusCode: error.response?.status,
            url: path
        });

        // Responde con un error 500 y detalles del fallo
        res.status(500).json({
            error: `Error connecting to ${path}`,
            details: error.response?.data || 'No additional error data'
        });
    }
}


// Rutas de inventario
app.get('/productos', (req, res) => {
    handleRequest(req, res, 'get', `${config.stockServiceUrl}/article/all?ascendingOrder=true&comparator=article`);
});

app.post('/productos', (req, res) => {
    handleRequest(req, res, 'post', `${config.stockServiceUrl}/article/`, req.body);
});

app.put('/actualizarProductos', (req, res) => {
    handleRequest(req, res, 'put', `${config.stockServiceUrl}/article/`, req.body);
});

app.post('/categorias', (req, res) => {
    handleRequest(req, res, 'post', `${config.stockServiceUrl}/category/`, req.body);
});

app.post('/marcas', (req, res) => {
    handleRequest(req, res, 'post', `${config.stockServiceUrl}/brand/`, req.body);
});


// Rutas de Autenticación
app.post('/validarToken', (req, res) => {
    handleRequest(req, res, 'post', `${config.tokenService}/validar-token`, req.body);
});

app.post('/registrarUsuario', (req, res) => {
    handleRequest(req, res, 'post', `${config.authServiceUrl}/usuarios/registrar`, req.body);
});

app.post('/identificarUsuario', (req, res) => {
    handleRequest(req, res, 'post', `${config.authServiceUrl}/identificar-usuario`, req.body);
});


// Rutas de favoritos
app.get('/obtenerFavoritos/:id', (req, res) => {
    handleRequest(req, res, 'get', `${config.favoritesServiceUrl}/favorites/${req.params.id}`);
});

app.post('/crearFavorito', (req, res) => {
    handleRequest(req, res, 'post', `${config.favoritesServiceUrl}/favorites`, req.body);
});

app.patch('/actualizarFavorito', (req, res) => {
    handleRequest(req, res, 'patch', `${config.favoritesServiceUrl}/favorites`, req.body);
});

app.post('/borrarFavorito', (req, res) => {
    handleRequest(req, res, 'post', `${config.favoritesServiceUrl}/favorites/delete`, req.body);
});

app.listen(PORT, () => {
    console.log(`API Gateway escuchando en el puerto ${PORT}`);
    console.log(`Swagger docs are available at http://localhost:${PORT}/api-docs`);
});