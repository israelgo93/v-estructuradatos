# Estado Actual del Proyecto - EstructuraDatos.org

Fecha: 21 de Enero de 2026

## Cambios Realizados

### 1. Internacionalización (i18n) - COMPLETADA

- Se implementó `i18next` con soporte completo para **Español** e **Inglés**.
- Se agregaron archivos de traducción expandidos en `public/locales/`.
- La inicialización de i18n ahora carga recursos locales para evitar mismatches de hidratación.
- Se incluyó un selector de idioma (`LanguageToggle`) en el encabezado y en la landing page.
- **Todos los componentes de controles** ahora usan el sistema de traducción:
  - Stack Controls, Queue Controls, Binary Tree Controls
  - Linked List Controls, Heap Controls, AVL Tree Controls
  - Dijkstra Controls
- **Todos los componentes de análisis** traducidos:
  - Binary Tree Analysis, AVL Tree Analysis, Dijkstra Analysis
- **Análisis de Heap** añadido en la pestaña de análisis.
- **Sistema de feedback** con soporte bilingüe:
  - Cada paso muestra título y descripción en el idioma seleccionado
  - Explicaciones de complejidad traducidas
- **Pestañas de Explicación** interactivas con contenido bilingüe:
  - Conceptos, casos de uso, comparativas y quizzes en ambos idiomas
- Estados vacíos y etiquetas 3D (TOP, HEAD, TAIL, FRONT, REAR) traducidos.

### 2. Visualización 3D (Three.js)

- Se integró `Three.js` mediante `@react-three/fiber` y `@react-three/drei`.
- Se utiliza `@react-spring/three` para animaciones 3D suaves.
- Se creó un componente base `BaseScene3D` para estandarizar las escenas 3D.
- Se implementaron importaciones dinámicas (`dynamic import` con `ssr: false`) para evitar problemas de SSR.
- **Escalado Dinámico y Auto-framing (Stack)**: Se implementó un sistema de visualización adaptativa para la Pila:
  - Los bloques se redimensionan automáticamente (más delgados) cuando la pila es grande para mantener la visibilidad.
  - La cámara se ajusta dinámicamente para encuadrar todo el stack independientemente de su tamaño.
  - Los textos y etiquetas (TOP, índices) se adaptan proporcionalmente al tamaño de los bloques.
  - El stack se centra verticalmente en la escena para optimizar el espacio visual.
- Se migraron los siguientes visualizadores a 3D:
  - **Pilas (Stack)**: Elementos representados como bloques 3D apilables.
  - **Colas (Queue)**: Bloques 3D en una pista horizontal.
  - **Listas Enlazadas (Linked List)**: Nodos esféricos con conexiones tubulares.
  - **Árboles (BST, AVL, Heap)**: Estructuras jerárquicas con nodos esféricos y enlaces 3D.
  - **Algoritmo de Dijkstra**: Grafo interactivo en 3D con resaltado de caminos.

### 3. Interacción con Mouse Mejorada

- **Click izquierdo**: Arrastrar/mover el lienzo (pan) - como una mano
- **Click derecho**: Rotar la vista 3D
- **Rueda del mouse**: Zoom in/out
- **Pantallas táctiles**: Un dedo para mover, dos dedos para zoom y rotar
- Cursor visual cambia a "grab" para indicar la funcionalidad de arrastre

### 4. Ejemplos de Código en Python

- Los ejemplos de código en las explicaciones interactivas usan **Python** para mayor claridad.
- Código más legible y moderno para estudiantes.
- Ejemplos incluyen:
  - Operaciones de Stack (push, pop, peek)
  - Operaciones de Queue (enqueue, dequeue)
  - Operaciones de BST (insert, traversals)
  - Operaciones de AVL (rotaciones, balance)
  - Operaciones de Linked List (insert, delete)
  - Operaciones de Heap (heapify, array representation)
  - Algoritmo de Dijkstra (relajación, implementación completa)

### 5. Visión por Computador (MediaPipe)

- Se desarrolló una nueva aplicación: **Aprendizaje con Visión Artificial**.
- Utiliza `@mediapipe/tasks-vision` para detectar gestos de la mano.
- **Funcionalidad**: El usuario puede interactuar con una Pila (Stack) mediante gestos:
  - Mano abierta (4-5 dedos extendidos): Operación **PUSH**.
  - Puño cerrado (4-5 dedos cerrados): Operación **POP**.

#### Mejoras en la Detección de Gestos (v2)

- **Algoritmo de Distancia Euclidiana**: Se reemplazó la lógica simplista de comparación de coordenadas Y por un algoritmo basado en distancias euclidianas desde la muñeca. Esto permite detectar gestos independientemente de la orientación de la mano.
- **Optimización del Bucle de Detección**:
  - Implementación de `performance.now()` para una marca de tiempo más precisa requerida por MediaPipe.
  - Verificación de `video.currentTime` para evitar el procesamiento redundante de frames ya analizados.
  - Gestión reactiva del bucle mediante `useEffect`, eliminando problemas de closures y disparadores manuales inconsistentes.
- **Funciones de Detección**:
  - `euclideanDistance()`: Calcula distancia 3D entre dos landmarks.
  - `isFingerExtended()`: Determina si un dedo está extendido comparando distancias tip-wrist vs pip-wrist.
  - `isThumbExtended()`: Lógica especial para el pulgar debido a su geometría diferente.
- **Fallback GPU/CPU**: La inicialización de MediaPipe intenta primero usar delegado GPU, con fallback automático a CPU si falla.
- **Feedback Visual Mejorado**:
  - Esqueleto de la mano dibujado en tiempo real con colores según el gesto.
  - Sincronización dinámica de las dimensiones del canvas con el video.
  - Indicador de debug mostrando el número de dedos detectados.
  - Manejo de errores visual si MediaPipe o la cámara fallan.

### 6. Landing Page Actualizada

- Todos los textos de la landing page están traducidos a español e inglés.
- Se agregó el botón de selección de idioma en el Navbar.
- Se actualizó la lista de Features para mostrar solo las estructuras disponibles:
  - Stack, Queue, Linked List, BST, AVL, Heap
  - Message Queue, Polynomial Multiplication, Dijkstra, Computer Vision
- Se actualizó la sección de Tech Stack con versiones actuales y descripción real del proyecto.

### 7. Nueva Landing Organizacional

- Se creó una landing principal para **EstructuraDatos.org** con estilo tecnológico y minimalista.
- Incluye secciones de misión, open source, proyectos y comunidad.
- El visualizador ahora tiene su landing informativa en `/visualizador-es`.
- La aplicación interactiva se mantiene en `/visualizer`.
- El Navbar adapta el menú según la ruta (organizacional vs. visualizador).
- Branding y enlaces internos actualizados para el nuevo repositorio `estructuradatos.org`.

### 8. Limpieza y Simplificación

- Se eliminaron las estructuras y aplicaciones no solicitadas:
  - Huffman Coding
  - Conversión de Infijo a Postfijo
- Se eliminó el archivo `lib/stack-operations.ts` que dependía de código eliminado.

### 9. Correcciones Técnicas

- Se reemplazó `framer-motion-3d` (no existente) por `@react-spring/three`.
- Se implementaron importaciones dinámicas para componentes 3D evitando errores de SSR.
- Se optimizó el renderizado de la landing page para carga del lado del cliente.
- Se corrigió un mismatch de hidratación por i18n al cargar traducciones locales.

### 10. Responsividad y UX en Visualizadores (UI/UX)

- Se reordenaron los paneles para priorizar la visualización 3D en móviles.
- Tabs con scroll horizontal para evitar cortes en pantallas pequeñas.
- Ajustes de layout en Message Queue para evitar desbordes y mejorar lectura.
- Contenedores de explicaciones con mejor wrapping y códigos con scroll horizontal.
- Alturas mínimas de escenas 3D ajustadas para móviles sin perder interacción.

### 11. i18n - Placeholders corregidos

- Se normalizaron placeholders a `{{variable}}` en ES/EN para evitar valores sin interpolar.
- Ejemplos corregidos: `{count}`, `{index}`, `{value}`, `{size}`, `{from}`, `{to}`.

### 12. Docker y Cloud Run

- Se creó `Dockerfile` orientado a despliegue en Cloud Run usando export estático.
- Se agregó `nginx.conf` para servir `out/` en el puerto 8080.
- Se añadió `.dockerignore` para reducir tamaño de build.

### 13. Nuevo Proyecto Open Source: Pac-Man Data Lab

- Se añadió el directorio `pacman-es/` como proyecto open source dentro del repositorio.
- Se integró acceso desde la landing organizacional mediante `/pacman-es`.
- El juego incluye animación y panel educativo con estructuras de datos (matrices 2D, colas/BFS, grafos y máquina de estados).

### 14. Rediseño Visual y Educativo Completo de Pac-Man Data Lab

- **Mejoras Visuales del Laberinto**:
  - Paredes con efecto neón azul brillante y gradientes internos.
  - Pellets amarillos con animación de glow pulsante claramente visibles.
  - Power pellets con animación de escala y brillo intenso.
  - Grid de fondo sutil para definir el espacio de juego.
  - Bordes del laberinto con sombra y efecto de profundidad.

- **Entidades Mejoradas**:
  - Pac-Man con tamaño mayor (28px tiles), animación de boca fluida y efecto glow.
  - Color cyan dinámico cuando está en modo power.
  - Fantasmas con colores vibrantes (#ff4757, #ff6b9d, #00d2d3, #ffa502).
  - Animación de ondulación en la base de los fantasmas.
  - Ojos asustados y boca ondulada en modo FRIGHTENED.

- **Panel Educativo Dinámico**:
  - **Monitor de Aprendizaje**: Comentarios contextuales basados en eventos del juego.
  - **Estado en Tiempo Real**: Posición `[x, y]`, celda `maze[y][x]`, modo fantasmas (PERSECUCIÓN/ASUSTADOS).
  - **Concepto Destacado**: Explicaciones O(1), BFS, FSM que cambian según la acción.
  - **Grid de Arquitectura Técnica**: Tarjetas explicativas de Matrices 2D, Algoritmo BFS, Pathfinding y Lógica FSM.
  - **Sección "¿Cómo Funciona?"**: Explicaciones detalladas de Matrix, BFS y FSM.

- **Sistema de Comentarios IA Contextuales**:
  - Eventos detectados: pellet comido, power pellet, fantasma cerca, colisión, victoria.
  - Actualización dinámica del concepto activo según el evento.
  - Cursor de typing animado en el monitor de aprendizaje.

- **Parámetros de Juego Optimizados para Aprendizaje**:
  - `TILE_SIZE: 28px` - Tamaño óptimo para visibilidad educativa.
  - `TICK_RATE: 350ms` - Velocidad lenta para observar algoritmos claramente.
  - `POWER_DURATION: 50` - Duración extendida del modo power.

- **Estilos CSS Mejorados** (`globals.css`):
  - Clases `.wall-cell`, `.pellet`, `.power-pellet` con animaciones.
  - `.maze-grid` con background grid y efectos de sombra.
  - `.state-chase`, `.state-frightened` para indicadores de estado.
  - `.concept-active` para resaltar concepto activo.
  - Scrollbar personalizado y animación de cursor typing.

- **Internacionalización Completa (ES/EN)**:
  - Nuevas claves: `liveState`, `position`, `currentCell`, `ghostMode`, `pelletsRemaining`.
  - Comentarios IA: `iaComments.pelletEaten`, `iaComments.powerPellet`, `iaComments.ghostClose`, etc.
  - Conceptos destacados: `conceptMatrix`, `conceptBfs`, `conceptFsm`, `conceptQueue`.
  - Explicaciones: `matrixExplain`, `bfsExplain`, `fsmExplain`, `howItWorks`.

## Estructura de Datos Disponibles

### Estructuras de Datos

- Pila (Stack)
- Cola (Queue)
- Lista Enlazada (Linked List)
- Árbol Binario de Búsqueda (BST)
- Árbol AVL
- Montículo (Heap)

### Aplicaciones

- Cola de Mensajes (Message Queue)
- Multiplicación Polinomial
- Algoritmo de Dijkstra
- Aprendizaje con Visión Artificial

## Archivos de Traducción

Los archivos de traducción se encuentran en:
- `public/locales/es/common.json` - Español
- `public/locales/en/common.json` - Inglés

Incluyen traducciones para:
- Navegación y títulos generales
- Controles de cada estructura de datos
- Mensajes de feedback paso a paso
- Componentes de análisis
- Explicaciones y quizzes educativos
- Landing page

## Versiones Actuales del Stack

- Next.js 15.1.2 + React 19
- TypeScript 5
- Three.js 0.182 / @react-three/fiber 9.5.0 / @react-three/drei 10.7.7
- @react-spring/three 10.0.3 / framer-motion 11.15.0
- @mediapipe/tasks-vision 0.10.22-rc.20250304
- i18next 25.7.4 / react-i18next 16.5.2
- TailwindCSS 3.4.1 / shadcn/ui

## Próximos Pasos Sugeridos

- Agregar más gestos para otras estructuras de datos en la aplicación de visión artificial.
- Validar despliegue en Cloud Run y ajustar cachés si es necesario.
- Optimizar el build para producción (actualmente hay timeouts en SSG).
- Agregar más quizzes y ejercicios interactivos.
