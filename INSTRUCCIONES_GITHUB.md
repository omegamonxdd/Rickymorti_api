# Cómo subir y publicar el proyecto (solo con la web de GitHub)

> Este archivo es una guía para ti: **no lo subas** al repositorio.

## 1. Crear el repositorio
1. Entra a https://github.com e inicia sesión.
2. Clic en **+** (arriba a la derecha) → **New repository**.
3. *Repository name:* `proyecto-web-ia` · visibilidad **Public** · marca **Add a README file** → **Create repository**.
4. Agrega a tus compañeros en **Settings → Collaborators → Add people**.

## 2. Subir los archivos (varios commits)
Para cumplir con los **6 commits**, sube o edita archivo por archivo:

1. **Commit 1:** *Add file → Create new file* → nombre `index.html` → pega el contenido → *Commit changes* con mensaje `Agrega estructura HTML base`.
2. **Commit 2:** crea `style.css` → `Agrega estilos y diseño responsivo`.
3. **Commit 3:** crea `script.js` → `Agrega consulta a la API con fetch`.
4. **Commit 4:** abre `README.md` → ícono del lápiz → reemplaza con el README entregado → `Documenta proyecto y uso de IA`.
5. **Commits 5 y 6:** haz cambios pequeños reales (ver abajo), cada uno con su commit.

Cada integrante debe hacer al menos un commit con **su propia cuenta**.

## 3. Issues (mínimo 2)
Pestaña **Issues → New issue**. Ejemplos:
- *«Ordenar solo afecta la página actual»* (limitación conocida).
- *«Agregar historial de búsquedas»* (mejora futura).

## 4. Pull Request (mínimo 1)
1. En el repo, botón **main** → escribe un nombre de rama (ej. `mejora-textos`) → **Create branch**.
2. En esa rama edita un archivo (por ejemplo el pie de página en `index.html`) → *Commit changes*.
3. Aparecerá el aviso **Compare & pull request** → escribe título y descripción (puedes escribir `Closes #1` para enlazar un Issue) → **Create pull request**.
4. Otro compañero revisa y presiona **Merge pull request**.

## 5. Activar GitHub Pages
1. **Settings → Pages**.
2. *Source:* **Deploy from a branch**.
3. *Branch:* `main` y carpeta `/ (root)` → **Save**.
4. Espera 1–2 minutos y recarga: arriba aparecerá la URL `https://TU-USUARIO.github.io/proyecto-web-ia/`.

## 6. Pendientes antes de entregar
- En `README.md` reemplaza `TU-USUARIO` y completa la tabla de **Integrantes**.
- Verifica que los archivos estén en la **raíz** (no dentro de otra carpeta) para que Pages encuentre `index.html`.
- Abre la URL pública en tu celular y prueba buscador, filtros y favoritos.
- Si ves la página sin cambios tras editar, fuerza recarga con **Ctrl + F5**.
