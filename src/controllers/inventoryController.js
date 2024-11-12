// controllers/inventoryController.js
const axios = require('axios');

// Dirección del servicio de inventario
const INVENTORY_SERVICE_URL = 'http://127.0.0.1:55729'; // URL del servicio expuesto por Minikube

exports.getInventory = async (req, res) => {
    try {
        const response = await axios.get(`${INVENTORY_SERVICE_URL}/inventory`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el inventario', error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const response = await axios.post(`${INVENTORY_SERVICE_URL}/inventory/update`, req.body);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el inventario', error: error.message });
    }
};


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
