---
title: "Stationary distribution of a two-state chain"
date: 2026-11-21
description: "A small example showing how to write formulas and code."
tags: ["markov chains", "probability"]
draft: false
---

*Example post: edit it or delete it.*

Let $P$ be the transition matrix of a chain with states $\{1, 2\}$:

$$
P = \begin{pmatrix} P_{1,1} & P_{1,2} \\ P_{2,1} & P_{2,2} \end{pmatrix}
  = \begin{pmatrix} 1-a & a \\ b & 1-b \end{pmatrix},
\qquad 0 < a, b < 1.
$$

A distribution $\pi = (\pi_1, \pi_2)$ is **stationary** if $\pi P = \pi$ and $\pi_1 + \pi_2 = 1$.

The first coordinate of $\pi P = \pi$ reads $\pi_1 (1-a) + \pi_2\, b = \pi_1$, that is, $a\,\pi_1 = b\,\pi_2$. Together with $\pi_1 + \pi_2 = 1$:

$$
\pi = \left( \frac{b}{a+b}, \frac{a}{a+b} \right).
$$

We can check it numerically by raising $P$ to a large power:

```python
import numpy as np

a, b = 0.3, 0.1
P = np.array([[1 - a, a], [b, 1 - b]])
print(np.linalg.matrix_power(P, 100)[0])  # ≈ [0.25, 0.75]
```
