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
            },
            {
                "name": "Favorites Microservice",
                "description": "Allows you to create and update favorites articles"
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
                            description: "List of articles retrieved successfully",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "array",
                                        items: {
                                            "$ref": "#/components/schemas/article"
                                        }
                                    }
                                }
                            }
                        },
                        500: {description: "Server error"}
                    },
                },
                post: {
                    tags: [
                        "Stock Microservice"
                    ],
                    summary: "Add a new article",
                    description: "Add a new article to the stock inventory",
                    requestBody: {
                        description: "Payload to create a new article",
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
                            description: "Article created successfully",
                            content: {
                                "application/json": {
                                    schema: {
                                        "$ref": "#/components/schemas/article"
                                    }
                                },
                            }
                        },
                        400: {
                            description: "Invalid request payload"
                        }
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
                        400: {
                            description: "Invalid request payload"
                        }
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
                        400: {
                            description: "Invalid request payload"
                        }
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
                        400: {
                            description: "Invalid request payload"
                        }
                    },
                }
            },
            "/registrarUsuario": {
                post: {
                    tags: [
                        "Authentication Microservice"
                    ],
                    summary: "Create a new user to the app",
                    description: "Create a user to the app",
                    requestBody: {
                        description: "Create a user in the app",
                        content: {
                            "application/json": {
                                schema: {
                                    "$ref": "#/components/schemas/user"
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
                                        "$ref": "#/components/schemas/user"
                                    }
                                },
                            }
                        },
                        400: {
                            description: "Invalid request payload"
                        }
                    },
                }
            },
            "/identificarUsuario": {
                post: {
                    tags: [
                        "Authentication Microservice"
                    ],
                    summary: "Validate that the user entered is the correct one",
                    description: "Validate that the user entered is the correct one",
                    requestBody: {
                        description: "Validate that the user entered is the correct one",
                        content: {
                            "application/json": {
                                schema: {
                                    "$ref": "#/components/schemas/userLogin"
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
                                        "$ref": "#/components/schemas/userLogin"
                                    }
                                },
                            }
                        },
                        400: {
                            description: "Invalid request payload"
                        }
                    },
                }
            },
            "/validarToken": {
                post: {
                    tags: [
                        "Authentication Microservice"
                    ],
                    summary: "Validate that the token is valid",
                    description: "Validate that the token is valid",
                    requestBody: {
                        description: "Validate that the token is valid",
                        content: {
                            "application/json": {
                                schema: {
                                    "$ref": "#/components/schemas/token"
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
                                        "$ref": "#/components/schemas/token"
                                    }
                                },
                            }
                        },
                        400: {
                            description: "Invalid request payload"
                        }
                    },
                }
            },
            "/obtenerFavoritos/{userId}": {
                get: {
                    tags: [
                        "Favorites Microservice"
                    ],
                    summary: "Get all favorites by user",
                    description: "Get all favorites by user",
                    parameters: [
                        {
                            "name": "userId",
                            "in": "path",
                            "description": "ID of the user to retrieve favorites for",
                            "required": true,
                            "schema": {
                                "type": "string"
                            }
                        }
                    ],
                    responses: {
                        200: {
                            description: "OK",
                            content: {
                                "application/json": {
                                    schema: {
                                        "$ref": "#/components/schemas/favoritesByUser"
                                    }
                                },
                            }
                        },
                        404: {
                            description: "User not found"
                        }
                    },
                }
            },
            "/crearFavorito": {
                post: {
                    tags: [
                        "Favorites Microservice"
                    ],
                    summary: "Create a new favorites by user id",
                    description: "Create a new favorites by user id",
                    requestBody: {
                        description: "Create a new favorites by user id",
                        content: {
                            "application/json": {
                                schema: {
                                    "$ref": "#/components/schemas/favorite"
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
                                        "$ref": "#/components/schemas/favorite"
                                    }
                                },
                            }
                        },
                        400: {
                            description: "Invalid request payload"
                        }
                    },
                }
            },
            "/actualizarFavorito": {
                patch: {
                    tags: [
                        "Favorites Microservice"
                    ],
                    summary: "Update a favorite by user id",
                    description: "Update a favorite by user id",
                    requestBody: {
                        description: "Update a favorite by user id",
                        content: {
                            "application/json": {
                                schema: {
                                    "$ref": "#/components/schemas/favoriteUpdate"
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
                                        "$ref": "#/components/schemas/favoriteUpdate"
                                    }
                                },
                            }
                        },
                        400: {
                            description: "Invalid request payload"
                        }
                    },
                }
            },
            "/borrarFavorito": {
                post: {
                    tags: [
                        "Favorites Microservice"
                    ],
                    summary: "Delete a new favorite by user id",
                    description: "Delete a new favorite by user id",
                    requestBody: {
                        description: "Delete a new favorite by user id",
                        content: {
                            "application/json": {
                                schema: {
                                    "$ref": "#/components/schemas/favoriteDelete"
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
                                        "$ref": "#/components/schemas/favoriteDelete"
                                    }
                                },
                            }
                        },
                        400: {
                            description: "Invalid request payload"
                        }
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
                user: {
                    type: "object",
                    properties: {
                        nombre: {
                            type: "string",
                            example: "string"
                        },
                        correo: {
                            type: "string",
                            example: "string"
                        },
                        clave: {
                            type: "string",
                            example: "string"
                        },
                        celular: {
                            type: "string",
                            example: "string"
                        }
                    },
                },
                userLogin: {
                    type: "object",
                    properties: {
                        correo: {
                            type: "string",
                            example: "string"
                        },
                        clave: {
                            type: "string",
                            example: "string"
                        }
                    },
                },
                token: {
                    type: "object",
                    properties: {
                        token: {
                            type: "string",
                            example: "string"
                        }
                    },
                },
                favoritesByUser: {
                    type: "object",
                    properties: {
                        productIds: {
                            productIds: {
                                type: "object",
                                example: [
                                    {
                                        "productId": "prod123",
                                        "descripcion": "Nueva descripción del producto nueva :v"
                                    }
                                ]
                            },
                        }
                    }
                },
                favorite: {
                    type: "object",
                    properties: {
                        userId: {
                            type: "string",
                            example: "user123"
                        },
                        product: {
                            type: "object",
                            example: {
                                productId: "prod123",
                                descripcion: "Producto favorito"
                            }
                        }
                    },
                },
                favoriteUpdate: {
                    type: "object",
                    properties: {
                        userId: {
                            type: "string",
                            example: "user123"
                        },
                        productId: {
                            type: "string",
                            example: "prod123"
                        },
                        newDescripcion: {
                            type: "string",
                            example: "Nueva descripcion"
                        }
                    },
                },
                favoriteDelete: {
                    type: "object",
                    properties: {
                        userId: {
                            type: "string",
                            example: "user123"
                        },
                        productId: {
                            type: "string",
                            example: "prod123"
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
