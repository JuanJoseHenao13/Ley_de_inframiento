# Laboratorio Virtual: Ley de Enfriamiento de Newton - Documentación de Desarrollo

Este documento explica el proceso, las herramientas y los modelos matemáticos que se implementaron en la construcción del Simulador Virtual, específicamente para la renderización 3D y los efectos visuales. Ideal para usar como guía en la exposición.

---

## 1. ¿Cómo construimos el entorno 3D?

El objetivo principal fue pasar de un entorno 3D básico a uno con un nivel visual altamente realista y "premium", similar al de simuladores profesionales o videojuegos modernos.

### A. Corrección y Optimización del Entorno
*   **Limpieza de código y Tipado:** Se corrigieron errores iniciales de TypeScript relacionados con las propiedades de los componentes gráficos, asegurando compatibilidad con las versiones más recientes del entorno 3D.
*   **Postprocesamiento (Efectos Cinemáticos):** Se configuró la librería de postprocesamiento para agregar un efecto **Bloom** (resplandor), logrando que los materiales y el color térmico desprendan brillo realístico en pantalla, en lugar de ser colores planos.

### B. Creación de Elementos Visuales
*   **Modelo Realista de la Taza (Porcelana):** Cambiamos los materiales básicos por un `meshPhysicalMaterial`. Esto nos permitió añadir propiedades físicas avanzadas como **Clearcoat** (capa de barniz que simula cerámica pulida) y alta reflectividad.
*   **Pedestal de Exhibición:** Se programó un pedestal cilíndrico tipo mármol utilizando formas primitivas (`cylinderGeometry`) e integrando un anillo de luz brillante en su base inferior para estilizar la escena.
*   **Animación de Fluidos y Vapor:** Se agregaron partículas flotantes y vapor dinámico (`Cloud` y `Sparkles`) que varían su intensidad de manera automática si la temperatura del objeto es muy alta en comparación a su ambiente.

---

## 2. Librerías y Tecnologías Utilizadas

Todo el desarrollo se enmarca dentro del ecosistema de **React** y herramientas para modelado tridimensional en la web.

1.  **Three.js:** El motor 3D subyacente. Permite utilizar el contexto WebGL del navegador para renderizar gráficos complejos.
2.  **@react-three/fiber (R3F):** Es un renderizador de React para Three.js. Nos permite construir la escena 3D utilizando componentes y hooks de React (escribir `<mesh>` o `<group>`), haciendo el código mucho más declarativo e intuitivo.
3.  **@react-three/drei:** Una colección de funciones y abstracciones pre-construidas para R3F. Gracias a ella logramos importar elementos complejos en pocas líneas, tales como:
    *   `Environment` (para iluminación global HDRI).
    *   `OrbitControls` (para la cámara interactiva).
    *   `Cloud` y `Sparkles` (efectos de partículas).
4.  **@react-three/postprocessing:** Encargada del filtrado de la imagen final antes de mostrarla en pantalla (agregando efectos de cámara cinematográficos como el *Bloom* para el calor).
5.  **Zustand:** Un gestor de estados global rápido y minimalista, que sincroniza el tiempo, la temperatura y las variables matemáticas desde los controles de la UI hacia el lienzo 3D.

---

## 3. Modelos y Conceptos Matemáticos Implementados

La simulación no es solo visual; los gráficos y la lógica responden directamente a cálculos matemáticos formales aplicados a cada cuadro de la animación (Frame).

### A. Ley del Enfriamiento de Newton
Es el corazón lógico del simulador. Determina la temperatura del objeto en un tiempo $t$.
*   **Ecuación Diferencial:** $\frac{dT}{dt} = k(T - T_m)$
*   **Solución Analítica (Fórmula implementada):** $T(t) = (T_0 - T_m)e^{kt} + T_m$
    *   *Donde:* $T_0$ es la temperatura inicial, $T_m$ es la temperatura ambiente, $k$ la constante de enfriamiento, y $t$ el tiempo simulado.
*   *Uso visual:* Esta función se usa de manera continua. Según la temperatura que arroje, el simulador interpola colores (de azul a rojo incandescente) y controla la cantidad de "Vapor" o flechas que se deben emitir.

### B. Curvas de Bézier Cuadráticas (Geometría del Calor)
Para generar las flechas de transferencia de calor que se curvan alrededor de la taza, se utilizó matemática geométrica.
*   En lugar de trazar líneas rectas (que serían muy artificiales), usamos curvas de Bézier descritas por **tres puntos vectoriales (3D):**
    1.  **Start (Punto de inicio):** En la base del objeto.
    2.  **Control (Punto de control):** Desplazado hacia el exterior, lo que ejerce la "atracción" para curvar la línea.
    3.  **End (Punto final):** Arriba del objeto donde apunta la flecha.
*   **Interpolación:** El motor dibuja los vértices del tubo de calor guiándose por esta curva matemática logrando el flujo convectivo suave que se eleva.

### C. Trigonometría Analítica y Coordenadas Polares
*   **Distribución circular:** Para ubicar las flechas de transferencia de manera perfecta y simétrica alrededor del objeto de forma paramétrica, usamos el círculo trigonométrico.
    *   Las posiciones $X$ y $Z$ en 3D se calculan con el ángulo ($\theta$):
    *   $X = Radio \times \cos(\theta)$
    *   $Z = Radio \times \sin(\theta)$
    *   El bucle reparte las flechas en fracciones de $\pi$ (ej. $0, \pi/3, 2\pi/3, \pi$, etc.).
*   **Animación de oscilación:** En el ciclo de renderizado (`useFrame`), usamos la función Seno (`Math.sin(t * Math.PI)`) para modificar la escala y altura (Y) de las flechas dependiendo del tiempo, dando ese aspecto "flotante" y rítmico que lo hace ver orgánico.
