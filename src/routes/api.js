const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const inventoryController = require('../controllers/inventoryController');
const orderController = require('../controllers/orderController');
const paymentController = require('../controllers/paymentController');
const favoritesController = require('../controllers/favoritesController');
const sagaMiddleware = require('../middlewares/sagaMiddleware');

// Rutas de autenticación
router.post('/auth', authController.authenticate);

// Rutas de inventario
router.get('/inventory', inventoryController.getInventory);
router.post('/inventory/update', inventoryController.update);

router.post('/order', sagaMiddleware, (req, res) => {
    const { action, payload } = req.body;

    if (action === 'createOrder') {
        const { order, payment } = payload;
        // Aquí realizar la lógica para crear la orden
        // ...
        res.status(200).send({ message: 'Orden creada con éxito' });
    } else {
        res.status(400).send({ message: 'Acción no reconocida' });
    }
});
router.post('/createOrder', orderController.createOrder);
router.post('/order/cancel', orderController.cancel);

// Rutas de pagos
router.post('/payment', paymentController.processPayment);

// Rutas de favoritos
router.get('/favorites', favoritesController.getFavorites);

module.exports = router;
