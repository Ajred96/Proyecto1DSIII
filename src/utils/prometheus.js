const client = require('prom-client');

// Definir el histograma para el tiempo de las solicitudes
const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [50, 100, 300, 500, 1000, 3000, 5000] // Intervalos de tiempo
});

// Middleware para recolectar métricas de cada solicitud
const collectMetrics = (req, res, next) => {
    const end = httpRequestDurationMicroseconds.startTimer();
    res.on('finish', () => {
        end({
            method: req.method,
            route: req.route ? req.route.path : req.url,
            status_code: res.statusCode
        });
    });
    next();
};

// Función para configurar las métricas
const setupMetrics = (app) => {
    app.use(collectMetrics); // Usa el middleware para recolectar métricas
    app.get('/metrics', async (req, res) => {
        res.set('Content-Type', client.register.contentType);
        res.send(await client.register.metrics()); // Devuelve las métricas recogidas
    });
};

module.exports = {setupMetrics};
