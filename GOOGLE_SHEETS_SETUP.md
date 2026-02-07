# Instrucciones de Google Sheets Setup

## Estructura Recomendada para tu Google Sheet

Tu Google Sheet debe tener al menos una hoja llamada **"Productos"** con la siguiente estructura:

### Encabezados (Fila 1)
```
| A           | B     | C            | D      | E     | F           | G              |
|-------------|-------|--------------|--------|-------|-------------|----------------|
| Categoría   | Nombre | Descripción  | Precio | Stock | Imagen URL  | Especificaciones |
```

### Ejemplo de Datos

```
| Categoría          | Nombre                  | Descripción                        | Precio | Stock | Imagen URL | Especificaciones                |
|--------------------|------------------------|-----------------------------------|--------|-------|------------|--------------------------------|
| Procesadores       | Intel Core i7-13700K  | Procesador de alta performance   | 450    | 15    | [URL]      | 13ª generación, 16 núcleos     |
| Procesadores       | AMD Ryzen 7 7700X     | Procesador RYZEN de rendimiento  | 380    | 10    | [URL]      | 7ª generación, 8 núcleos       |
| Tarjetas Gráficas  | NVIDIA RTX 4080       | Tarjeta gráfica última gen       | 1200   | 8     | [URL]      | 16GB GDDR6X, 9728 CUDA cores   |
| Tarjetas Gráficas  | AMD Radeon RX 7900    | GPU AMD de alto desempeño        | 899    | 12    | [URL]      | 24GB GDDR6, 6144 Stream Proc   |
| Memoria RAM        | Corsair Vengeance 32GB| Memoria RAM DDR5 de velocidad   | 180    | 25    | [URL]      | DDR5, 6000MHz, CAS 30          |
| Almacenamiento     | Samsung 990 Pro 2TB   | SSD NVMe última generación       | 220    | 30    | [URL]      | PCIe 4.0, 7450MB/s lectura     |
```

## Pasos para Configurar

### 1. Obtener el Sheet ID

1. Abre tu Google Sheet en https://sheets.google.com
2. Mira la URL:
   ```
   https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p/edit
                                          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                          Este es tu SHEET_ID
   ```

### 2. Obtener tu API Key

1. Ve a https://console.cloud.google.com/
2. Selecciona tu proyecto
3. Ve a "Credenciales" en el menú izquierdo
4. Haz clic en "Crear credenciales" → "Clave de API"
5. Copia la clave

### 3. Actualizar googleSheetsAPI.js

Abre `src/services/googleSheetsAPI.js` y reemplaza:

```javascript
const SHEET_ID = 'TU_SHEET_ID_AQUI'  // ← Reemplaza con tu Sheet ID
const API_KEY = 'TU_API_KEY_AQUI'    // ← Reemplaza con tu API Key
```

Por ejemplo:
```javascript
const SHEET_ID = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p'
const API_KEY = 'AIzaSyA1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q'
```

### 4. Hacer tu Google Sheet Público

1. En Google Sheets, haz clic en "Compartir"
2. Selecciona "Cambiar"
3. En "Acceso general", selecciona "Cualquiera que tenga el enlace"
4. Asegúrate de que sea "Visor"
5. Haz clic en "Copiar enlace"
6. Haz clic en "Listo"

### 5. Verificar que Google Sheets API está Habilitada

1. Ve a https://console.cloud.google.com/apis/library
2. Busca "Google Sheets API"
3. Haz clic en ella
4. Asegúrate de que dice "API habilitada"
5. Si no, haz clic en "Habilitar"

## Formato de Datos Importante

### Tipos de Datos

- **Categoría**: Texto (máx 50 caracteres)
- **Nombre**: Texto (máx 100 caracteres)
- **Descripción**: Texto (máx 255 caracteres)
- **Precio**: Número (ej: 450, 1200.50)
- **Stock**: Número entero (ej: 15, 0, 100)
- **Imagen URL**: URL completa (ej: https://...)
- **Especificaciones**: Texto (máx 200 caracteres)

### Ejemplos de URLs de Imágenes

Puedes usar:
- URLs de tus propias imágenes hospedadas
- Placeholder de ejemplo: `https://via.placeholder.com/300x300?text=ProductName`
- URLs de imágenes públicas

Ejemplo válido:
```
https://via.placeholder.com/300x300?text=Intel+i7
https://images.example.com/products/graphics-card-001.jpg
```

## Validación de Datos

### Precios
- Deben ser números
- Pueden tener decimales (ej: 199.99)
- No incluyas símbolos de moneda

### Stock
- Debe ser un número entero
- Si es 0, el producto aparecerá como "Agotado"
- El botón de compra se deshabilitará

### URLs de Imágenes
- Deben ser URLs válidas (comenzar con http:// o https://)
- Si falta, aparecerá una imagen placeholder

## Añadir Más Productos

Simplemente añade nuevas filas a tu Google Sheet. Por ejemplo, fila 2, 3, 4, etc.:

```
Fila 2: Procesadores | Intel Core i7-13700K | ... | 450 | 15 | [URL] | 13ª gen, 16 núcleos
Fila 3: Procesadores | AMD Ryzen 7 7700X  | ... | 380 | 10 | [URL] | 7ª gen, 8 núcleos
Fila 4: Tarjetas Gráficas | NVIDIA RTX 4080 | ... | 1200 | 8 | [URL] | 16GB GDDR6X
```

## Categorías Sugeridas

Puedes usar cualquier categoría, pero aquí hay algunas sugerencias:

- Procesadores
- Tarjetas Gráficas
- Memoria RAM
- Almacenamiento
- Monitores
- Teclados y Ratones
- Fuentes de Poder
- Cajas de PC
- Refrigeración
- Accesorios

## Filtros Automáticos

La aplicación detecta automáticamente:
- Todas las categorías únicas de tus productos
- Las muestra en el filtro de "Todas las categorías"

No necesitas hacer nada especial, la aplicación se actualiza automáticamente.

## Troubleshooting

### "No se encontraron productos"

1. Verifica que la Sheet ID es correcta
2. Verifica que la API Key es correcta
3. Abre la consola (F12) en el navegador
4. Mira el error específico en la pestaña "Network" o "Console"

### "Error de CORS"

Esto significa que:
1. Tu API Key puede no estar configurada correctamente
2. Google Sheets API puede no estar habilitada
3. Tu Google Sheet puede no ser público

### Los precios no se muestran correctamente

Asegúrate de que en la columna D (Precio) los valores sean números, no texto.

### Las imágenes no cargan

Verifica que:
1. Las URLs comienzan con `http://` o `https://`
2. Las URLs son válidas y accesibles
3. No tienen espacios sin codificar (usa `%20` en lugar de espacios)

## Ejemplo de Google Sheet Completo

Aquí está la estructura completa con datos:

```
HOJA: "Productos"

A: Categoría
B: Nombre
C: Descripción
D: Precio
E: Stock
F: Imagen URL
G: Especificaciones

[Fila 1 - Encabezados]
Categoría | Nombre | Descripción | Precio | Stock | Imagen URL | Especificaciones

[Fila 2]
Procesadores | Intel Core i7-13700K | Procesador de alta performance | 450 | 15 | https://via.placeholder.com/300x300?text=Intel+i7 | 13ª generación, 16 núcleos, 24 threads

[Fila 3]
Procesadores | AMD Ryzen 7 7700X | Procesador RYZEN de rendimiento | 380 | 10 | https://via.placeholder.com/300x300?text=AMD | 7ª generación, 8 núcleos, 16 threads

[Y así sucesivamente...]
```

Una vez que hayas configurado esto, tu aplicación debería cargar todos los productos automáticamente.
