# Dead Pixels — plan de implementación y diseño

## Alcance
Dead Pixels será un launcher de escritorio/web de estética retro, glitch y arcade para centralizar una biblioteca demostrativa de Steam y Epic Games, con estructura lista para añadir Microsoft/Xbox. La primera versión se enfoca en la experiencia navegable: Biblioteca, Tienda, Ofertas, comparativa de precios, búsqueda, filtros, estados de instalación/ejecución y acciones delegadas a clientes oficiales. Los datos mostrados serán de demostración y estarán identificados como tales; no habrá compra simulada ni almacenamiento de contraseñas.

## Implementación
- React + TypeScript + Tailwind sobre el starter web-db-user existente.
- Estado local para navegación, búsqueda, filtros, favoritos, alertas y estados demostrativos de juegos.
- Datos tipados en `client/src/data/games.ts`, separados de la UI para facilitar futuros adaptadores oficiales.
- Componentes visuales especializados en `client/src/components/dead-pixels/` para tarjetas, comparativa y elementos de marca.
- La UI usará `/manus-storage/...` para el logo completo y un recorte del icono TV/calavera suministrado por el usuario.
- Futuras integraciones deberán implementarse detrás de adaptadores por plataforma y APIs autorizadas; la UI actual no asume acceso a credenciales.
- `public/manus-routes.json` declarará las rutas actuales del SPA.

## Diseño

### Direcciones consideradas
- **Industrial CRT / arcade clandestino** — 0.06: negro carbón, rojo alarma y detalles de monitor antiguo.
- **Neon cyberpunk** — 0.04: superficies oscuras con múltiples colores neón.
- **Editorial brutalista** — 0.08: tipografía grande y bloques de alto contraste.

Se elige **Industrial CRT / arcade clandestino**.

### Movement y principios
La interfaz se inspira en dashboards de hardware arcade, menús de survival horror y monitores CRT: precisa, tensa y utilitaria. Los principios son jerarquía lateral clara, contraste alto, acentos rojos con intención, y superficies con grano/glitch muy sutil sin sacrificar legibilidad.

### Filosofía de color
El negro carbón (`#0a0a0b`) funciona como cabina y deja que el rojo sangre (`#f04444`) sea la señal activa: navegación, estados y CTA. Grises verdosos y blancos rotos evocan vidrio de monitor, mientras que el rojo intenso se reserva para interacción y urgencia.

### Paradigma de layout
Shell de dos columnas: rail lateral fijo tipo consola y lienzo de contenido con cabecera de telemetría. La biblioteca usa una composición asimétrica con hero de juego y panel de actividad; las tarjetas aparecen como módulos tácticos, no como una cuadrícula decorativa centrada.

### Elementos distintivos
1. TV con calavera pixel art como insignia y avatar de marca.
2. Etiquetas de plataforma en formato de placa técnica y microcopy de terminal.
3. Líneas de escaneo, ruido CRT y cortes angulares rojos en paneles clave.

### Interacción y animación
Las acciones importantes responden con un pulso rojo breve y desplazamiento de 1–2 px. Los paneles se revelan con una transición corta y sobria; los estados `En ejecución` usan un brillo rojo suave y un punto pulsante. No se usan animaciones permanentes intensas.

### Tipografía
`Space Grotesk` para títulos y navegación, `IBM Plex Mono` para metadatos, etiquetas y precios. Los títulos se escriben en frases cortas, compactas y con peso alto; los datos secundarios usan mayúsculas espaciadas.

### Esencia de marca
**Dead Pixels: tu señal única para todos tus juegos.** Personalidad: cruda, ingeniosa, obsesiva.

### Voz
Los titulares son directos y con actitud: “Tu biblioteca. Una sola señal.” y “Caza la próxima oferta.” Las acciones hablan como un launcher de culto: “Jugar ahora”, “Ver precios”, “Activar alerta”.

### Wordmark e icono
El wordmark reutiliza el logo suministrado como arte principal. El icono del producto es la TV con calavera recortada del mismo logo, contenida en un marco rojo oscuro con halo CRT.

### Color propietario
Rojo señal Dead Pixels: `#f04444`.

## Estructura de proyecto
- `client/src/App.tsx`: shell del launcher, navegación y estados de interacción.
- `client/src/data/games.ts`: catálogo tipado, plataformas, ofertas y comparativas demo.
- `client/src/index.css`: tokens de color, tipografía, textura CRT y estilos base.
- `client/src/components/dead-pixels/`: piezas de UI reutilizables.
- `client/public/manus-routes.json`: manifiesto de rutas del SPA.
- `drizzle/` y `server/`: infraestructura preparada para cuentas y persistencia futuras.
