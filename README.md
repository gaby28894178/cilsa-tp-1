# ShopColor - Tienda de Tecnología

Mini tienda responsive inspirada en el diseño VibrantPulse. Estilo limpio, tipografía bold navy, botones pill naranja/azul, fondo claro y cards con bordes redondeados.

## 🚀 Cómo ejecutar

Necesitas un servidor local por el uso de `fetch()`:

```bash
# Opción 1
npx serve .

# Opción 2: Live Server en VS Code

# Opción 3
python -m http.server 8080
```

## 📁 Estructura

```
├── index.html                  ← Home (hero + carrusel + productos + ofertas)
├── styles.css                  ← Estilos globales
├── data/
│   └── productos.json          ← Datos de productos, categorías y ofertas
├── components/
│   ├── navbar.html             ← Navbar (Home | Shop | Contact Us + iconos)
│   ├── footer.html             ← Footer con columnas
│   └── modals.html             ← Modal registro + carrito + toast
├── pages/
│   ├── productos.html          ← Shop con sidebar de categorías
│   ├── ofertas.html            ← Ofertas especiales
│   └── contacto.html           ← Contacto estilo VibrantPulse
└── js/
    ├── components.js           ← Carga dinámica de componentes
    ├── carrito.js              ← Lógica carrito (localStorage)
    ├── carrusel.js             ← Carrusel desde JSON
    ├── productos.js            ← Grid productos + categorías
    └── ofertas.js              ← Grid ofertas
```

## 📦 JSON (`data/productos.json`)

### Producto

```json
{
    "id": 5,
    "nombre": "SonicWave Over-Ear",
    "descripcion": "Immersive noise cancellation for crystal-clear audio.",
    "precio": 59.99,
    "icono": "bi-headphones",
    "imagen": "",
    "categoria": "audio"
}
```

### Producto destacado (carrusel)

```json
{
    "id": 1,
    "nombre": "Audífonos Premium",
    "descripcion": "Immersive noise cancellation...",
    "precio": 49.99,
    "icono": "bi-headphones",
    "imagen": "",
    "colorSlide": "slide-1"
}
```

### Oferta

```json
{
    "id": 12,
    "nombre": "Pack Gamer",
    "precioOriginal": 120.00,
    "precio": 84.00,
    "descuento": "-30%",
    "icono": "bi-controller",
    "imagen": ""
}
```

### Categoría

```json
{
    "id": "audio",
    "nombre": "Audio Premium"
}
```

### Campo `imagen`

| Valor | Comportamiento |
|-------|---------------|
| `""` (vacío) | Muestra el icono de Bootstrap Icons |
| `"https://url.com/foto.jpg"` | Muestra la imagen desde URL |
| `"img/producto.png"` | Muestra la imagen desde path local |

## 🖼️ Imágenes en el JSON

Cada producto tiene un campo `"imagen"`. La lógica es:

- Si `"imagen": ""` → se muestra el **icono** de Bootstrap Icons definido en `"icono"`.
- Si `"imagen": "https://..."` o `"imagen": "img/foto.png"` → se muestra la **imagen** centrada.

Las imágenes se renderizan con `object-fit: contain` y `object-position: center`, lo que significa que **nunca se cortan**. Se muestran completas dentro del contenedor, centradas tanto horizontal como verticalmente, con un padding interno para que respiren.

**Ejemplo con imagen URL:**
```json
{
    "id": 5,
    "nombre": "SonicWave Over-Ear",
    "descripcion": "Immersive noise cancellation.",
    "precio": 59.99,
    "icono": "bi-headphones",
    "imagen": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    "categoria": "audio"
}
```

**Ejemplo sin imagen (usa icono):**
```json
{
    "id": 6,
    "nombre": "Pulse Core Watch",
    "descripcion": "Health tracking with style.",
    "precio": 29.99,
    "icono": "bi-smartwatch",
    "imagen": "",
    "categoria": "electronica"
}
```

## 🛒 Carrito de Compras

### Cómo funciona

El carrito se maneja en `js/carrito.js`. Es un array de objetos que se guarda en el **localStorage** del navegador bajo la clave `shopcolor_carrito`.

### Estructura del array en localStorage

```json
// localStorage.getItem('shopcolor_carrito') devuelve:
[
    {
        "nombre": "SonicWave Over-Ear",
        "precio": 59.99,
        "cantidad": 2
    },
    {
        "nombre": "Pulse Core Watch",
        "precio": 29.99,
        "cantidad": 1
    }
]
```

### Clave en localStorage

| Clave | Valor |
|-------|-------|
| `shopcolor_carrito` | Array JSON con los productos agregados |

### Funciones disponibles

| Función | Descripción |
|---------|-------------|
| `agregarAlCarrito(nombre, precio)` | Agrega un producto. Si ya existe, incrementa `cantidad` |
| `eliminarDelCarrito(index)` | Reduce cantidad en 1. Si llega a 0, elimina el item |
| `vaciarCarrito()` | Vacía todo el array y limpia localStorage |
| `finalizarCompra()` | Simula compra, vacía carrito y muestra toast de éxito |
| `actualizarContador()` | Actualiza el badge numérico en el icono del carrito |
| `actualizarVistaCarrito()` | Renderiza la lista de items dentro del modal |
| `mostrarToast(mensaje, tipo)` | Muestra notificación toast (success/warning) |

### Flujo del carrito

1. El usuario hace click en "Add to Cart" o el botón `+` de un producto
2. Se llama `agregarAlCarrito(nombre, precio)`
3. Se busca si el producto ya existe en el array → si sí, se incrementa `cantidad`; si no, se agrega con `cantidad: 1`
4. Se guarda el array actualizado en `localStorage.setItem('shopcolor_carrito', JSON.stringify(carrito))`
5. Se actualiza el badge contador en el navbar
6. Se muestra un toast de confirmación

### Persistencia entre páginas

Como se usa `localStorage`, el carrito **persiste** al navegar entre Home, Shop, Ofertas y Contacto. Al recargar la página o cerrar el navegador, los datos siguen ahí hasta que el usuario vacíe el carrito o finalice la compra.

### Modal del carrito

Al hacer click en el icono 🛒 del navbar se abre un modal (Bootstrap) que muestra:
- Lista de productos con nombre, precio unitario × cantidad y subtotal
- Botón para eliminar cada item
- Total general
- Botón "Vaciar" y botón "Finalizar Compra"

## 🌐 Recursos externos (CDN)

| Recurso | URL | Uso |
|---------|-----|-----|
| Bootstrap 5.3.2 CSS | `https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css` | Grid, componentes, utilidades |
| Bootstrap Icons 1.11.1 | `https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css` | Iconos (cart, headphones, etc.) |
| Bootstrap 5.3.2 JS | `https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js` | Modales, carousel, collapse, toasts |

No se usan fuentes externas (Google Fonts), jQuery ni ninguna otra librería. Solo Bootstrap desde jsDelivr.

## 🎨 Paleta de colores

| Color | Variable | Hex |
|-------|----------|-----|
| Navy | `--navy` | `#1a1f71` |
| Navy dark | `--navy-dark` | `#0f1347` |
| Blue | `--blue` | `#1d4ed8` |
| Orange | `--orange` | `#c2410c` |
| Background | `--bg-light` | `#f0f4ff` |

## ⚙️ Funcionalidades

- Navbar limpia con links centrados + iconos search/cart a la derecha
- Hero con badge, título bold, subtexto y 2 botones pill
- Carrusel split (texto izquierda + imagen derecha)
- Grid de productos con sidebar de categorías
- Badges en productos (NEW, BEST SELLER, OFFER)
- Cards con bordes redondeados grandes (20px)
- Ofertas con badge de descuento
- Página de contacto estilo "Let's start a conversation"
- Modal de registro y carrito
- Carrito persistente con localStorage
- Botón flotante de chat (esquina inferior derecha)
- Responsive mobile-first

## 🛠️ Tecnologías

- HTML5
- CSS3 (variables, flexbox, grid)
- JavaScript ES6+ (vanilla)
- Bootstrap 5.3.2
- Bootstrap Icons 1.11.1
