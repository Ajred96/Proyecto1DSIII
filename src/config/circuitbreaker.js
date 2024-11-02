const CircuitBreaker = require('circuit-breaker-js');

const options = {
    windowDuration: 10000, // Tiempo de ventana de error en ms
    numBuckets: 10,
    timeoutDuration: 3000, // Tiempo de espera para fallos
    errorThreshold: 50, // % de errores antes de abrir el circuito
    volumeThreshold: 5 // Número mínimo de requests antes de activarse
};

module.exports = new CircuitBreaker(options);
