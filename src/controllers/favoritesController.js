exports.getFavorites = async (req, res) => {
    try {
        // Simulación de respuesta exitosa
        if (Math.random() > 0.3) {
            res.status(200).json({favorites: [{id: 1, name: 'Producto Favorito 1'}]});
        } else {
            throw new Error('El servicio de favoritos no esta disponible');
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};