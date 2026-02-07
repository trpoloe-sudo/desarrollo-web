# Configuración de Google Sign-In

Este documento explica cómo configurar la autenticación con Google en tu aplicación.

## 🔐 Pasos para Configurar Google OAuth 2.0

### 1. Crear un Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Haz clic en el selector de proyectos en la parte superior
3. Haz clic en "Nuevo Proyecto"
4. Dale un nombre (ej: "ZTAR Tech")
5. Haz clic en "Crear"

### 2. Habilitar la API de Google Sign-In

1. En la consola, ve a "API y servicios" → "Biblioteca"
2. Busca "Google+ API" o "Identity and Access Management"
3. Haz clic en "Habilitar"

### 3. Crear Credenciales OAuth 2.0

1. Ve a "API y servicios" → "Credenciales"
2. Haz clic en "Crear credenciales" → "ID de OAuth"
3. Selecciona "Aplicación web"
4. Dale un nombre (ej: "ZTAR Tech Frontend")

### 4. Configurar Orígenes Autorizados

En la pantalla de crear credenciales OAuth:

**Orígenes autorizados de JavaScript:**
```
http://localhost:5173
http://localhost:3000
https://tu-dominio.com
```

**URI de redirección autorizados:**
```
http://localhost:5173/auth/callback
http://localhost:3000/auth/callback
https://tu-dominio.com/auth/callback
```

5. Haz clic en "Crear"
6. Se abrirá una ventana con tu Client ID y Client Secret
7. Copia el **Client ID**

### 5. Configurar las Variables de Entorno

1. Copia el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

2. Abre `.env` y reemplaza:
   ```
   VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
   ```
   
   Con tu Client ID obtenido en el paso anterior:
   ```
   VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
   ```

### 6. Reiniciar la Aplicación

```bash
npm run dev
```

## 🎯 Cómo Funciona en la Aplicación

### En el Componente Auth.vue

El botón "Continuar con Google" carga la librería de Google Sign-In y permite a los usuarios:

1. Iniciar sesión con su cuenta de Google
2. Se obtiene automáticamente su email, nombre y foto de perfil
3. Se crea una sesión en la aplicación

### En el Store (user.js)

La función `loginWithGoogle()` maneja:
- Validación de datos
- Creación del usuario
- Generación de token
- Almacenamiento en localStorage

## 📝 Ejemplo de Respuesta de Google

Cuando el usuario se autentica, Google devuelve:

```javascript
{
  credential: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImEyYzQ5ZTdjYzI0MjVlMDcxMjcwMzA4Y2JkODllZDcyYTQwZWJhMjEiLCJ0eXAiOiJKV1QifQ...",
  select_by: "user"
}
```

El componente decodifica este JWT para obtener:

```javascript
{
  email: "usuario@gmail.com",
  name: "Nombre del Usuario",
  picture: "https://lh3.googleusercontent.com/...",
  email_verified: true,
  ...
}
```

## 🚀 Implementación en Producción

Para producción, reemplaza el backend simulado con uno real:

1. Crea un endpoint en tu backend que valide el token de Google
2. Modifica `Auth.vue` para enviar el token a tu backend
3. El backend debe:
   - Verificar el JWT con Google
   - Crear/actualizar el usuario en tu base de datos
   - Retornar tu propio token de sesión

Ejemplo (Node.js/Express):

```javascript
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential } = req.body;
    
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    
    // Crear/actualizar usuario en DB
    const user = await User.findOrCreate({
      email: payload.email,
      name: payload.name,
      picture: payload.picture
    });
    
    // Generar tu propio token
    const token = generateToken(user);
    
    res.json({ token, user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});
```

## 🔒 Seguridad

### Considera:
- ✅ Siempre valida tokens en el servidor
- ✅ Usa HTTPS en producción
- ✅ No expongas el Client Secret en el frontend
- ✅ Implementa rate limiting en tu backend
- ✅ Valida y sanitiza todos los datos de usuario

## 📚 Referencias

- [Documentación oficial de Google Sign-In](https://developers.google.com/identity/sign-in/web/sign-in)
- [Google Identity Services API](https://developers.google.com/identity/gsi/web)
- [OAuth 2.0](https://oauth.net/2/)

## ❓ Problemas Comunes

### Error: "CORS policy"
- Asegúrate de haber configurado correctamente los orígenes autorizados en Google Cloud Console

### El botón de Google no aparece
- Verifica que `VITE_GOOGLE_CLIENT_ID` está configurado en `.env`
- Abre la consola del navegador para ver si hay errores

### "Invalid audience"
- Verifica que el Client ID en `.env` coincide con el de Google Cloud Console

