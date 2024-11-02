exports.createOrder = async (req, res) => {
    try {
        // Simulación de respuesta exitosa
        if (Math.random() > 0.5) {
            res.status(200).json({message: 'Orden de compra creada exitosamente', orderId: 1234});
        } else {
            throw new Error('El servicio de compras no esta disponible');
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.cancel = async (req, res) => {
    try {
        // Simulación de respuesta exitosa
        if (Math.random() > 0.3) {
            res.status(200).json({message: 'Cancelacion de la orden de compra 1234 fue exitosa'});
        } else {
            throw new Error('El servicio de cancelacion de orden de compra no esta disponible');
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};