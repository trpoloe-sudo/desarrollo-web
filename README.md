# Tech Distributor - Ecommerce Avanzado 🖥️

Una plataforma completa de ecommerce para la distribución de computadoras y partes, construida con **Vue 3 + Vite + Pinia**.

## ✨ Características Principales

### 🛒 Ecommerce
- ✅ Catálogo de productos desde Google Sheets
- ✅ Búsqueda y filtrado avanzado
- ✅ Carrito persistente con localStorage
- ✅ Sistema de favoritos/Wishlist
- ✅ Control de stock en tiempo real

### 👤 Autenticación
- ✅ Login y registro de usuarios
- ✅ Sesiones persistentes
- ✅ Tokens JWT simulados
- ✅ Protección de rutas privadas

### 💳 Pagos
- ✅ Pasarela de pago multi-método:
  - Tarjeta de crédito
  - PayPal
  - Transferencia bancaria
- ✅ Procesamiento simulado de pagos
- ✅ Confirmación de orden con detalles

### 📊 Dashboard de Usuario
- ✅ Historial de compras
- ✅ Detalles de órdenes
- ✅ Estadísticas personales
- ✅ Información de cuenta

### ⚙️ Administración
- ✅ CRUD de productos
- ✅ Gestión de órdenes
- ✅ Control de usuarios
- ✅ Panel completo para admins

### 🎨 UI/UX
- ✅ Diseño responsivo y moderno
- ✅ Animaciones suaves (fadeIn, slideIn, heartBeat)
- ✅ Interfaz intuitiva y accesible
- ✅ Temas con gradientes

### 🧪 Testing
- ✅ Tests unitarios con Vitest
- ✅ Cobertura de stores principales
- ✅ Suite completa de pruebas

### 📦 Optimizaciones
- ✅ Lazy loading de rutas
- ✅ Caching automático
- ✅ Build optimizado
- ✅ Alias de imports limpio (@/)

## 🚀 Inicio Rápido

### Requisitos
- Node.js v14 o superior
- npm o yarn
- Cuenta de Google (para Google Sheets API)

### Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/tu-usuario/tech-distributor.git
cd tech-distributor

# 2. Instalar dependencias
npm install

# 3. Configurar Google Sheets API
```

### Configuración de Google Sheets

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto
3. Habilita Google Sheets API
4. Crea una clave de API (API Key)
5. Copia tu SHEET_ID y API_KEY

### Configurar Credenciales

```bash
# Copiar archivo de ejemplo
cp .env.example .env.local
```

Edita `.env.local`:
```
VITE_GOOGLE_SHEETS_API_KEY=tu_api_key_aqui
VITE_GOOGLE_SHEETS_ID=tu_sheet_id_aqui
```

### Estructura de Google Sheets

**Hoja "Productos":**
```
Categoría | Nombre | Descripción | Precio | Stock | Imagen URL | Especificaciones
```

Ejemplo:
```
Procesadores | Intel Core i7 | Procesador de alto rendimiento | 450 | 15 | https://... | 13ª gen, 16 núcleos
```

### Ejecutar Proyecto

```bash
# Desarrollo
npm run dev

# Construcción para producción
npm run build

# Preview de build
npm run preview

# Tests
npm run test
npm run test:ui

# Lint
npm run lint
```

## 📱 Páginas Disponibles

| Página | Ruta | Descripción |
|--------|------|-------------|
| Inicio | `/` | Bienvenida y características |
| Productos | `/products` | Catálogo completo con búsqueda |
| Carrito | `/cart` | Gestión del carrito |
| Checkout | `/checkout` | Procesamiento de pago |
| Autenticación | `/auth` | Login y registro |
| Dashboard | `/dashboard` | Historial de compras |
| Administración | `/admin` | Panel de control |

## 🏗️ Estructura del Proyecto

```
src/
├── components/        # Componentes reutilizables
├── pages/            # Vistas principales
├── stores/           # Estado global (Pinia)
├── services/         # Servicios API
├── styles/           # Estilos globales
├── main.js           # Punto de entrada
└── App.vue           # Componente raíz
```

## 🔐 Sistema de Autenticación

### Login/Registro
- Email y contraseña
- Validación de campos
- Mensajes de error claros
- Redirección automática

### Sesión
- Token persistente en localStorage
- Restauración automática al recargar
- Cierre de sesión limpio

## 💰 Carrito y Pagos

### Carrito
- Agregar/remover productos
- Aumentar/disminuir cantidad
- Cálculo automático de totales
- Persistencia en localStorage

### Checkout
- Múltiples métodos de pago
- Validación de datos
- Simulación de procesamiento
- Confirmación de orden

## ❤️ Sistema de Favoritos

- Marcar/desmarcar productos
- Contador en navbar
- Animación heartBeat
- Persistencia en localStorage

## 👨‍💼 Panel Administrativo

### Gestión de Productos
- Crear nuevo producto
- Editar información
- Eliminar del catálogo
- Vista de lista actual

### Gestión de Órdenes
- Ver todas las órdenes
- Cambiar estado
- Detalles de pago
- Información del cliente

### Gestión de Usuarios
- Lista de registrados
- Total gastado
- Número de órdenes
- Detalles del usuario

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm run test

# Con interfaz visual
npm run test:ui

# Tests incluyen:
# - cartStore (7 tests)
# - userStore (7 tests)
# - favoritesStore (6 tests)
```

## 📈 Estadísticas de Código

- **Componentes Vue**: 10+
- **Stores Pinia**: 3
- **Páginas**: 7
- **Tests unitarios**: 20+
- **Líneas de código**: 3000+

## 🚢 Deploy

Sigue la guía completa en [DEPLOYMENT.md](DEPLOYMENT.md)

### Opciones:
- **Vercel** (Recomendado) - Deploy automático
- **Netlify** - CI/CD integrado
- **Servidor propio** - Node.js + Nginx

## 📚 Documentación

- [ACTUALIZACION_COMPLETA.md](ACTUALIZACION_COMPLETA.md) - Detalle de todas las features
- [DEPLOYMENT.md](DEPLOYMENT.md) - Guía de deploy
- [PERSONALIZACION.md](PERSONALIZACION.md) - Cómo personalizar
- [USO.md](USO.md) - Instrucciones de uso
- [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md) - Setup de Google Sheets

## 🔄 Flujo de Usuario

```
Inicio
  ↓
Explorar productos
  ↓
Agregar a carrito / Favoritos
  ↓
Ver carrito
  ↓
Iniciar sesión (si no está logueado)
  ↓
Checkout
  ↓
Seleccionar método de pago
  ↓
Confirmar compra
  ↓
Dashboard (Historial)
```

## 🛠️ Stack Tecnológico

### Frontend
- **Vue 3** - Framework progresivo
- **Vite** - Build tool rápido
- **Pinia** - State management
- **Vue Router** - Enrutamiento

### Testing
- **Vitest** - Framework de tests
- **Happy-dom** - Entorno de pruebas

### Integración
- **Google Sheets API** - Base de datos
- **Stripe** (Opcional) - Pagos

### Herramientas
- **npm** - Package manager
- **Git** - Control de versiones
- **ESLint** - Code quality

## 📝 Variables de Entorno

```env
VITE_GOOGLE_SHEETS_API_KEY=tu_api_key
VITE_GOOGLE_SHEETS_ID=tu_sheet_id
VITE_STRIPE_PUBLIC_KEY=tu_stripe_key (opcional)
VITE_APP_NAME=Tech Distributor
VITE_APP_URL=http://localhost:5173
```

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add: Amazing feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## 👥 Autores

- Desarrollador Principal: Tu Nombre
- Fecha: Enero 2026

## 🙏 Agradecimientos

- Vue.js Team
- Vite
- Pinia
- Google Sheets API

## 📞 Soporte

Para reportar bugs o sugerir features, abre un issue en GitHub.

---

**¡Gracias por usar Tech Distributor!** 🎉

Made with ❤️ using Vue 3


## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## Build para Producción

```bash
npm run build
```

Para previsualizar el build:
```bash
npm run preview
```

## Estructura del Proyecto

```
src/
├── components/
│   ├── Header.vue         # Encabezado con título
│   ├── NavBar.vue         # Barra de navegación
│   ├── Footer.vue         # Pie de página
│   └── ProductCard.vue    # Tarjeta de producto
├── pages/
│   ├── Home.vue           # Página de inicio
│   ├── Products.vue       # Listado de productos
│   └── Cart.vue           # Carrito de compras
├── services/
│   └── googleSheetsAPI.js # Integración con Google Sheets
├── stores/
│   └── cart.js            # Estado global del carrito
├── App.vue                # Componente raíz
└── main.js                # Punto de entrada
```

## Funcionalidades

### Página de Inicio
- Banner de bienvenida
- Características principales
- Categorías de productos
- Call-to-action

### Página de Productos
- Listado de todos los productos
- Búsqueda por nombre
- Filtro por categoría
- Información del stock
- Botón para añadir al carrito

### Carrito de Compras
- Visualización de items añadidos
- Control de cantidad
- Cálculo automático de totales
- Cálculo de IVA
- Opción para vaciar carrito
- Botón para continuar comprando

## Personalización

### Colores
Los colores principales se encuentran en los archivos `.vue` usando:
- Primario: `#667eea`
- Secundario: `#764ba2`
- Texto: `#2c3e50`
- Fondos: `#f5f5f5`

Para cambiar los colores, reemplaza estos valores en los estilos.

### Información de Contacto
Edita los datos en `src/components/Footer.vue`

## Notas Importantes

- Los datos de ejemplo se cargan automáticamente si no está configurada la API de Google Sheets
- La API Key de Google debe tener acceso a Google Sheets API
- Asegúrate que tu Google Sheet sea público o comparte con la API

## Próximas Mejoras

- [ ] Integración con pasarela de pago
- [ ] Sistema de usuarios y autenticación
- [ ] Historial de pedidos
- [ ] Notificaciones por email
- [ ] Búsqueda avanzada
- [ ] Comparador de productos
- [ ] Reseñas y valoraciones

## Licencia

MIT

## Soporte

Para soporte o reportar bugs, contacta a: contacto@techdistributor.com
#   d e s a r r o l l o - w e b  
 