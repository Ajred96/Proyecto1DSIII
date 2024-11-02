exports.processPayment = async (req, res) => {
    try {
        // Simulación de respuesta exitosa
        if (Math.random() > 0.3) {
            res.status(200).json({message: 'Pago procesado exitosamente', paymentId: 5678});
        } else {
            throw new Error('El servicio de pagos no esta disponible');
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};