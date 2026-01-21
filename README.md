# EstructuraDatos.org

EstructuraDatos.org es una organización tecnológica **sin fines de lucro** que construye recursos **open source** para el aprendizaje gratuito de programación y estructuras de datos.

## Proyecto inicial: Visualizador ES

Visualizador ES es la primera contribución de la organización. Permite aprender estructuras de datos mediante visualizaciones 3D, análisis en tiempo real y ejemplos interactivos. La interfaz funciona en español e inglés.

## Nuevo proyecto: Pac-Man Data Lab

Pac-Man Data Lab es una experiencia interactiva diseñada para enseñar conceptos fundamentales de ciencias de la computación a través de un videojuego clásico. Juega mientras aprendes cómo funcionan los algoritmos en tiempo real.

### Características Visuales

| Elemento | Descripción |
|----------|-------------|
| **Laberinto Neón** | Paredes con efecto de brillo azul y gradientes |
| **Pellets Brillantes** | Puntos amarillos con animación de glow pulsante |
| **Power Pellets** | Esferas con animación de escala y brillo intenso |
| **Pac-Man Dinámico** | Color cyan en modo power, animación de boca fluida |
| **Fantasmas Animados** | Colores vibrantes, ondulación y ojos expresivos |

### Panel Educativo Interactivo

- **Monitor de Aprendizaje**: Comentarios contextuales que explican cada acción del juego
- **Estado en Tiempo Real**: Posición `[x, y]`, celda actual `maze[y][x]`, modo de fantasmas
- **Concepto Destacado**: Explicaciones O(1), BFS y FSM que cambian según los eventos
- **Arquitectura Técnica**: Tarjetas explicativas de Matrices 2D, BFS, Pathfinding y FSM

### Estructuras de Datos en Acción

```
┌─────────────────────────────────────────────────────────────┐
│  MATRICES 2D          │  El laberinto es number[][] donde  │
│  ═══════════          │  0=vacío, 1=pared, 2=pellet        │
├─────────────────────────────────────────────────────────────┤
│  ALGORITMO BFS        │  Los fantasmas calculan el camino  │
│  ════════════         │  más corto usando cola + visitados │
├─────────────────────────────────────────────────────────────┤
│  LÓGICA FSM           │  Estados: CHASE, SCATTER,          │
│  ══════════           │  FRIGHTENED controlan la IA        │
└─────────────────────────────────────────────────────────────┘
```

### Parámetros Educativos

- **Velocidad**: 350ms por tick (lento para observar algoritmos)
- **Modo Power**: 50 ticks de duración extendida
- **Tamaño**: 28px por tile para mejor visibilidad

## Rutas principales

- Landing organizacional: `/`
- Landing del visualizador: `/visualizador-es`
- Aplicación interactiva: `/visualizer`
- Juego Pac-Man: `/pacman-es`

## Metodología

Metodología: aprendizaje basado en práctica con simulaciones 3D y análisis en tiempo real.

## Características principales del Visualizador ES

- Visualizaciones 3D interactivas para estructuras esenciales.
- Aplicaciones educativas con escenarios reales.
- Feedback paso a paso y análisis de complejidad.
- Soporte bilingüe ES/EN.
- Control por gestos con MediaPipe en la app de visión artificial.
- Interacción con mouse (pan, rotación y zoom).

## Estructuras y aplicaciones incluidas

### Estructuras de datos

- Pila, Cola, Lista Enlazada, Árbol Binario de Búsqueda (BST), AVL, Heap.

### Aplicaciones

- Cola de Mensajes, Multiplicación Polinomial, Algoritmo de Dijkstra, Aprendizaje con Visión Artificial.

## Stack tecnológico

- Next.js 15.1.2 + React 19
- TypeScript 5
- Three.js 0.182 / @react-three/fiber / @react-three/drei
- @react-spring/three y framer-motion
- MediaPipe Tasks Vision
- i18next + react-i18next
- TailwindCSS + shadcn/ui

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/israelgo93/estructuradatos.org
cd estructuradatos.org
```

1. Instalar dependencias:

```bash
npm install
```

1. Ejecutar el servidor de desarrollo:

```bash
npm run dev
```

1. Abrir [http://localhost:3000](http://localhost:3000)

## Despliegue con Docker (Cloud Run)

Este proyecto usa `output: "export"` en `next.config.ts`, por lo que el build genera un sitio estático en `out/`. El contenedor sirve ese contenido con Nginx en el puerto `8080` (requerido por Cloud Run). No requiere variables de entorno.

1. Build de imagen:

```bash
docker build -t estructuradatos-org .
```

1. Probar localmente:

```bash
docker run --rm -p 8080:8080 estructuradatos-org
```

1. Abrir [http://localhost:8080](http://localhost:8080)

Archivos relevantes:
- `Dockerfile`
- `nginx.conf`
- `.dockerignore`

## Internacionalización (i18n)

- Español e inglés listos de fábrica.
- Archivos de traducción en `public/locales/`.

## Contribuir

Las contribuciones son bienvenidas. Abre un issue para discutir cambios mayores y envía un Pull Request con una descripción clara.

## Créditos

- Este es un proyecto educativo.
- Contribución al proyecto: Ing. Israel J. Gomez, Mgtr.
- Estudiantes del 3 Nivel Paralelo C Asignatura Estructura de Datos & Docente.
- Facultad de Ciencias de la Vida y Tecnologías - ULEAM.

## Licencia

MIT. Ver [LICENSE](LICENSE).
