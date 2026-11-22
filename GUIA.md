# Guía para mantener el blog

Notas para mí: cómo escribir, previsualizar y publicar. El sitio se hace con [Hugo](https://gohugo.io) y se publica en [GitHub Pages](https://pages.github.com).

## Estructura

```
content/
  _index.md            texto de la portada
  acerca.md            página "Acerca"
  posts/               notas de matemáticas y computación (con KaTeX)
  cuentos/
  opiniones/
  fotos/<album>/       un álbum por carpeta: index.md + las fotos
layouts/               plantillas (sin tema externo)
static/css/style.css   todo el estilo
.github/workflows/     construye y publica el sitio en cada push
```

## 1. Instalar Hugo (una vez)

Hace falta **Hugo 0.122 o más reciente** (por la extensión que deja pasar el LaTeX).

```bash
hugo version                     # comprobar
sudo snap install hugo           # o descarga el .deb/.tar.gz de https://github.com/gohugoio/hugo/releases
```

El paquete de `apt` en Debian 12 es demasiado viejo; en Ubuntu 24.04 sirve.

## 2. Ver el blog en tu computador

```bash
cd ~/notes/myblog
hugo server -D        # -D muestra también los borradores
```

Abre http://localhost:1313. Cada vez que guardas un archivo la página se recarga.

## 3. Escribir una entrada nueva

```bash
cd ~/notes/myblog
hugo new content posts/teorema-de-perron.md          # nota
hugo new content cuentos/la-ultima-estacion.md       # cuento
hugo new content opiniones/sobre-frankenstein.md     # opinión
hugo new content fotos/villa-de-leyva/index.md       # álbum: luego copia las fotos a esa carpeta
```

Abre el archivo en tu editor, escribe debajo de la segunda línea `---` y cambia `draft: true` a `draft: false` cuando quieras publicarlo.

Mientras escribes, deja corriendo `hugo server -D` y mira http://localhost:1313: la página se actualiza cada vez que guardas.

### En inglés

La versión en inglés es otro archivo con el mismo nombre y `.en` antes de `.md`:

```
content/cuentos/el-ultimo-renglon.md      ← español  (sneikf.github.io/cuentos/...)
content/cuentos/el-ultimo-renglon.en.md   ← inglés   (sneikf.github.io/en/cuentos/...)
```

Para un álbum: `index.md` e `index.en.md` en la misma carpeta (las fotos se comparten).
No es obligatorio traducir todo: si una entrada no tiene versión en inglés, simplemente no aparece en `/en/`.

### Matemáticas, teoremas y fotos

- Fórmulas (en `posts/`): `$x^2$` en línea, `$$ ... $$` en bloque. Ya existen `\R`, `\N`, `\Z`, `\Q`, `\C`.
- Teoremas: `<div class="teorema">`, `<div class="definicion">` o `<div class="prueba">`, con una línea en blanco después de abrir y antes de cerrar.
- Índice en entradas largas: `toc: true` en el encabezado.
- Fotos: la que se llame `portada.jpg` es la portada del álbum. Los pies de foto van en `resources:` (mira el álbum de ejemplo). Antes de agregarlas, quítales los metadatos (pueden tener tu ubicación) y redúcelas:

  ```bash
  mogrify -auto-orient -strip -resize '2400x2400>' -quality 85 *.jpg   # ImageMagick, trabaja sobre copias
  ```

### Portada

La frase del inicio se configura al principio de `content/_index.md` (y de `_index.en.md` para inglés):

```yaml
subtitulo: "Matemáticas, computación, cuentos y fotos"
imagen: "img/inicio.jpg"           # opcional: imagen debajo (archivo en static/img/)
```

### Imagen junto al título (opiniones, cuentos o notas)

Convierte la entrada en carpeta, pon la imagen al lado del `index.md` y agrega una línea al encabezado:

```yaml
---
title: "Caminar la ciudad"
imagen: "calle.jpg"
---
```

El título y la fecha quedan a la izquierda y la imagen a la derecha (en el celular, la imagen va debajo del título).
Ejemplos: `opiniones/leer-en-papel/` (solo imagen en el título), `opiniones/caminar-la-ciudad/` y `cuentos/el-faro/` (imagen en el título y en el texto), `opiniones/ejemplo.md` y `cuentos/ejemplo.md` (sin imágenes).

### Imágenes dentro de una entrada

Convierte la entrada en carpeta (`content/posts/mi-nota/index.md`) y pon las imágenes al lado del `index.md`.

**Imagen sola, centrada:**

```markdown
![Descripción para lectores de pantalla](foto.jpg "Pie de foto opcional")
```

**Imagen con descripción** (texto a la izquierda en 1/4, imagen a la derecha en 3/4):

```markdown
{{< foto src="atardecer.jpg" titulo="Atardecer en Monserrate" >}}
Aquí va la descripción. Puede tener **negritas**, *cursivas*
y varios párrafos.
{{< /foto >}}
```

En el celular la imagen queda arriba y la descripción debajo.

### Fotos de un álbum con descripción

En el encabezado del `index.md` del álbum, cada foto puede llevar un minititulo (`title`) y una descripción (`descripcion`):

```yaml
resources:
  - src: "portada.jpg"
    title: "Cerros al amanecer"
    params:
      descripcion: "Primera luz sobre los cerros orientales."
  - src: "foto-2.jpg"
    title: "Mediodía"
    params:
      descripcion: |
        Una descripción más larga.

        Con varios párrafos.
  - src: "foto-3.jpg"        # sin título ni descripción: sale sola y centrada
```

En la sección Fotos, los álbumes aparecen regados y en orden aleatorio (cambia cada vez que publicas). Cada uno muestra su portada (la foto llamada `portada.jpg`, o la primera) con el título del álbum encima. Los tamaños y giros se ajustan en el CSS, en las reglas `.album:nth-child(...)`.

**Descripción a la derecha:** dentro de `params` agrega `lado: "derecha"`. Sin esa línea, la descripción va a la izquierda. En las entradas, la etiqueta también lo acepta: `{{< foto src="…" titulo="…" lado="derecha" >}}`.

**Secuencia (muchas fotos de lo mismo):** agrega `secuencia: true` en el encabezado del álbum (mira `content/fotos/montana/`). La descripción va arriba y debajo una fila de tres fotos con botones ‹ ›: con › entra una foto nueva por la derecha y se conservan las dos anteriores; es circular: después de la última vuelve la primera. Al tocar una foto, se abre en grande con la anterior y la siguiente a los lados (clic en ellas o en las flechas para avanzar). El orden es el de los nombres de archivo (`01.jpg`, `02.jpg`, `03.jpg`…): para agregar más fotos, cópialas con el número siguiente. El título y la descripción de la secuencia son los de la primera foto.

Las fotos se numeran solas (Lámina I, II, III…) en orden alfabético por nombre de archivo; para cambiar el orden, renómbralas (`01-cerros.jpg`, `02-mediodia.jpg`…).
En cualquier imagen, el clic abre el visor (lupa para acercar, pantalla completa, flechas ← → y Esc para cerrar).

### Microcuentos

En Cuentos, en la esquina superior derecha, está el enlace **Microcuentos**: una hoja que parece en blanco, donde cada microcuento aparece al pasar el mouse (o al tocarlo). Cada uno es una carpeta:

```
hugo new content microcuentos/la-lluvia/index.md
```

`title` es opcional. `date` ordena la hoja: el más reciente queda de último, abajo. Con `ocultar_fecha: true` la fecha no se muestra. Las imágenes van en la misma carpeta y se insertan con `![](foto.jpg)`. Apariencia: bloque 17 de `style.css`. Si un microcuento nuevo no aparece, reinicia `hugo server`. Detalles en la guía PDF, §4.

### Opciones de cada foto de un álbum

Dentro del bloque de cada foto en `resources:` (en `index.md` y también en `index.en.md`):

```yaml
resources:
  - src: "IMG_0803.JPG"      # a qué foto se refiere (nombre exacto del archivo)
    title: "Cazadores"       # minititulo
    params:
      descripcion: "…"       # descripción
      lado: "izquierda"      # texto a la izquierda o "derecha"; en una fila, lo pone al lado
      fila: 1                # fotos seguidas con el mismo número van en la misma fila
      orden: 1               # fuerza el puesto (casi nunca hace falta: ver abajo)
      girar: "derecha"       # enderezar: "derecha", "izquierda", "180" o "no"
      alinear_texto: "centro" # altura del texto junto a la foto: "arriba", "centro" o "abajo"
```

- **Orden:** las fotos salen en el orden de sus bloques en `resources:`; las que no tienen bloque van después (por nombre) y la portada siempre al final. Para mover una foto, mueve su bloque entero; si solo cambias el `src`, intercambias los textos, no las fotos.
- En el encabezado del álbum: `secuencia: true` (fila circular) y `alinear_titulo: "centro"` o `"derecha"`; el subtítulo sigue al título.
- «Descargar» y el crédito aparecen solo al abrir la foto en el visor.

Detalles y ejemplos en la guía PDF (versión 5), §6.

### Tonos y letras

Todo está al principio de `static/css/style.css`: `--papel` (fondo), `--grafito` (texto), `--grafito-fuerte` (títulos), `--tenue` (fechas), `--trazo` (líneas), y `--letra` / `--letra-titulos` (fuentes: Kalam fina y Caveat).
Los tonos del modo oscuro están justo debajo, repetidos en dos bloques: cambia ambos.
El grano de lápiz de los títulos es el filtro `lapiz` en `layouts/_default/baseof.html`; para quitarlo, borra las líneas `filter: url(#lapiz);` del CSS.
Las fotos se muestran en grises y recuperan el color al pasar el mouse (reglas `img { ... filter: grayscale(1) ... }` e `img:hover`). Para dejarlas siempre a color, borra `filter: grayscale(1) contrast(1.05);`.

## 4. Publicar

Cada vez que quieras publicar (una entrada nueva, una corrección o fotos):

```bash
cd ~/notes/myblog
git add -A
git commit -m "Nueva entrada: el último renglón"
git push
```

GitHub construye el sitio solo. En uno o dos minutos está en https://sneikf.github.io.
El avance se ve en la pestaña **Actions** del repositorio; si sale en rojo, ahí está el error.

Para guardar un borrador sin publicarlo, déjalo con `draft: true`: se sube al repositorio pero no aparece en el sitio.

## Autoría de fotos y textos

Todo el contenido está bajo CC BY-SA 4.0: quien lo use debe darte crédito. El blog lo deja claro de tres formas, en los dos idiomas:

- **Línea de crédito** debajo de cada foto y al final de cada entrada, álbum y hoja de microcuentos: `layouts/partials/credito.html`.
- **Firma** «© Esneider Sierra · CC BY-SA 4.0 · sneikf.github.io» en la versión grande de cada foto (la del visor y la descarga): `layouts/partials/firma.html`. Hugo borra los datos EXIF al reducir las fotos, así que esta es la forma de que el crédito viaje con el archivo.
- **Página «Cómo citar»**, enlazada en el pie: `content/como-citar.md` y `como-citar.en.md`.

Autor, licencia y dominio están en `[params]` de `hugo.toml`. Detalles en la guía PDF, §6.

## Comentarios en el código

Todos los archivos del diseño tienen comentarios en español que explican qué hace cada parte. Cada uno indica en qué capítulo de la guía en PDF (*Cómo actualizar el blog*, versión 4) se trata, por ejemplo `(Guía §8, «Página de inicio»)`. El capítulo 15 del PDF trae el mapa completo de archivos.

| Archivo | Comentario |
|---|---|
| `hugo.toml`, `i18n/*.toml` | `# hasta el final de la línea` |
| `layouts/**/*.html` | `{{/* … */}}` |
| `static/css/style.css` | `/* … */` (al principio hay un índice de 16 bloques) |
| `static/js/sitio.js` | `// …` o `/* … */` |

Dentro de un comentario no escribas `*/`: ahí termina el comentario.

## Licencia

Contenido bajo CC BY-SA 4.0 y código bajo MIT (ver `LICENSE`). 
