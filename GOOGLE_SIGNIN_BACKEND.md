# 🚀 Integración Backend con Google Sign-In

Esta guía muestra cómo integrar Google Sign-In con tu propio servidor backend para máxima seguridad.

## 📋 Tabla de Contenidos
1. [Node.js/Express](#nodejs--express)
2. [Python/Flask](#python--flask)
3. [PHP](#php)
4. [Modificaciones en Frontend](#modificaciones-en-frontend)

---

## Node.js / Express

### Instalación de dependencias:

```bash
npm install express google-auth-library axios cors dotenv
```

### Código del servidor:

```javascript
// server.js
const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const cors = require('cors');
require('dotenv').config();

const app = express();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(cors({
  origin: ['http://localhost:5173', 'https://tudominio.com'],
  credentials: true
}));
app.use(express.json());

// Endpoint para autenticación con Google
app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: 'Token requerido' });
    }

    // Verificar el token con Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const userId = payload['sub'];
    const email = payload['email'];
    const name = payload['name'];
    const picture = payload['picture'];

    // TODO: Guardar/actualizar usuario en tu base de datos
    const user = await findOrCreateUser({
      googleId: userId,
      email,
      name,
      picture
    });

    // Generar tu propio JWT
    const token = generateJWT(user);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture
      }
    });

  } catch (error) {
    console.error('Error verificando token:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
});

// Endpoint para login tradicional
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar credenciales contra DB
    const user = await validateUserCredentials(email, password);

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = generateJWT(user);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Funciones auxiliares
function generateJWT(user) {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

async function findOrCreateUser(googleData) {
  // Implementar con tu DB (MongoDB, PostgreSQL, etc.)
  // Pseudocódigo:
  // 1. Buscar usuario por email
  // 2. Si existe, actualizar
  // 3. Si no existe, crear
  return {
    id: 'user-id',
    email: googleData.email,
    name: googleData.name,
    picture: googleData.picture,
    googleId: googleData.googleId
  };
}

async function validateUserCredentials(email, password) {
  // Implementar validación contra DB
  // 1. Buscar usuario por email
  // 2. Comparar password (bcrypt)
  // 3. Retornar usuario si es válido
  return null;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
```

### Variables de entorno (.env):

```env
GOOGLE_CLIENT_ID=tu_client_id_aqui
JWT_SECRET=tu_secret_muy_seguro_aqui
DATABASE_URL=mongodb://localhost/ztartech
PORT=3000
```

---

## Python / Flask

### Instalación:

```bash
pip install flask google-auth-oauthlib google-auth flask-cors python-dotenv pyjwt
```

### Código del servidor:

```python
# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from google.auth.transport import requests
from google.oauth2 import id_token
import jwt
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173', 'https://tudominio.com'])

GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
JWT_SECRET = os.getenv('JWT_SECRET')

@app.route('/api/auth/google', methods=['POST'])
def google_auth():
    try:
        data = request.get_json()
        credential = data.get('credential')

        if not credential:
            return jsonify({'error': 'Token requerido'}), 400

        # Verificar token con Google
        try:
            idinfo = id_token.verify_oauth2_token(
                credential,
                requests.Request(),
                GOOGLE_CLIENT_ID
            )
            
            # Token es válido
            user_id = idinfo['sub']
            email = idinfo['email']
            name = idinfo['name']
            picture = idinfo.get('picture')

            # Guardar/actualizar usuario
            user = find_or_create_user({
                'google_id': user_id,
                'email': email,
                'name': name,
                'picture': picture
            })

            # Generar JWT
            token = generate_jwt(user)

            return jsonify({
                'success': True,
                'token': token,
                'user': {
                    'id': user['id'],
                    'email': user['email'],
                    'name': user['name'],
                    'picture': user['picture']
                }
            }), 200

        except ValueError:
            return jsonify({'error': 'Token inválido'}), 401

    except Exception as e:
        print(f'Error: {str(e)}')
        return jsonify({'error': 'Error interno del servidor'}), 500


@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # Validar credenciales
        user = validate_user_credentials(email, password)

        if not user:
            return jsonify({'error': 'Credenciales inválidas'}), 401

        token = generate_jwt(user)

        return jsonify({
            'success': True,
            'token': token,
            'user': {
                'id': user['id'],
                'email': user['email'],
                'name': user['name']
            }
        }), 200

    except Exception as e:
        print(f'Error: {str(e)}')
        return jsonify({'error': 'Error interno del servidor'}), 500


def generate_jwt(user):
    """Generar JWT firmado"""
    payload = {
        'id': user['id'],
        'email': user['email']
    }
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')


def find_or_create_user(google_data):
    """Buscar o crear usuario en BD"""
    # Implementar con tu ORM (SQLAlchemy, etc.)
    return {
        'id': 'user-id',
        'email': google_data['email'],
        'name': google_data['name'],
        'picture': google_data.get('picture'),
        'google_id': google_data['google_id']
    }


def validate_user_credentials(email, password):
    """Validar email y contraseña"""
    # Implementar búsqueda en BD + validación de bcrypt
    return None


if __name__ == '__main__':
    app.run(debug=True, port=3000)
```

### Variables (.env):

```env
GOOGLE_CLIENT_ID=tu_client_id_aqui
JWT_SECRET=tu_secret_muy_seguro_aqui
DATABASE_URL=postgresql://user:password@localhost/ztartech
FLASK_ENV=development
```

---

## PHP

### Instalación (Composer):

```bash
composer require google/auth firebase/php-jwt
```

### Código del servidor:

```php
<?php
// api/auth/google.php

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';

use Google\Auth\OAuthToken;
use Firebase\JWT\JWT;

$client = new Google_Client([
    'client_id' => $_ENV['GOOGLE_CLIENT_ID']
]);

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $credential = $data['credential'] ?? null;

    if (!$credential) {
        http_response_code(400);
        echo json_encode(['error' => 'Token requerido']);
        exit;
    }

    // Verificar token con Google
    $payload = $client->verifyIdToken($credential);

    if (!$payload) {
        http_response_code(401);
        echo json_encode(['error' => 'Token inválido']);
        exit;
    }

    $userId = $payload['sub'];
    $email = $payload['email'];
    $name = $payload['name'];
    $picture = $payload['picture'] ?? null;

    // Guardar/actualizar usuario
    $user = findOrCreateUser([
        'google_id' => $userId,
        'email' => $email,
        'name' => $name,
        'picture' => $picture
    ]);

    // Generar JWT
    $token = generateJWT($user);

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'name' => $user['name'],
            'picture' => $user['picture']
        ]
    ]);

} catch (Exception $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}

function generateJWT($user) {
    $payload = [
        'id' => $user['id'],
        'email' => $user['email'],
        'iat' => time(),
        'exp' => time() + (7 * 24 * 60 * 60) // 7 días
    ];
    
    return JWT::encode($payload, $_ENV['JWT_SECRET'], 'HS256');
}

function findOrCreateUser($googleData) {
    // Implementar con tu BD (PDO, Laravel, etc.)
    return [
        'id' => 'user-id',
        'email' => $googleData['email'],
        'name' => $googleData['name'],
        'picture' => $googleData['picture'],
        'google_id' => $googleData['google_id']
    ];
}
```

---

## Modificaciones en Frontend

Una vez tengas tu backend, actualiza `Auth.vue`:

```javascript
// En Auth.vue script setup

async function handleGoogleSignInSuccess(googleData) {
  try {
    isLoading.value = true
    error.value = ''

    // ENVIAR TOKEN A TU BACKEND
    const response = await fetch('http://localhost:3000/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        credential: googleData.credential // Token de Google
      })
    })

    if (!response.ok) {
      throw new Error('Error de autenticación')
    }

    const result = await response.json()

    // GUARDAR TU TOKEN EN VEZ DEL DE GOOGLE
    userStore.setToken(result.token)
    userStore.setUser(result.user)

    showNotification('✅ Sesión iniciada con Google', 'success')
    setTimeout(() => {
      router.push('/')
    }, 1000)

  } catch (err) {
    error.value = err.message || 'Error al iniciar sesión'
    console.error('Error:', err)
  } finally {
    isLoading.value = false
  }
}
```

Y actualiza `user.js`:

```javascript
function setToken(newToken) {
  token.value = newToken
  localStorage.setItem('authToken', newToken)
}

function setUser(userData) {
  user.value = userData
  localStorage.setItem('userData', JSON.stringify(userData))
}
```

---

## 🔒 Checklist de Seguridad

- [ ] Siempre valida JWTs en el servidor
- [ ] Usa HTTPS en producción
- [ ] No expongas secrets en el frontend
- [ ] Implementa rate limiting en auth endpoints
- [ ] Hash contraseñas con bcrypt
- [ ] Valida y sanitiza todos los inputs
- [ ] Implementa CORS correctamente
- [ ] Usa cookies HttpOnly para tokens (opcional)
- [ ] Implementa logout que invalide tokens
- [ ] Logs de intentos fallidos de autenticación

---

## 📚 Referencias

- [Node.js Google Auth Library](https://github.com/googleapis/google-auth-library-nodejs)
- [Python Google Auth](https://github.com/googleapis/google-auth-library-python)
- [PHP Google Auth](https://github.com/googleapis/google-auth-library-php)
- [JWT.io](https://jwt.io/)

---

**Actualizado:** 11 de Enero, 2025
