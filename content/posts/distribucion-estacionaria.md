---
title: "Ejemplo: distribución estacionaria de una cadena de dos estados"
date: 2026-11-20
description: "Entrada de prueba para revisar cómo se ven las fórmulas."
tags: ["cadenas de markov", "probabilidad"]
draft: true
---

Esta entrada es un ejemplo: sirve para comprobar que KaTeX funciona. Bórrala o cámbiala cuando subas tus notas (con `draft: true` no se publica).

Sea $P$ la matriz de transición de una cadena con estados $\{1, 2\}$:

$$
P = \begin{pmatrix} P_{1,1} & P_{1,2} \\ P_{2,1} & P_{2,2} \end{pmatrix}
  = \begin{pmatrix} 1-a & a \\ b & 1-b \end{pmatrix},
\qquad 0 < a, b < 1.
$$

<div class="definicion">

Una distribución $\pi = (\pi_1, \pi_2)$ es **estacionaria** si $\pi P = \pi$ y $\pi_1 + \pi_2 = 1$.

</div>

La primera coordenada de $\pi P = \pi$ dice $\pi_1 (1-a) + \pi_2\, b = \pi_1$, es decir, $a\,\pi_1 = b\,\pi_2$. Con $\pi_1 + \pi_2 = 1$:

$$
\pi_1 = \frac{b}{a+b}, \qquad \pi_2 = \frac{a}{a+b}.
$$

Y un bloque de código, para ver el resaltado:

```python
import numpy as np

a, b = 0.3, 0.1
P = np.array([[1 - a, a], [b, 1 - b]])
print(np.linalg.matrix_power(P, 100)[0])  # ≈ [b/(a+b), a/(a+b)]
```
