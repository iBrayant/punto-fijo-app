# Método del Punto Fijo

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)
![Licencia](https://img.shields.io/badge/licencia-MIT-green)

Calculadora web del **método del punto fijo** para encontrar raíces de ecuaciones. Escribes la función `g(x)`, el valor inicial, la tolerancia y el máximo de iteraciones, y la app muestra la raíz aproximada, la tabla de iteraciones y una gráfica que permite ver la convergencia.

> Proyecto académico — Ingeniería de Sistemas y Computación, Universidad de Cundinamarca.

<!-- TODO: captura o GIF de la app (guardar en docs/img/) -->
<!-- ![Demo](docs/img/demo.png) -->
<!-- TODO: enlace a la demo desplegada en Vercel -->

## Características

- **Entrada flexible:** cualquier expresión que entienda [math.js](https://mathjs.org/) (por ejemplo `sqrt(x + 2)`, `cos(x)`, `exp(-x)`).
- **Vista previa en LaTeX** de la función mientras se escribe, renderizada con KaTeX.
- **Tabla de iteraciones** con `x_{i+1}` y el error relativo porcentual de cada paso.
- **Gráfica interactiva** de `y = g(x)` y `y = x`: la raíz es su intersección, marcada en verde.
- **Manejo de errores:** avisa si la función diverge, produce valores indefinidos, la sintaxis es inválida o no converge en el máximo de iteraciones.
- **Lógica separada de la interfaz:** el algoritmo vive en `src/math/puntoFijo.ts`, con comentarios que explican cada paso.

## El método

Para resolver `f(x) = 0` se reescribe la ecuación como `x = g(x)` y se itera:

```
x_{i+1} = g(x_i)
ε_a = |(x_{i+1} − x_i) / x_{i+1}| × 100 %
```

La iteración se detiene cuando `ε_a` es menor o igual que la tolerancia, o al alcanzar el máximo de iteraciones.

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · math.js · KaTeX · Recharts · Lucide

## Estructura

```
src/
├── app/page.tsx          -> interfaz: formulario, tabla y gráfica
└── math/puntoFijo.ts     -> algoritmo del punto fijo (sin dependencias de React)
```

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre http://localhost:3000. Para compilar: `npm run build && npm start`.

## Ejemplo

Con `g(x) = sqrt(x + 2)`, `x₀ = 1`, tolerancia `0.001` y 50 iteraciones, el método converge a la raíz `x = 2`.

## Autor

**Brayant Vásquez Gómez** · [GitHub](https://github.com/iBrayant) · [LinkedIn](https://www.linkedin.com/in/brayant-v%C3%A1squez-g%C3%B3mez-4b483a1a1)

Licencia [MIT](LICENSE).
