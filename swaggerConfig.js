// swaggerConfig.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API GateWay Documentation',
            version: '1.0.0',
            description: 'El **API Gateway** para este e-commerce en Node.js utiliza el patrón de **Saga Orquestado** para gestionar las transacciones distribuidas entre los microservicios de autenticación, compra, pago, e inventario. Este gateway es la entrada única para el frontend, recibiendo todas las peticiones de los usuarios y dirigiéndolas a los servicios correspondientes.\n' +
                '\n' +
                '**Arquitectura y funcionamiento:**\n' +
                '1. **Orquestación de Saga:** Al aplicar el patrón de Saga, el API Gateway coordina las transacciones en secuencias predefinidas entre los microservicios. Por ejemplo, cuando se realiza una compra, el gateway:\n' +
                '   - Autentica al usuario.\n' +
                '   - Verifica el inventario del producto.\n' +
                '   - Crea la orden de compra.\n' +
                '   - Procesa el pago.\n' +
                '   - Actualiza el inventario del producto.\n' +
                '   Si algún paso falla, el gateway ejecuta pasos de **compensación** en los servicios correspondientes (como revertir la orden de compra o el pago), garantizando la consistencia en el sistema.\n' +
                '\n' +
                '2. **Kubernetes:** El gateway se implementa en un entorno de Kubernetes, permitiendo la escalabilidad y la alta disponibilidad del sistema, con despliegues automáticos y monitoreo constante. Los microservicios individuales también están desplegados en el cluster de Minikube, y la configuración del gateway permite su acceso directo y seguro.\n' +
                '\n' +
                '3. **Gestión de Errores y Retries:** El API Gateway cuenta con lógica de **reintentos** para manejar fallos temporales de los microservicios. Si un servicio tarda en responder, el gateway puede reintentar la petición según políticas configuradas o activar el flujo de compensación en el patrón de Saga.\n' +
                '\n' +
                '4. **Tecnologías:**\n' +
                '   - **Node.js** y **Express** para implementar la lógica del gateway.\n' +
                '   - **Kubernetes** para la orquestación del cluster.\n' +
                '\n' +
                'Este API Gateway proporciona una interfaz confiable para el e-commerce, manejando transacciones distribuidas con el patrón de Saga y asegurando la consistencia y recuperación en caso de fallos, garantizando así una experiencia de compra segura y fluida para los usuarios.'
        },
        tags: [
            {
                "name": "Stock Microservice",
                "description": "It allows you to create brands, categorizes, articles, update articles and consult them.",
            },
            {
                "name": "Order Microservice",
                "description": "Allows you to create and update purchase orders",
            },
            {
                "name": "Payment Microservice",
                "description": "Allows you to create and update payment processes"
            },
            {
                "name": "Authentication Microservice",
                "description": "It allows you to log in and obtain a token with which to make requests to the other microservices, providing a layer of security to operations"
            }
        ],
        paths: {
            "/productos": {
                get: {
                    tags: [
                        "Stock Microservice"
                    ],
                    summary: "Get all articles",
                    description: "Get all articles",
                    responses: {
                        200: {
                            description: "OK",
                            content: {
                                "*/*": {
                                    schema: {
                                        "$ref": "*/*"
                                    }
                                }
                            }
                        },
                    },
                },
                post: {
                    tags: [
                        "Stock Microservice"
                    ],
                    summary: "Add a new article to the stock",
                    description: "Add a new article to the stock",
                    requestBody: {
                        description: "Create a new article in the stock",
                        content: {
                            "application/json": {
                                schema: {
                                    "$ref": "#/components/schemas/article"
                                }
                            },
                        },
                        required: true
                    },
                    responses: {
                        200: {
                            description: "OK",
                            content: {
                                "application/json": {
                                    schema: {
                                        "$ref": "#/components/schemas/article"
                                    }
                                },
                            }
                        },
                    },
                }
            },
            "/actualizarProductos": {
                put: {
                    tags: [
                        "Stock Microservice"
                    ],
                    summary: "Update or create a new article to the stock",
                    description: "Update or create a new article to the stock",
                    requestBody: {
                        description: "Update or create a new article in the stock",
                        content: {
                            "application/json": {
                                schema: {
                                    "$ref": "#/components/schemas/article"
                                }
                            },
                        },
                        required: true
                    },
                    responses: {
                        200: {
                            description: "OK",
                            content: {
                                "application/json": {
                                    schema: {
                                        "$ref": "#/components/schemas/article"
                                    }
                                },
                            }
                        },
                    },
                }
            },
            "/categorias": {
                post: {
                    tags: [
                        "Stock Microservice"
                    ],
                    summary: "Create a new category",
                    description: "Create a new category",
                    requestBody: {
                        description: "Create a new category",
                        content: {
                            "application/json": {
                                schema: {
                                    "$ref": "#/components/schemas/category"
                                }
                            },
                        },
                        required: true
                    },
                    responses: {
                        200: {
                            description: "OK",
                            content: {
                                "application/json": {
                                    schema: {
                                        "$ref": "#/components/schemas/category"
                                    }
                                },
                            }
                        },
                    },
                }
            },
            "/marcas": {
                post: {
                    tags: [
                        "Stock Microservice"
                    ],
                    summary: "Create a new brand",
                    description: "Create a new brand",
                    requestBody: {
                        description: "Create a new brand",
                        content: {
                            "application/json": {
                                schema: {
                                    "$ref": "#/components/schemas/brand"
                                }
                            },
                        },
                        required: true
                    },
                    responses: {
                        200: {
                            description: "OK",
                            content: {
                                "application/json": {
                                    schema: {
                                        "$ref": "#/components/schemas/brand"
                                    }
                                },
                            }
                        },
                    },
                }
            },
        },
        components: {
            schemas: {
                article: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                            format: "int64",
                            example: 10
                        },
                        name: {
                            type: "string",
                            example: 1
                        },
                        description: {
                            type: "string",
                            example: "string"
                        },
                        stock: {
                            type: "integer",
                            format: "int64",
                            example: 5
                        },
                        price: {
                            type: "integer",
                            format: "int64",
                            example: 5000
                        },
                        brandId: {
                            type: "integer",
                            format: "int64",
                            example: 2
                        },
                        categoryIds: {
                            type: "object",
                            example: [1]
                        },
                    },
                },
                category: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                            format: "int64",
                            example: 1
                        },
                        name: {
                            type: "string",
                            example: "categoria"
                        },
                        description: {
                            type: "string",
                            example: "string"
                        }
                    },
                },
                brand: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                            format: "int64",
                            example: 1
                        },
                        name: {
                            type: "string",
                            example: "marca"
                        },
                        description: {
                            type: "string",
                            example: "string"
                        }
                    },
                },
            },
        }
    },
    apis: ['./src/index.js'], // Ruta a tus archivos de rutas donde documentarás las APIs
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
