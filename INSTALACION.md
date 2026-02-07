# Guía de Instalación y Configuración - Tech Distributor

## Paso 1: Instalar Node.js

1. **Descarga Node.js**:
   - Ve a https://nodejs.org/
   - Descarga la versión LTS (recomendada)
   - Ejecuta el instalador y sigue los pasos
   - Selecciona la opción para instalar npm automáticamente

2. **Verifica la instalación**:
   - Abre PowerShell o CMD
   - Ejecuta: `node --version`
   - Ejecuta: `npm --version`

## Paso 2: Instalar las Dependencias del Proyecto

Una vez que Node.js esté instalado:

```powershell
cd "d:\Desarrollo web"
npm install
```

Esto instalará:
- Vue 3.4.21
- Vue Router 4.3.0
- Axios 1.6.0 (para llamadas HTTP)
- Vite 5.0.0 (bundler)
- @vitejs/plugin-vue 5.0.0

## Paso 3: Configurar Google Sheets

### 3a. Crear un Proyecto en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto (botón "Nuevo Proyecto")
3. Dale un nombre: "Tech Distributor" (o el que prefieras)
4. Espera a que se cree

### 3b. Habilitar Google Sheets API

1. En la consola, busca "Google Sheets API"
2. Haz clic en "Habilitar"
3. Aparecerá una pantalla que dice "Para usar esta API..."

### 3c. Crear una Clave de API

1. En el menú de la izquierda, ve a "Credenciales"
2. Haz clic en "Crear credenciales" → "Clave de API"
3. Copia la clave que aparece
4. **IMPORTANTE**: Esta clave es sensible, guárdala en un lugar seguro
5. Considera aplicar restricciones de API solo a Google Sheets API

### 3d. Configurar el Archivo `.env` (Opcional pero Recomendado)

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SHEET_ID=TU_SHEET_ID_AQUI
VITE_API_KEY=TU_API_KEY_AQUI
```

Luego actualiza `src/services/googleSheetsAPI.js`:

```javascript
const SHEET_ID = import.meta.env.VITE_SHEET_ID || 'TU_SHEET_ID_AQUI'
const API_KEY = import.meta.env.VITE_API_KEY || 'TU_API_KEY_AQUI'
```

## Paso 4: Crear la Google Sheet de Productos

### 4a. Crear un Google Sheet

1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de cálculo
3. Dale el nombre "Tech Distributor - Productos"
4. Copia el ID de la hoja de la URL:
   ```
   https://docs.google.com/spreadsheets/d/[AQUI_ESTA_EL_ID]/edit
   ```

### 4b. Crear la Estructura de Datos

En la primera hoja (llamada "Productos"), crea las siguientes columnas (Fila 1):

```
A: Categoría
B: Nombre
C: Descripción
D: Precio
E: Stock
F: Imagen URL
G: Especificaciones
```

### 4c. Agregar Productos de Ejemplo

```
Procesadores | Intel Core i7-13700K | Procesador de alta performance | 450 | 15 | https://via.placeholder.com/300x300?text=Intel | 13ª gen, 16 núcleos
Procesadores | AMD Ryzen 7 7700X | Procesador RYZEN | 380 | 10 | https://via.placeholder.com/300x300?text=AMD | 7ª gen, 8 núcleos
Tarjetas Gráficas | NVIDIA RTX 4080 | Tarjeta gráfica de última generación | 1200 | 8 | https://via.placeholder.com/300x300?text=RTX | 16GB GDDR6X
```

### 4d. Hacer la Hoja Pública

1. En Google Sheets, haz clic en "Compartir"
2. Selecciona "Cualquiera que tenga el enlace"
3. Asegúrate de que sea "Visor"
4. Copia el enlace (aunque no lo necesites, es buena práctica)

## Paso 5: Ejecutar la Aplicación

Una vez que todo esté configurado:

```powershell
cd "d:\Desarrollo web"
npm run dev
```

La aplicación se abrirá automáticamente en http://localhost:5173

## Paso 6: Construir para Producción

Cuando quieras desplegar la aplicación:

```powershell
npm run build
```

Esto creará una carpeta `dist/` con los archivos optimizados listos para producción.

## Estructura de Carpetas Final

```
d:\Desarrollo web\
├── src\
│   ├── components\
│   │   ├── Header.vue
│   │   ├── NavBar.vue
│   │   ├── Footer.vue
│   │   └── ProductCard.vue
│   ├── pages\
│   │   ├── Home.vue
│   │   ├── Products.vue
│   │   └── Cart.vue
│   ├── services\
│   │   └── googleSheetsAPI.js
│   ├── stores\
│   │   └── cart.js
│   ├── App.vue
│   └── main.js
├── index.html
├── vite.config.js
├── package.json
├── README.md
└── .env (opcional)
```

## Solución de Problemas

### Error: "npm: El término 'npm' no se reconoce"

**Solución**: Node.js no está instalado. Descárgalo e instálalo desde https://nodejs.org/

### Error: "CORS policy"

**Solución**: La API Key puede no tener acceso públicamente. Asegúrate de:
1. La API Key tiene restricciones de referencia HTTP
2. La Google Sheet está compartida públicamente
3. Google Sheets API está habilitada en Google Cloud Console

### Los productos no cargan

**Solución**:
1. Verifica que SHEET_ID y API_KEY estén correctos
2. Verifica que el rango de datos sea correcto en `googleSheetsAPI.js`
3. Abre la consola (F12) para ver los errores de red
4. Comprueba que la Google Sheet tenga datos en la estructura correcta

### Puerto 5173 ya está en uso

**Solución**:
```powershell
npm run dev -- --port 5174
```

## Próximos Pasos

1. Personaliza los colores y estilos
2. Configura tu información de contacto
3. Agrega tus propios productos a la Google Sheet
4. Prueba el carrito de compras
5. Prepara la integración con una pasarela de pago

## Comandos Útiles

```powershell
# Instalar dependencias
npm install

# Desarrollo (con hot reload)
npm run dev

# Compilar para producción
npm run build

# Previsualizar el build
npm run preview

# Linting (si está configurado)
npm run lint
```

## Soporte

Si necesitas ayuda:
1. Revisa la sección "Solución de Problemas"
2. Consulta la documentación de Vue: https://vuejs.org/
3. Consulta la documentación de Vite: https://vitejs.dev/
4. Revisa Google Cloud Console para errores de API

¡Tu aplicación está lista para usar una vez que completes esta configuración!
