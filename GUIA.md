# Guía para mantener el blog

Notas para mí: cómo escribir, previsualizar y publicar. El sitio se hace con [Hugo](https://gohugo.io) y se publica en [Codeberg Pages](https://codeberg.page).

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
publicar.sh            construye y sube el sitio
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

## 3. Escribir

```bash
hugo new content posts/teorema-de-perron.md
hugo new content cuentos/la-ultima-estacion.md
hugo new content opiniones/sobre-frankenstein.md
hugo new content fotos/villa-de-leyva/index.md    # luego copia las fotos a esa carpeta
```

Cada archivo empieza en `draft: true`. Cámbialo a `draft: false` (o borra la línea) cuando quieras publicarlo.

**Matemáticas** (solo en `posts/`, o en cualquier página con `math: true`):
`$x^2$` o `\(x^2\)` en línea, `$$ ... $$` o `\[ ... \]` en bloque. Ya están definidas `\R`, `\N`, `\Z`, `\Q`, `\C`.

**Teoremas**: envuelve el texto en `<div class="teorema">`, `<div class="definicion">` o `<div class="prueba">`, dejando una línea en blanco después de abrir y antes de cerrar el `div`.

**Índice**: pon `toc: true` en el encabezado de una entrada larga.

**Fotos**: el sitio publica solo copias redimensionadas, no los originales. Pero el repositorio es público, así que antes de agregar fotos **quítales los metadatos** (pueden tener la ubicación GPS) y redúcelas para que el repositorio no crezca demasiado:

```bash
# ImageMagick; modifica los archivos, así que trabaja sobre copias
mogrify -auto-orient -strip -resize '2400x2400>' -quality 85 *.jpg
```

## 4. Publicar en Codeberg (una vez)

1. Crea una cuenta en https://codeberg.org.
2. Crea un repositorio **público** llamado `pages`.
3. En `hugo.toml`, cambia `SneikF` por tu usuario.
4. Sube el código fuente:
   ```bash
   cd ~/notes/myblog
   git init -b main
   git add -A && git commit -m "Primer commit"
   git remote add origin git@codeberg.org:SneikF/pages.git
   git push -u origin main
   ```
5. En el repositorio: **Settings → Webhooks → Add webhook**, elige el de **git-pages**, deja la URL por defecto (`https://sneikf.codeberg.page/`) y pon `pages` en **Branch filter**.
6. Publica:
   ```bash
   chmod +x publicar.sh
   ./publicar.sh
   ```

El blog queda en `https://sneikf.codeberg.page/`.

## Rutina de siempre

```bash
git add -A && git commit -m "Nueva entrada" && git push   # guarda el fuente
./publicar.sh                                              # actualiza el sitio
```

## Licencia

Contenido bajo CC BY-SA 4.0 y código bajo MIT (ver `LICENSE`). Codeberg está pensado para proyectos libres, así que conviene que el contenido tenga una licencia libre.
