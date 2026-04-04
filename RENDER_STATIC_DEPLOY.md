# Render Static Frontend + API

## Arquitectura

Este repo queda preparado para desplegarse con dos servicios en Render:

- `desarrollo-web-4ec5`: API Node/Express
- `desarrollo-web-4ec5-static`: frontend Vite como sitio estatico

El archivo [render.yaml](/d:/Desarrollo%20web/render.yaml) ya define ambos servicios.

## Motivo

- El frontend deja de depender del cold start del servicio Node.
- Los assets del cliente se sirven desde hosting estatico.
- La API queda separada para `/api/*`, login, catalogo y tareas.

## Limitacion importante de Render

Render no permite convertir un web service existente a `runtime: static` dentro del mismo servicio.

Por eso el blueprint mantiene `desarrollo-web-4ec5` como backend y crea un nuevo static site:

- Backend actual: `https://desarrollo-web-4ec5.onrender.com`
- Frontend nuevo: `https://desarrollo-web-4ec5-static.onrender.com`

Si luego quieres que el dominio principal apunte al frontend, mueve tu custom domain al static site despues de validar el flujo.

## Variables del frontend

```env
VITE_API_URL=https://desarrollo-web-4ec5.onrender.com/api
VITE_SITE_URL=https://desarrollo-web-4ec5-static.onrender.com
VITE_GOOGLE_CLIENT_ID=tu_google_client_id
```

## Variables del backend

```env
CLIENT_ORIGIN=https://desarrollo-web-4ec5-static.onrender.com
CORS_ORIGIN=https://desarrollo-web-4ec5-static.onrender.com
FRONTEND_ORIGIN=https://desarrollo-web-4ec5-static.onrender.com
ALLOWED_ORIGINS=https://desarrollo-web-4ec5-static.onrender.com
SESSION_COOKIE_SECURE=true
SESSION_COOKIE_SAME_SITE=lax
SESSION_TTL_HOURS=168
```

## Cookies y auth

Con dos subdominios `*.onrender.com`, `SESSION_COOKIE_SAME_SITE=lax` sigue funcionando porque ambas URLs son same-site.

Si en el futuro separas frontend y backend en dominios raiz distintos, usa:

```env
SESSION_COOKIE_SAME_SITE=none
SESSION_COOKIE_SECURE=true
```

## Orden recomendado de despliegue

1. Despliega el backend `desarrollo-web-4ec5`.
2. Verifica `https://desarrollo-web-4ec5.onrender.com/api/health`.
3. Despliega el static site `desarrollo-web-4ec5-static`.
4. Abre el frontend y valida catalogo, login y panel admin.
5. Si usas dominio propio, apunta el dominio publico al static site.

## Nota sobre SEO

El `index.html` ahora recibe la URL publica desde `VITE_SITE_URL` durante el build, asi que el frontend debe compilarse con la URL real del sitio estatico.
