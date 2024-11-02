exports.getInventory = async (req, res) => {
    try {
        // Simulación de respuesta exitosa
        if (Math.random() > 0.3) {
            res.status(200).json({items: [{id: 1, name: 'Producto 1', stock: 50}]});
        } else {
            throw new Error('El servicio del inventario no esta disponible');
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.update = async (req, res) => {
    try {
        // Simulación de respuesta exitosa
        if (Math.random() > 0.5) {
            res.status(200).json({message: 'Producto actualizado exitosamente'});
        } else {
            throw new Error('El servicio de actualizacion del inventario no esta disponible');
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
