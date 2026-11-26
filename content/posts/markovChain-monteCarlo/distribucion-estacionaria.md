---
title: ""
date: 2026-11-21
description: "Un ejemplo pequeño para ver cómo se escriben fórmulas y código."
tags: ["cadenas de markov", "probabilidad"]
draft: true
---
<!-- 
*Entrada de ejemplo: edítala o bórrala.*

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

<div class="teorema">

La cadena tiene una única distribución estacionaria, $\pi = \left( \dfrac{b}{a+b}, \dfrac{a}{a+b} \right)$.

</div>

Se puede comprobar numéricamente elevando $P$ a una potencia grande:

```python
import numpy as np

a, b = 0.3, 0.1
P = np.array([[1 - a, a], [b, 1 - b]])
print(np.linalg.matrix_power(P, 100)[0])  # ≈ [0.25, 0.75]
``` -->
