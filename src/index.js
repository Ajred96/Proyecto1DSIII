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

app.get('/productos/:id', (req, res) => {
    handleRequest(req, res, 'get', `${config.stockServiceUrl}/article/?id=${req.params.id}`);
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

// Rutas Simulación Compras, Pagos y PATRON SAGA

// Función genérica para simular operaciones con posible éxito/fallo
function simulateOperation(successRate = 0.95) {
    return Math.random() < successRate;
}

// Simulación de una compra
async function simulatePurchase(data) {
    logger.info(`Simulando compra: ${JSON.stringify(data)}`);
    if (!simulateOperation()) {
        throw new Error('Error en la simulación de compra.');
    }
    const purchaseId = uuidv4(); // Generar ID para la compra
    logger.info(`Compra exitosa: ID ${purchaseId}`);
    return purchaseId;
}

// Simulación de un pago
async function simulatePayment(data) {
    logger.info(`Simulando pago: ${JSON.stringify(data)}`);
    if (!simulateOperation()) {
        throw new Error('Error en la simulación de pago.');
    }
    const paymentId = uuidv4(); // Generar ID para el pago
    logger.info(`Pago exitoso: ID ${paymentId}`);
    return paymentId;
}

// Compensación: borrar la compra
async function compensatePurchase(purchaseId) {
    logger.info(`Compensando compra: ID ${purchaseId}`);
    // Simula la eliminación de la compra
    return `Compra con ID ${purchaseId} eliminada.`;
}

// Compensación: revertir el pago
async function compensatePayment(paymentId) {
    logger.info(`Revirtiendo pago: ID ${paymentId}`);
    // Simula la reversión del pago
    return `Pago con ID ${paymentId} revertido.`;
}

// Simulación del patrón Saga para una transacción de compra y pago
async function simulateSaga(req, res) {
    const {productos, total, token} = req.body;
    let purchaseId, paymentId;

    try {
        // Paso 0: Validar el token
        const tokenValidationResponse = await validateToken(token);
        if (!tokenValidationResponse || tokenValidationResponse.status !== 'succes') {
            throw new Error('Token inválido');
        }

        // Paso 1: Simular compra
        purchaseId = await simulatePurchase({productos});

        // Paso 2: Simular pago
        paymentId = await simulatePayment({total});

        // Paso 3: Actualizar el inventario
        await actualizarProductos(productos);

        // Confirmar transacción
        res.json({
            message: 'Transacción completada exitosamente.',
            purchaseId,
            paymentId,
        });
    } catch (error) {
        logger.error(`Error en la transacción: ${error.message}`);

        // Compensar pasos según lo que haya fallado
        if (paymentId) await compensatePayment(paymentId);
        if (purchaseId) await compensatePurchase(purchaseId);

        res.status(500).json({
            error: 'Transacción fallida. Se realizaron compensaciones.',
            details: error.message,
        });
    }
}

// Valido el token recibido antes de hacer peticiones a los microservicios
async function validateToken(token) {
    try {
        logger.info(`Validando token: ${token}`);
        const response = await axios.post(`${config.tokenService}/validar-token`, token);
        return response.data;
    } catch (error) {
        logger.error(`Error al validar el token: ${error.message}`);
        return null; // Retornar null si falla la validación
    }
}

// Consulta el producto antes de actualizar para calcular si hay stock suficiente
async function consultarProducto(productId) {
    try {
        logger.info(`Consultado producto: ${productId}`);
        const response = await axios.get(`${config.stockServiceUrl}/article/?id=${productId}`);
        return response.data; // Retorna los datos del producto
    } catch (error) {
        logger.error(`Error al consultar el producto con ID ${productId}: ${error.message}`);
        throw new Error(`No se pudo consultar el producto con ID ${productId}.`);
    }
}

async function actualizarProductos(productos) {
    logger.info(`Actualizando productos: ${productos}`);
    // Mapear y procesar cada producto
    const updatePromises = productos.map(async (producto) => {
        // Consultar el producto actual en el inventario
        const productoActual = await consultarProducto(producto.id);

        if (!productoActual || !productoActual.stock) {
            throw new Error(`Producto con ID ${producto.id} no encontrado o sin stock válido.`);
        }

        // Calcular el nuevo stock
        const nuevoStock = productoActual.stock - producto.cantidadComprada;

        if (nuevoStock < 0) {
            throw new Error(`Stock insuficiente para el producto con ID ${producto.id}.`);
        }

        // Preparar el payload para actualizar el producto
        const payload = {
            id: productoActual.id,
            name: productoActual.name,
            description: productoActual.description,
            stock: nuevoStock,
            price: productoActual.price,
            brandId: productoActual.brand.id,
            categoryIds: productoActual.categories.map((categoria) => categoria.id),
        };

        // Actualizar el producto
        await axios.put(`${config.stockServiceUrl}/article/`, payload);
        logger.info(`Producto con ID ${producto.id} actualizado exitosamente. Nuevo stock: ${nuevoStock}`);
    });

    // Esperar a que todos los productos sean actualizados
    await Promise.all(updatePromises);
}


// Rutas de compras y pagos
app.post('/realizarCompra', simulateSaga);


app.listen(PORT, () => {
    console.log(`API Gateway escuchando en el puerto ${PORT}`);
    console.log(`Swagger docs are available at http://localhost:${PORT}/api-docs`);
});