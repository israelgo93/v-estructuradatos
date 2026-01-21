# Pac-Man Data Lab (ES)

Pac-Man Data Lab es un juego educativo retro que muestra **dónde** y **cómo** se usan estructuras de datos en un laberinto clásico. El juego incluye animación por ticks, IA básica de fantasmas y un panel explicativo con conceptos técnicos.

## Estructuras de datos en el juego

- **Matrices 2D** para representar el laberinto y colisiones en O(1).
- **Colas y BFS** para el camino más corto de los fantasmas.
- **Grafos** para modelar las conexiones entre celdas transitables.
- **Máquina de estados** para pausa, victoria y modo poder.

## Tecnologías

- React + TypeScript
- Vite
- Tailwind (CDN)

## Ejecutar localmente

1. Instalar dependencias:
   `npm install`
2. Iniciar el servidor:
   `npm run dev`
3. Abrir `http://localhost:5173`

## Nota sobre la IA comentarista

La IA es opcional. Si no hay clave configurada, el juego muestra mensajes de fallback.