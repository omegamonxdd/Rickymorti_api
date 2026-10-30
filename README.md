# Portal·Dex — Explorador interactivo del multiverso

Aplicación web que consulta personajes de [The Rick and Morty API](https://rickandmortyapi.com/documentation), los muestra con imagen y descripción, y permite buscarlos, filtrarlos y guardarlos como favoritos.

🔗 **Aplicación publicada:** `https://TU-USUARIO.github.io/proyecto-web-ia/`
📦 **Repositorio:** `https://github.com/TU-USUARIO/proyecto-web-ia`

## Integrantes

| Integrante | Contribución principal |
|---|---|
| _Nombre 1_ | _Estructura HTML y README_ |
| _Nombre 2_ | _Estilos CSS y diseño responsivo_ |
| _Nombre 3_ | _Lógica en JavaScript (fetch, búsqueda, filtros)_ |
| _Nombre 4_ | _Favoritos, modo oscuro/claro y pruebas_ |

## Descripción

Portal·Dex consume datos reales con `fetch()`. Cada página trae 20 personajes con foto, nombre, estado, especie y una descripción generada a partir de sus datos (origen, última ubicación y episodios). El diseño es asimétrico y colorido, con tarjetas inclinadas, un portal animado y sombras duras.

### Requisitos cubiertos

- [x] HTML, CSS y JavaScript separados (`index.html`, `style.css`, `script.js`).
- [x] Conexión a la API con `fetch()` (`async/await`).
- [x] 20 personajes por página con imagen y descripción.
- [x] Buscador por nombre (con retraso de 400 ms para no saturar la API).
- [x] Filtros por estado, género y especie, más orden alfabético.
- [x] Sección de favoritos guardada en `localStorage`.
- [x] Mensajes para «sin resultados» y «falló la consulta» (con botón de reintento).
- [x] Diseño adaptable a celular y computadora.
- [x] Publicación con GitHub Pages.
- [x] **Reto extra:** modo oscuro y claro.

## Instrucciones de uso

1. Abre la página; los personajes cargan solos.
2. Escribe en **Buscar por nombre** o usa los filtros de **Estado**, **Género** y **Especie**.
3. Usa **Ordenar página** para ver A → Z o Z → A.
4. Toca el ♥ de una tarjeta para guardarla; revisa tu colección en la pestaña **Favoritos**.
5. Navega con **Anterior / Siguiente**.
6. El botón circular de la esquina cambia entre modo oscuro y claro (se recuerda tu elección).

## Estructura

```
proyecto-web-ia/
├── index.html   # estructura de la página
├── style.css    # diseño, temas y adaptabilidad
├── script.js    # fetch, búsqueda, filtros, favoritos, tema
└── README.md
```

## ¿Cómo funciona?

- **`fetch()`**: `construirUrl()` arma la dirección con los filtros activos (`?page=1&name=rick&status=alive`) y `consultarPersonajes()` la pide a la API y convierte la respuesta con `.json()`.
- **Buscador**: cada vez que se escribe, se espera 400 ms, se vuelve a la página 1 y se hace una nueva consulta con el parámetro `name`. La API es quien filtra.
- **Cuando la API falla**: si responde 404 significa «sin resultados» y se muestra ese mensaje; si hay otro error o no hay conexión, el `catch` muestra «El portal falló» con un botón para reintentar.
- **Favoritos**: se guarda en `localStorage` una copia reducida de cada personaje, así se muestran aunque no haya internet.
- **Modo oscuro/claro**: el atributo `data-tema` de `<html>` cambia las variables CSS de color. Un pequeño script en `<head>` lo aplica antes de pintar para evitar parpadeos.

## Publicación en GitHub Pages

*Settings → Pages → Source: Deploy from a branch → Branch: `main` / `(root)` → Save.* La página queda en `https://TU-USUARIO.github.io/proyecto-web-ia/`.

---

# Documentación del uso de inteligencia artificial

Herramienta utilizada: **Claude (Anthropic)**.

## 1. Tres prompts importantes

**Prompt 1 — Generación inicial**
> «Crea una página que consulte la API de Rick and Morty con fetch(), muestre al menos 10 personajes con imagen y descripción, tenga buscador, filtros, favoritos guardados en localStorage, mensajes cuando no haya resultados o falle la consulta, y sea adaptable a celular y computadora. Que la interfaz sea artística y asimétrica, no minimalista, pero sin sobrecargar. Todo el código y los textos en español.»

*Resultado:* los tres archivos base. Sirvió para tener una estructura completa que luego revisamos función por función.

**Prompt 2 — Entender el código**
> «Explícame línea por línea qué hace `consultarPersonajes()` y por qué se usa `async/await` en lugar de `.then()`. Quiero poder explicarlo en clase.»

*Resultado:* entendimos que `await` pausa la función hasta que llega la respuesta sin congelar la página, y que `try/catch` captura los fallos de red.

**Prompt 3 — Mejora concreta**
> «Si escribo rápido en el buscador salen resultados de una búsqueda vieja encima de la nueva. ¿Cómo lo evito?»

*Resultado:* se agregó `AbortController` para cancelar la petición anterior y el retraso (`retrasar`) de 400 ms en el buscador.

## 2. Respuesta de la IA que requirió correcciones

Al pedir «ordenar los resultados alfabéticamente», la primera idea fue añadir un parámetro de orden a la URL de la API. Revisamos la documentación y la API **no** ofrece ese parámetro. Corregimos el enfoque: el orden se hace en el navegador con `sort()` y `localeCompare("es")` sobre los 20 personajes de la página actual. Por eso el selector dice «Ordenar página» y no «Ordenar todo».

## 3. Un error encontrado y cómo lo resolvimos

**Error:** al buscar un nombre inexistente (por ejemplo «zzzz») la página mostraba «falló la consulta» en vez de «sin resultados».
**Causa:** la API responde con código **404** cuando no hay coincidencias. `fetch()` no lanza error con un 404, pero la validación `if (!respuesta.ok)` sí lo trataba como fallo.
**Solución:** revisar `respuesta.status === 404` **antes** de la validación general y mostrar el mensaje «Sin resultados». Así se distingue entre «no hay datos» (404) y «algo falló» (red caída, error 500).

## 4. Modificación al código que podemos explicar (reto: modo oscuro/claro)

- En `style.css` los colores están en variables dentro de `:root[data-tema="oscuro"]` y `:root[data-tema="claro"]`.
- En `script.js`, `aplicarTema()` cambia `document.documentElement.dataset.tema` y guarda la elección en `localStorage`.
- En `index.html`, un script en `<head>` lee la preferencia guardada (o la del sistema con `prefers-color-scheme`) antes de que se dibuje la página.
- Sin ese script, al recargar en modo claro se veía un destello oscuro por una fracción de segundo.

## 5. Reflexión: qué aprendimos usando IA

La IA acelera mucho el primer borrador, pero no sabe si algo funciona en nuestro caso: tuvimos que probar, leer la documentación de la API y contrastar. Aprendimos que `fetch()` solo falla por problemas de red y que los códigos HTTP hay que revisarlos a mano, y que dividir el código en funciones pequeñas hace más fácil entenderlo y corregirlo. También que pedir «explícame esto» es tan útil como pedir «hazlo», porque en la presentación cada integrante debe poder justificar lo que hay en el código. Usamos la IA como apoyo, no como reemplazo de entender el proyecto.

## Dificultades

- Entender la diferencia entre un error de red y una respuesta 404.
- Evitar que resultados de búsquedas antiguas pisaran los nuevos.
- Lograr un diseño asimétrico sin perder la lectura en celular.
- Trabajar en equipo editando archivos desde la web de GitHub sin pisar los cambios de otros (resolvimos esto con ramas y Pull Requests).
