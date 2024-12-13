const client = require('prom-client');

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 0.5, 1, 1.5, 2, 5] // buckets for response time
});

module.exports = (app) => {
    app.use((req, res, next) => {
        const end = httpRequestDurationMicroseconds.startTimer();
        res.on('finish', () => {
            end({route: req.route ? req.route.path : '', method: req.method, code: res.statusCode});
        });
        next();
    });

    app.get('/metrics', async (req, res) => {
        res.set('Content-Type', client.register.contentType);
        res.end(await client.register.metrics());
    });
};
