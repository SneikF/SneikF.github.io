---
title: "Nuevo álbum"
date: 2026-11-22
# BORRADOR: se ve con  hugo server -D  pero NO se publica.
# Cuando esté listo, cambia  draft: true  por  draft: false  (aquí y en index.en.md).
draft: true
# Secuencia de UNA foto a la vez: el título y la descripción de cada foto aparecen debajo
# de ella y cambian junto con la foto (Guía §6, «Secuencia de una foto»).
secuencia: "una"
nota_secuencia: false
# Solo el número romano (IV), sin la palabra «Lámina»
solo_numeros: true
# Sin firma en las fotos ampliadas o descargadas, y sin crédito en la barra del visor
firma: false
credito: false
# Fotos de ejemplo (01.jpg … 06.jpg): reemplázalas por las tuyas y cambia los textos.
# Las fotos salen en el orden de estos bloques; cada una con su texto.
# Cada foto muestra su número (Lámina I, II…) y su descripción; title es opcional.
resources:
  - src: "01.jpg"
    params:
      descripcion: "Texto1"
  - src: "02.jpg"
    params:
      descripcion: "texto2."
  - src: "03.jpg"
    params:
      descripcion: "texto3."
  - src: "04.jpg"
  - src: "05.jpg"
    params:
      descripcion: "texto4"
  - src: "06.jpg"
    params:
      descripcion: "texto5"
---

*prueba*
