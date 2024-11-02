exports.authenticate = async (req, res) => {
    try {
        // Simulación de respuesta exitosa
        if (Math.random() > 0.3) {
            res.status(200).json({message: 'Autenticación exitosa'});
        } else {
            throw new Error('Error en autenticación');
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
