const axios = require('axios');

const PORT = process.env.PORT || 3000;

const sagaMiddleware = async (req, res, next) => {
    // Aquí va mi la lógica de negocio y qué pasos se deben seguir
    const { action, payload } = req.body;
    console.log('entre: ', action, payload)
    try {
        let result;

        switch (action) {
            case 'createOrder':
                // Paso 1: Crear un pedido
                console.log('creo el pedido')
                result = await axios.post(`http://localhost:${PORT}/api/createOrder`, { action, payload });
                if (result.status !== 200) throw new Error('Error creando el pedido');

                // Paso 2: Procesar el pago
                console.log('proceso pago')
                result = await axios.post(`http://localhost:${PORT}/api/payment`, payload.payment);
                if (result.status !== 200) throw new Error('Error procesando el pago');

                // Paso 3: Actualizar inventario
                console.log('actualizo inventario')
                result = await axios.post(`http://localhost:${PORT}/api/inventory/update`, { itemId: payload.order.itemId, quantity: payload.order.quantity });
                if (result.status !== 200) throw new Error('Error actualizando el inventario');

                // Si todo sale bien
                console.log('todo bien')
                res.status(200).json({ message: 'Transacción completada con éxito' });
                break;

            default:
                res.status(400).json({ message: 'Acción no reconocida' });
        }
    } catch (error) {
        // Manejo de errores y compensación
        console.log('error:', error.response ? error.response.data : error.message);
        await compensate(payload); // Llama a la función de compensación
        res.status(500).json({ error: error.message });
    }
};

const compensate = async (payload) => {
    // Aquí va la lógica de compensación si falla alguno de los pasos
    // Por ejemplo, si un pedido fue creado, deberías cancelarlo
    console.log('compenso')
    try {
        await axios.post(`http://localhost:${PORT}/api/order/cancel`, { orderId: payload.order.id });
        // Maneja la compensación para otros servicios si es necesario
    } catch (error) {
        console.log('error compensando')
        console.error('Error en la compensación: ', error.message);
    }
};

module.exports = sagaMiddleware;
