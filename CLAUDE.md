# 🧠 Portfolio Daniel Castañeda — CLAUDE.md

## Identidad del proyecto

**Proyecto:** Portfolio web profesional para Daniel Alejandro Castañeda Suárez  
**Stack:** Angular 17+ · Tailwind CSS v3 · GSAP 3 · TypeScript strict  
**Gerente de paquetes:** `pnpm` — NUNCA usar npm ni yarn  
**Deploy destino:** Vercel  
**Repositorio:** https://github.com/Shiva0616/portfolio

---

## ⚡ Comandos esenciales

```bash
# Desarrollo
pnpm dev                # ng serve (puerto 4200)
pnpm start              # alias de desarrollo equivalente a pnpm dev
pnpm build              # ng build --configuration=production
pnpm test               # ng test --watch=false --browsers=ChromeHeadless
pnpm lint               # ng lint
pnpm format             # prettier --write "src/**/*.{ts,html,scss}"

# Análisis
pnpm analyze            # webpack-bundle-analyzer (requiere build previo)
pnpm lighthouse         # lighthouse http://localhost:4200 --output=json
```

---

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── services/         # gsap.service.ts, scroll.service.ts, theme.service.ts
│   │   └── models/           # project.model.ts, skill.model.ts
│   ├── shared/
│   │   ├── components/       # navbar, cursor, scroll-progress, section-title
│   │   └── directives/       # magnetic.directive.ts, reveal.directive.ts, tilt.directive.ts
│   └── features/
│       ├── hero/             # Hero con Three.js o Spline 3D
│       ├── about/            # Timeline académico
│       ├── skills/           # Tabs con barras animadas
│       ├── projects/         # Grid + modelos 3D por proyecto
│       ├── experience/       # Timeline laboral
│       └── contact/          # Formulario + EmailJS
├── assets/
│   ├── data/                 # projects.json, skills.json, timeline.json
│   ├── models/               # GLB/GLTF locales
│   └── icons/                # SVGs de tecnologías
└── styles/
    ├── _typography.scss
    ├── _animations.scss
    └── styles.scss
```

---

## 🎨 Convenciones de código

### TypeScript

- **Strict mode activado** — nunca usar `any`, usar `unknown` si es necesario
- **Standalone components** — no NgModules tradicionales
- **Angular Signals** para estado reactivo: `signal<T>()`, `computed()`, `effect()`
- **Interfaces** sobre `type` para modelos de datos
- Naming: `PascalCase` para clases/interfaces, `camelCase` para variables, `kebab-case` para archivos

### Angular

- Todos los componentes son `standalone: true`
- Usar `inject()` en lugar de constructor injection
- `@Input()` con `required: true` cuando aplique
- Lazy loading de rutas con `loadComponent`
- Siempre limpiar subscripciones con `takeUntilDestroyed()`

### GSAP

- **Siempre registrar plugins** en `main.ts`: `gsap.registerPlugin(ScrollTrigger, Flip, TextPlugin)`
- **Limpiar en `ngOnDestroy`**: `ScrollTrigger.getAll().forEach(t => t.kill())`
- `gsap.context()` para aislar animaciones por componente
- Verificar `isPlatformBrowser()` antes de cualquier GSAP/DOM call

### Tailwind

- Usar clases de utilidad nativas — no crear clases CSS arbitrarias
- Variantes custom en `tailwind.config.ts`, no en el HTML
- `@apply` solo en `_typography.scss` para elementos de texto comunes

### SCSS

- Variables de diseño en CSS custom properties (`--color-accent`, `--font-display`)
- No duplicar variables entre Tailwind y CSS — Tailwind config es la fuente de verdad
- BEM solo para componentes que no usen Tailwind

---

## 🤖 Agentes disponibles (ver `.claude/agents/`)

| Agente                | Cuándo invocarlo                                       |
| --------------------- | ------------------------------------------------------ |
| `angular-architect`   | Diseñar estructura de componentes, servicios, patrones |
| `gsap-animator`       | Crear o revisar animaciones GSAP, ScrollTrigger, Flip  |
| `ux-reviewer`         | Revisar UX, accesibilidad, flujo de usuario            |
| `performance-auditor` | Analizar bundle, Lighthouse, optimizaciones            |
| `git-workflow`        | Commits semánticos, PR descriptions, changelog         |

---

## ⚡ Skills disponibles (ver `.claude/skills/`)

| Skill                   | Trigger automático                            |
| ----------------------- | --------------------------------------------- |
| `angular-expert`        | Cuando se crea/modifica un componente Angular |
| `gsap-animator`         | Cuando se trabaja con animaciones o GSAP      |
| `accessibility-auditor` | Antes de hacer commit de HTML/templates       |
| `performance-optimizer` | Cuando se analiza bundle o Lighthouse         |
| `component-generator`   | Cuando se pide crear un nuevo componente      |

---

## 🔒 Reglas de seguridad

- **NUNCA** commitear `.env` ni archivos con API keys
- **NUNCA** usar `innerHTML` directamente — usar `DomSanitizer` de Angular
- **NUNCA** modificar la rama `main` directamente — siempre feature branch
- Las keys de EmailJS van en `environment.ts` (gitignoreado en producción)
- No usar `eval()` ni `Function()` constructor

---

## ✅ Checklist antes de cada commit

1. `pnpm lint` sin errores
2. `pnpm format` ejecutado
3. No hay `console.log` en producción (solo `console.warn/error`)
4. Imágenes con `alt` descriptivo
5. Animaciones con `@media (prefers-reduced-motion: reduce)` fallback
6. Formularios con validación reactiva y mensajes de error

---

## 📋 Contexto del propietario

**Daniel Alejandro Castañeda Suárez**  
Rol: Full Stack Developer | Ingeniero Electrónico  
Contacto: danysuarez0616@gmail.com | +57 301 388 4905  
GitHub: https://github.com/Shiva0616  
LinkedIn: https://bit.ly/4nFZ1mn  
Ciudad: Medellín, Antioquia, Colombia

Stack principal: Angular, React, Node.js, Java, Spring Boot, MySQL  
Diferencial: IoT con ESP32, PLC Siemens, PCB Design, Automatización
