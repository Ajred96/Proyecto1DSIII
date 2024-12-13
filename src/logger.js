const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(), // Log en la consola
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Logs de errores
        new winston.transports.File({ filename: 'logs/combined.log' }) // Logs combinados
    ],
});

module.exports = logger;
