# 🔐 Google Sign-In - Configuración Rápida

## Lo que he implementado:

✅ **Botón "Continuar con Google"** en la página de login
✅ **Autenticación con Google OAuth 2.0**
✅ **Almacenamiento automático de datos del usuario**
✅ **Integración completa con el store de Pinia**

## Cómo configurarlo (5 minutos):

### 1️⃣ Obtener Google Client ID

1. Ve a: https://console.cloud.google.com/
2. Crea un nuevo proyecto o usa uno existente
3. Ve a "Credenciales" → "Crear credenciales" → "ID de OAuth"
4. Selecciona "Aplicación web"
5. En **Orígenes autorizados de JavaScript** agrega:
   - `http://localhost:5173` (desarrollo)
   - Tu dominio en producción (ej: `https://tudominio.com`)

6. Copia tu **Client ID** (algo como: `123456789-abcdefg.apps.googleusercontent.com`)

### 2️⃣ Configurar la aplicación

1. Crea un archivo `.env` en la raíz del proyecto (copiar de `.env.example`):

```bash
cp .env.example .env
```

2. Abre `.env` y agrega tu Client ID:

```
VITE_GOOGLE_CLIENT_ID=tu_client_id_aqui
```

3. Guarda el archivo

### 3️⃣ Reinicia la aplicación

```bash
npm run dev
```

## 🎯 Cómo funciona:

1. **Usuario hace clic en "Continuar con Google"**
2. **Se abre la ventana de autenticación de Google**
3. **Google devuelve datos del usuario** (email, nombre, foto)
4. **Se crea automáticamente la sesión en la app**
5. **Se guarda en localStorage para mantener la sesión**

## 📱 Datos capturados:

Cuando el usuario se autentica con Google, se guardan:

```javascript
{
  email: "usuario@gmail.com",
  name: "Nombre del Usuario",
  picture: "https://...", // URL de foto de perfil
  provider: "google",
  id: "..." // ID único generado
}
```

## 🚀 Próximos pasos (Opcional):

Para un backend real, puedes:

1. Crear un endpoint en tu servidor que valide el token de Google
2. Guardar el usuario en tu base de datos
3. Generar tu propio JWT

Ejemplo (Node.js):

```javascript
app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body;
  // Validar con Google
  // Crear usuario en DB
  // Retornar tu JWT
});
```

## ❓ Problemas comunes:

| Problema | Solución |
|----------|----------|
| "Botón no aparece" | Verifica que `VITE_GOOGLE_CLIENT_ID` está en `.env` |
| "CORS error" | Agrega tu dominio a orígenes autorizados en Google Cloud |
| "Invalid audience" | Verifica que el Client ID coincide con el de Google Cloud |

## 📚 Archivos relacionados:

- [Auth.vue](src/components/Auth.vue) - Componente de login
- [googleAuth.js](src/services/googleAuth.js) - Servicio de autenticación
- [user.js](src/stores/user.js) - Store con `loginWithGoogle()`
- [GOOGLE_SIGN_IN_SETUP.md](GOOGLE_SIGN_IN_SETUP.md) - Guía detallada

---

**¿Necesitas ayuda?** Lee [GOOGLE_SIGN_IN_SETUP.md](GOOGLE_SIGN_IN_SETUP.md) para la guía completa.
