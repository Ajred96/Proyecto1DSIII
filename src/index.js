require('dotenv').config();
const express = require('express');
const promClient = require('./utils/prometheus');
const axios = require('axios');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swaggerConfig');

const {json} = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/*const sagaMiddleware = async (req, res, next) => {
    const {action, payload, producto} = req.body;
    console.log('entre: ', action, payload, producto)
    try {
        switch (action) {
            case 'createOrder':
                // Paso 1: Crear un pedido
                console.log('crear el pedido')
                await createOrder({body: payload.order}, res);
                if (res.statusCode !== 200) throw new Error('Error creando el pedido');

                // Paso 2: Procesar el pago
                console.log('procesar pago')
                await processPayment({body: payload.order}, res);
                if (res.statusCode !== 200) throw new Error('Error procesando el pago');

                // Paso 3: Actualizar inventario
                console.log('actualizar inventario')
                const path = 'http://stock-service/article/';

                // Realiza la solicitud PUT con axios, adjuntando el body
                const response = await axios.put(path, producto);

                // Devuelve la respuesta del servicio en la respuesta de la API Gateway
                console.log('Responde stock: , ', JSON.stringify(response));
                //res.json(response.data);
                if (response.status !== 200) throw new Error('Error actualizando el inventario');

                // Si todo sale bien
                console.log('todo bien')
                res.status(200).json({message: 'Orden de compra creada exitosamente'});
                break;

            default:
                res.status(400).json({message: 'Acción no reconocida'});
        }
    } catch (error) {
        console.log('error 1:', error.response ? error.response.data : error.message);
        await compensate();
        res.status(500).json({error: error.message});
    }
};

const compensate = async () => {
    try {
        await cancel({orderId: 1234});
    } catch (error) {
        console.error('Error en la compensación: ', error.message);
    }
};*/


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
        const response = await axios.put(path, body);

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


// Rutas de Compras
/*app.post('/order', sagaMiddleware, (req, res) => {
    console.log('saga res: ', JSON.stringify(res))
});
app.get('/obtenerCompras', async (req, res) => {
    try {
        // Realiza una solicitud a la URL contenida en `path`
        const path = 'http://compras-service/compras';
        const response = await axios.get(path);
        res.json(response.data); // Devuelve la respuesta obtenida
    } catch (error) {
        res.status(500).json({
            error: 'Error connecting to the get orders',
            details: error.response?.data || 'No additional error data get orders'
        });
    }
});

app.post('/crearCompra', async (req, res) => {
    try {
        const path = 'http://compras-service/compras';
        const body = req.body; // Captura el body de la solicitud POST

        // Realiza la solicitud POST con axios, adjuntando el body
        const response = await axios.post(path, body);

        // Devuelve la respuesta del servicio en la respuesta de la API Gateway
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Error connecting to the provided path create orders',
            details: error.response?.data || 'No additional error data create orders'
        });
    }
});

app.put('/actualizarCompra/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const path = `http://compras-service/compras/${id}`;
        const body = req.body; // Captura el body de la solicitud PUT

        // Realiza la solicitud POST con axios, adjuntando el body
        const response = await axios.put(path, body);

        // Devuelve la respuesta del servicio en la respuesta de la API Gateway
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Error connecting to the provided path update orders',
            details: error.response?.data || 'No additional error data update orders'
        });
    }
});

app.delete('/borrarCompra/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const path = `http://compras-service/compras/${id}`;
        const body = req.body; // Captura el body de la solicitud POST

        // Realiza la solicitud POST con axios, adjuntando el body
        const response = await axios.put(path, body);

        // Devuelve la respuesta del servicio en la respuesta de la API Gateway
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Error connecting to the provided path delete orders',
            details: error.response?.data || 'No additional error data delete orders'
        });
    }
});*/


// Rutas de Autenticación
app.post('/validarToken', async (req, res) => {
    try {
        const path = 'http://143.198.177.50:30005/validar-token';
        const body = req.body; // Captura el body de la solicitud POST

        // Realiza la solicitud POST con axios, adjuntando el body
        const response = await axios.post(path, body);

        // Devuelve la respuesta del servicio en la respuesta de la API Gateway
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Error connecting to the token microservice',
            details: error.response?.data || 'No additional error data token microservice'
        });
    }
});

app.post('/registrarUsuario', async (req, res) => {
    try {
        const path = 'http://143.198.177.50:30000/usuarios/registrar';
        const body = req.body; // Captura el body de la solicitud POST

        // Realiza la solicitud POST con axios, adjuntando el body
        const response = await axios.post(path, body);

        // Devuelve la respuesta del servicio en la respuesta de la API Gateway
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Error connecting to the user register microservice',
            details: error.response?.data || 'No additional error data user register microservice'
        });
    }
});

app.post('/identificarUsuario', async (req, res) => {
    try {
        const path = 'http://143.198.177.50:30000/identificar-usuario';
        const body = req.body; // Captura el body de la solicitud POST

        // Realiza la solicitud POST con axios, adjuntando el body
        const response = await axios.post(path, body);

        // Devuelve la respuesta del servicio en la respuesta de la API Gateway
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Error connecting to the login microservice',
            details: error.response?.data || 'No additional error data login microservice'
        });
    }
});


// Rutas de pagos
/*app.get('/obtenerPago/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const path = `http://pagos-service/pagos/${id}`;
        const response = await axios.get(path);
        res.json(response.data); // Devuelve la respuesta obtenida
    } catch (error) {
        res.status(500).json({
            error: 'Error connecting to the get payment',
            details: error.response?.data || 'No additional error data get payment'
        });
    }
});

app.post('/crearPago', async (req, res) => {
    try {
        const path = 'http://pagos-service/pagos';
        const body = req.body; // Captura el body de la solicitud POST

        // Realiza la solicitud POST con axios, adjuntando el body
        const response = await axios.post(path, body);

        // Devuelve la respuesta del servicio en la respuesta de la API Gateway
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Error connecting to the provided path create payment',
            details: error.response?.data || 'No additional error data create payment'
        });
    }
});

app.post('/procesarPago/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const path = `http://pagos-service/pagos/${id}/procesar`;
        const body = req.body; // Captura el body de la solicitud POST

        // Realiza la solicitud POST con axios, adjuntando el body
        const response = await axios.post(path, body);

        // Devuelve la respuesta del servicio en la respuesta de la API Gateway
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Error connecting to the provided path process payment',
            details: error.response?.data || 'No additional error data process payment'
        });
    }
});*/


// Rutas de favoritos
app.get('/obtenerFavoritos/:id', async (req, res) => {
    try {
        // Realiza una solicitud a la URL contenida en `path`
        const {id} = req.params;
        const path = `http://favorites-service/favorites/${id}`;
        const response = await axios.get(path);
        res.json(response.data); // Devuelve la respuesta obtenida
    } catch (error) {
        res.status(500).json({
            error: 'Error connecting to the get favorites',
            details: error.response?.data || 'No additional error data get favorites'
        });
    }
});

app.post('/crearFavorito', async (req, res) => {
    try {
        const path = `http://favorites-service/favorites`;
        const body = req.body; // Captura el body de la solicitud POST

        // Realiza la solicitud POST con axios, adjuntando el body
        const response = await axios.post(path, body);

        // Devuelve la respuesta del servicio en la respuesta de la API Gateway
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Error connecting to the provided path create favorites',
            details: error.response?.data || 'No additional error data create favorites'
        });
    }
});

app.patch('/actualizarFavorito', async (req, res) => {
    try {
        const path = `http://favorites-service/favorites`;
        const body = req.body; // Captura el body de la solicitud PUT

        // Realiza la solicitud POST con axios, adjuntando el body
        const response = await axios.patch(path, body);

        // Devuelve la respuesta del servicio en la respuesta de la API Gateway
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Error connecting to the provided path update favorites',
            details: error.response?.data || 'No additional error data update favorites'
        });
    }
});

app.post('/borrarFavorito', async (req, res) => {
    try {
        const path = `http://favorites-service/favorites/delete`;
        const body = req.body; // Captura el body de la solicitud POST

        // Realiza la solicitud POST con axios, adjuntando el body
        const response = await axios.post(path, body);

        // Devuelve la respuesta del servicio en la respuesta de la API Gateway
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Error connecting to the provided path delete favorites',
            details: error.response?.data || 'No additional error data delete favorites'
        });
    }
});

// Exponer métricas para Prometheus
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', promClient.contentType);
    res.send(await promClient.metrics());
});

app.listen(PORT, () => {
    console.log(`API Gateway escuchando en el puerto ${PORT}`);
    console.log(`Swagger docs are available at http://localhost:${PORT}/api-docs`);
});
