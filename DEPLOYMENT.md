# Guía de Deployment - Tech Distributor

## Desplegar en Vercel

Vercel es la forma más fácil de desplegar aplicaciones Vue con Vite.

### Pasos para Desplegar:

#### 1. **Preparar el proyecto**
```bash
# Instalar dependencias
npm install

# Ejecutar tests
npm run test

# Construir para producción
npm run build
```

#### 2. **Crear cuenta en Vercel**
- Ve a [vercel.com](https://vercel.com)
- Regístrate con tu cuenta de GitHub
- Autoriza Vercel para acceder a tus repositorios

#### 3. **Conectar tu repositorio**
- En Vercel, haz clic en "New Project"
- Selecciona tu repositorio de GitHub
- Vercel detectará automáticamente que es un proyecto Vite/Vue

#### 4. **Configurar variables de entorno**
En tu proyecto, crea un archivo `.env.production`:
```
VITE_GOOGLE_SHEETS_API_KEY=tu_api_key_aqui
VITE_GOOGLE_SHEETS_ID=tu_sheet_id_aqui
```

En Vercel Dashboard:
- Ve a Settings → Environment Variables
- Agrega las mismas variables:
  - `VITE_GOOGLE_SHEETS_API_KEY`
  - `VITE_GOOGLE_SHEETS_ID`

#### 5. **Deploy automático**
- Cada vez que hagas push a la rama principal (main), Vercel desplegará automáticamente
- Puedes ver el estado del deployment en el dashboard de Vercel

### URLs de tu aplicación:
- **Production**: `https://tu-proyecto.vercel.app`
- **Preview**: Se crea automáticamente para cada pull request

---

## Desplegar en Netlify

### Pasos para Desplegar:

#### 1. **Crear cuenta en Netlify**
- Ve a [netlify.com](https://netlify.com)
- Regístrate con GitHub

#### 2. **Conectar tu repositorio**
- En Netlify, haz clic en "New site from Git"
- Selecciona tu repositorio

#### 3. **Configurar build**
Netlify detectará automáticamente:
- **Build command**: `npm run build`
- **Publish directory**: `dist`

#### 4. **Agregar variables de entorno**
- Ve a Site settings → Build & deploy → Environment
- Agrega:
  ```
  VITE_GOOGLE_SHEETS_API_KEY=tu_api_key
  VITE_GOOGLE_SHEETS_ID=tu_sheet_id
  ```

#### 5. **Deploy**
- Haz clic en "Deploy site"
- Se te asignará una URL automática

---

## Desplegar en tu propio servidor

### Con Node.js:

#### 1. **Construir la aplicación**
```bash
npm run build
```

#### 2. **Instalar servidor web**
```bash
npm install -g http-server
```

#### 3. **Ejecutar servidor**
```bash
http-server dist -p 3000
```

### Con Nginx:

#### 1. **Construir**
```bash
npm run build
```

#### 2. **Configurar Nginx**
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    root /var/www/tech-distributor/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### 3. **Reiniciar Nginx**
```bash
sudo systemctl restart nginx
```

---

## Checklist de Deploy

- [ ] Todas las pruebas pasan (`npm run test`)
- [ ] Build se completa sin errores (`npm run build`)
- [ ] Variables de entorno configuradas
- [ ] Google Sheets API habilitada
- [ ] API Key y Sheet ID válidos
- [ ] Base de datos/Storage configurado (si aplica)
- [ ] URL de producción configurada en googleSheetsAPI.js
- [ ] CORS configurado correctamente
- [ ] SSL/HTTPS habilitado
- [ ] Backup de datos realizado

---

## Troubleshooting de Deploy

### Error: "Cannot find module"
```bash
npm install
npm run build
```

### Error: "VITE_GOOGLE_SHEETS_API_KEY is not defined"
- Verifica que las variables de entorno estén configuradas correctamente
- Comprueba que usan el prefijo `VITE_` para ser expuestas al cliente

### Error: "403 Forbidden from Google Sheets API"
- Verifica que la API Key es válida
- Comprueba que Google Sheets API está habilitada en Google Cloud Console
- Verifica que el Sheet ID es correcto
- Comprueba los permisos de CORS

### Aplicación en blanco en producción
- Abre DevTools (F12)
- Revisa la consola para errores
- Verifica que `dist/index.html` existe
- Comprueba que las rutas están correctamente configuradas

---

## Performance Optimization

### Mejorar velocidad de carga:

```bash
# Analizar el build
npm run build -- --analyze
```

### Cachear assets:
- Vercel/Netlify cachean automáticamente archivos con hash
- Los archivos `*.js` y `*.css` se cachean indefinidamente

### Lazy loading de rutas:
Ya está implementado en `src/main.js`

### Compresión:
- Vercel/Netlify comprimen automáticamente con gzip/brotli

---

## Monitoreo

### Google Analytics (Opcional)
Agrega a `src/main.js`:
```javascript
import { useGoogleAnalytics } from 'vue-google-analytics'

const app = createApp(App)
app.use(useGoogleAnalytics, {
  appName: 'Tech Distributor',
  appVersion: '1.0',
  trackingId: 'GA_MEASUREMENT_ID'
})
```

### Error Tracking (Opcional)
Considera agregar Sentry:
```bash
npm install @sentry/vue @sentry/tracing
```

---

## Backup y Recuperación

### Backup de datos de Google Sheets:
```bash
# Usar Google Takeout para exportar datos
# Ve a https://takeout.google.com
```

### Backup de código:
```bash
# Git automáticamente mantiene el historio
git push origin main
```

---

¡Tu aplicación está lista para el mundo! 🚀
