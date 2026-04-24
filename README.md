# Ztar Tech Web

Sitio y panel operativo para Ztar Tech construido con `Vue 3 + Vite + Pinia` en el frontend y `Express` en el backend.

## Qué incluye

- Catálogo público con búsqueda, filtros y detalle de producto.
- Carrito persistente y flujo de pedido coordinado.
- Autenticación por email y Google Sign-In.
- Panel admin para catálogo, pedidos, usuarios y consultas de contacto.
- SEO base más meta dinámico por ruta y por producto.
- Persistencia principal en SQLite con migración automática desde los JSON existentes.

## Estructura

```text
src/
  components/   UI reutilizable
  pages/        vistas principales
  services/     API client, SEO y tracking
  stores/       estado global con Pinia
  utils/        helpers compartidos
server/
  routes/       endpoints Express
  services/     integraciones backend
  storage/      persistencia con SQLite
  data/         datos locales del proyecto
scripts/
  dev-all.mjs
  stop-all.mjs
  generate-sitemap.mjs
  lint.mjs
```

## Variables de entorno

Copia `.env.example` a `.env` y completa solo lo que realmente uses.

Variables principales:

- `GOOGLE_CLIENT_ID`
- `VITE_GOOGLE_CLIENT_ID`
- `GOOGLE_ALLOWED_CLIENT_IDS`
- `GOOGLE_SHEETS_ID`
- `GOOGLE_SHEETS_API_KEY`
- `VITE_API_URL`
- `VITE_SITE_URL`
- `VITE_ROUTER_MODE`
- `VITE_HUBSPOT_PORTAL_ID`
- `VITE_GOOGLE_ADS_SEND_TO`
- `VITE_GA_MEASUREMENT_ID`
- `VITE_FACEBOOK_PIXEL_ID`
- `VITE_TIKTOK_PIXEL_ID`
- `ALERT_APP_NAME`
- `ALERT_WEBHOOK_URL`
- `ORDER_ALERT_WEBHOOK_URL`
- `LEAD_ALERT_WEBHOOK_URL`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_TO_EMAIL`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_ALERT_TO`

## Comandos

```bash
npm install
npm run dev
npm run server:dev
npm run dev:all
npm test -- --run
npm run lint
npm run build
```

## Routing

- Usa `VITE_ROUTER_MODE=hash` cuando el hosting no permite `rewrite` ni `.htaccess`, por ejemplo en Webcindario.
- Usa `VITE_ROUTER_MODE=history` solo en servidores que puedan redirigir cualquier ruta del frontend a `index.html`.

## Flujo operativo actual

- El formulario de contacto registra consultas reales en `server/data/app.sqlite`.
- El checkout no cobra en línea: envía pedidos con estados operativos (`pending`, `payment_review`, `paid`, `completed`, `cancelled`).
- El panel admin permite revisar pedidos, usuarios, catálogo y contactos.
- Si configuras Resend, WhatsApp Cloud API o webhooks, el backend dispara alertas automáticas para nuevos leads, nuevos pedidos y cambios de estado.

## Calidad y mantenimiento

- `npm test -- --run` valida stores, router y servicios principales.
- `npm run lint` ejecuta una verificación de mantenimiento del repositorio:
  detecta secretos hardcodeados, placeholders sin reemplazar y archivos con bytes nulos.
- `npm run build` regenera `public/sitemap.xml` y `public/robots.txt` antes del build.

## Persistencia

- El backend usa `server/data/app.sqlite` como base principal.
- Si encuentra `auth.json`, `catalog.json` o `leads.json` y la base está vacía, migra esos datos automáticamente al arrancar.
- En Render sigue siendo recomendable montar un disco persistente para no perder datos entre reinicios.
