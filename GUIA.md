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

## Licencia

Contenido bajo CC BY-SA 4.0 y código bajo MIT (ver `LICENSE`). 
