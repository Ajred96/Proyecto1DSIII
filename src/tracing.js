const {NodeSDK} = require('@opentelemetry/sdk-node');
const {getNodeAutoInstrumentations} = require('@opentelemetry/auto-instrumentations-node');
const {ConsoleSpanExporter, SimpleSpanProcessor} = require('@opentelemetry/sdk-trace-node');
const {diag, DiagConsoleLogger, DiagLogLevel} = require('@opentelemetry/api');
const {PrometheusExporter} = require('@opentelemetry/exporter-prometheus');

// Configurar el logger de diagnóstico (para ver más detalles de la instrumentación)
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

// Configuración del exportador
const exporter = new PrometheusExporter({startServer: true});

// Inicializar OpenTelemetry
const sdk = new NodeSDK({
    traceExporter: new ConsoleSpanExporter(), // Cambia esto por un exportador real en producción
    instrumentations: [getNodeAutoInstrumentations()],
    metricReader: exporter
});

// Función para iniciar el SDK
const startTracing = async () => {
    try {
        await sdk.start(); // Asegúrate de que sdk.start() devuelve una promesa
        console.log("OpenTelemetry Tracing iniciado");
    } catch (error) {
        console.error("Error al iniciar OpenTelemetry Tracing", error);
    }
};

// Llama a la función para iniciar el tracing
startTracing();

module.exports = sdk;