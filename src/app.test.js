const request = require('supertest');
const axios = require('axios');

const apiUrl = 'http://127.0.0.1:59128'; // URL de Minikube

jest.mock('axios'); // Mock de axios para simular las respuestas externas

// Esperar a que el servicio esté disponible
beforeAll(async () => {
    let isServiceUp = false;
    while (!isServiceUp) {
        try {
            const res = await axios.get(`${apiUrl}/obtenerFavoritos/user123`);
            isServiceUp = true; // El servicio está funcionando
        } catch (error) {
            console.log('Esperando a que el servicio esté disponible...');
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Esperar 2 segundos
        }
    }
});

test('should return favorites data', async () => {
    const mockData = {
        productIds: [
            {
                productId: 'prod123',
                descripcion: 'Nueva descripcion',
            },
        ],
    };

    axios.get.mockResolvedValue({data: mockData});

    // Realiza la solicitud a la API de Minikube
    const response = await request(apiUrl).get('/obtenerFavoritos/user123');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
});

test('should update favorites data', async () => {
    // Mock de la respuesta de axios para el endpoint de actualización
    axios.patch.mockResolvedValue({ data: "" });

    // Datos que se enviarán en el cuerpo de la solicitud PATCH
    const requestData = {
        userId: "user123",
        productId: "prod123",
        newDescripcion: "Nueva descripcion test"
    };

    // Realiza la solicitud PATCH a la API de Minikube
    const response = await request(apiUrl)
        .patch('/actualizarFavorito')
        .send(requestData);

    // Verificamos que el código de estado de la respuesta sea 200
    expect(response.status).toBe(200);

    // Verificamos que la respuesta sea vacía como se espera
    expect(response.body).toBe("");
});

test('should identify user and return token', async () => {
    // Mock de la respuesta de axios para la solicitud POST
    const mockResponse = {
        data: {
            token: "some-dynamic-token-value" // Esto puede ser cualquier valor dinámico
        }
    };

    // Mock de axios.post
    axios.post.mockResolvedValue(mockResponse);

    // Datos que se enviarán en el cuerpo de la solicitud POST
    const requestData = {
        usuario: "anderson1@hotmail.com",
        clave: "anderson123"
    };

    // Realiza la solicitud POST a la API de Minikube
    const response = await request(apiUrl)
        .post('/identificarUsuario')
        .send(requestData);

    // Verificamos que el código de estado de la respuesta sea 200
    expect(response.status).toBe(200);

    // Verificamos que la respuesta contenga una propiedad 'token' con un valor de tipo string
    expect(response.body).toHaveProperty('token');
    expect(typeof response.body.token).toBe('string');
});

test('should return token expired error', async () => {
    const mockErrorResponse = {
        data: {
            message: "token-expirado",
            status: "error"
        }
    };

    axios.post.mockResolvedValue(mockErrorResponse);

    const requestData = {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub21icmUiOiJBbmRlcnNvbiBKb2hhbiBBbGJhbiBBbmd1bG8iLCJpZCI6IjY3NWExOWYwOTY3NWQyZmNlNTZjMTJjMyIsImlkX3JvbCI6IjY3NThkODJmOTY3NWQyNTA2YzZjMTJiYiIsImV4cCI6MTczMzk2MTczNX0.sLTBoVqrMfY72IW15ynJjbJp9mqLN_G9r9G2aeBuaLI"
    };

    // Realiza la solicitud POST a la API de Minikube
    const response = await request(apiUrl)
        .post('/validarToken')
        .send(requestData);

    // Verificamos que el código de estado de la respuesta sea 200
    expect(response.status).toBe(500);

    // Verificamos que el cuerpo de la respuesta contenga el mensaje de error de token expirado
    expect(response.body).toHaveProperty('error', 'Error connecting to the token microservice');
    expect(response.body.details).toHaveProperty('message', 'token-expirado');
    expect(response.body.details).toHaveProperty('status', 'error');
});

test('should return valid token response', async () => {
    const mockValidResponse = {
        data: {
            exp: 1734110722,
            id: "675a19f09675d2fce56c12c3",
            id_rol: "6758d82f9675d2506c6c12bb",
            nombre: "Anderson Johan Alban Angulo"
        },
        message: "token-valido",
        status: "succes"
    };

    axios.post.mockResolvedValue(mockValidResponse);

    const requestData = {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub21icmUiOiJBbmRlcnNvbiBKb2hhbiBBbGJhbiBBbmd1bG8iLCJpZCI6IjY3NWExOWYwOTY3NWQyZmNlNTZjMTJjMyIsImlkX3JvbCI6IjY3NThkODJmOTY3NWQyNTA2YzZjMTJiYiIsImV4cCI6MTczNDExMDcyMn0.RWgD_izKp6Uux37oRLvYX5h8TYpVzYxIyf55gckSiOk"
    };

    // Realiza la solicitud POST a la API de Minikube
    const response = await request(apiUrl)
        .post('/validarToken')
        .send(requestData);

    // Verificamos que el código de estado de la respuesta sea 200
    expect(response.status).toBe(200);

    // Verificamos que la respuesta contenga los datos del usuario
    expect(response.body).toHaveProperty('message', 'token-valido');
    expect(response.body).toHaveProperty('status', 'succes');
    expect(response.body.data).toHaveProperty('id', '675a19f09675d2fce56c12c3');
    expect(response.body.data).toHaveProperty('nombre', 'Anderson Johan Alban Angulo');
});