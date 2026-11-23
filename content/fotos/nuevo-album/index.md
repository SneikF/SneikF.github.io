---
title: "Nuevo álbum"
date: 2026-11-22
# BORRADOR: se ve con  hugo server -D  pero NO se publica.
# Cuando esté listo, cambia  draft: true  por  draft: false  (aquí y en index.en.md).
draft: true
# Secuencia de UNA foto a la vez: el título y la descripción de cada foto aparecen debajo
# de ella y cambian junto con la foto (Guía §6, «Secuencia de una foto»).
secuencia: "una"
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
      descripcion: "Texto de la primera foto. Cámbialo por el tuyo."
  - src: "02.jpg"
    params:
      descripcion: "Cada foto tiene su propio texto, que aparece debajo cuando la foto está en pantalla."
  - src: "03.jpg"
    params:
      descripcion: "Texto de la tercera foto."
  - src: "04.jpg"
  - src: "05.jpg"
    params:
      descripcion: "Con ‹ › se pasa de una foto a otra; después de la última vuelve la primera."
  - src: "06.jpg"
    params:
      descripcion: "Un clic en la foto la abre en grande."
---

*Texto de presentación del álbum: cámbialo por el tuyo.*
