{{- /* Plantilla de toda entrada nueva (Guía §2, «Paso a paso»).
   «hugo new content cuentos/mi-cuento.md» copia esto y rellena:
     title  → el nombre del archivo con mayúsculas (mi-cuento → Mi Cuento)
     date   → la fecha y hora de ese momento
   draft: true = borrador: se ve con «hugo server -D» pero no se publica
   hasta que lo cambies a false. Este comentario no aparece en la entrada. */ -}}
---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ .Date }}
description: ""
tags: []
draft: true
---
