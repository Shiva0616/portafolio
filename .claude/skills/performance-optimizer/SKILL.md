---
name: performance-optimizer
description: Optimiza performance del portfolio Angular. Se activa cuando el usuario menciona Lighthouse, bundle, performance, lento, optimize, lazy loading, o cuando analiza el build output.
allowed-tools: Read, Bash, Glob, Grep
version: 1.0.0
---

# Skill: Performance Optimizer — Portfolio Daniel Castañeda

## Lazy loading de módulos pesados (GSAP, Three.js)

```typescript
// gsap.service.ts — carga lazy de plugins
export class GsapService {
  private initialized = false;
  
  async init(): Promise<void> {
    if (this.initialized || !isPlatformBrowser(this.platformId)) return;
    
    const { gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    const { Flip } = await import('gsap/Flip');
    const { TextPlugin } = await import('gsap/TextPlugin');
    
    gsap.registerPlugin(ScrollTrigger, Flip, TextPlugin);
    this.initialized = true;
  }
}
```

```typescript
// hero.component.ts — Three.js solo cuando está en viewport
ngAfterViewInit(): void {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      import('./three-scene').then(({ initScene }) => {
        initScene(this.canvasRef.nativeElement);
      });
      observer.disconnect();
    }
  }, { rootMargin: '200px' });
  
  observer.observe(this.canvasRef.nativeElement);
}
```

## Optimización de imágenes

```html
<!-- Usar ngOptimizedImage de Angular -->
<img
  ngSrc="/assets/images/hero-bg.webp"
  width="1200"
  height="800"
  priority        <!-- ← Para above-the-fold -->
  alt="Fondo tecnológico abstracto"
/>

<!-- Below the fold -->
<img
  ngSrc="/assets/images/project-card.webp"
  width="400"
  height="300"
  loading="lazy"
  alt="Vista del proyecto {{ project.title }}"
/>
```

## Angular OnPush + trackBy

```typescript
// ChangeDetectionStrategy.OnPush en TODOS los componentes
// Evita re-renders innecesarios

// trackBy en ngFor
trackByProjectId(index: number, project: Project): number {
  return project.id;
}
```

```html
<div *ngFor="let project of projects(); trackBy: trackByProjectId">
```

## Bundle size — configuración en angular.json

```json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "500kb",
      "maximumError": "1mb"
    },
    {
      "type": "anyComponentStyle",
      "maximumWarning": "4kb",
      "maximumError": "8kb"
    }
  ]
}
```

## Skeleton loaders para modelos 3D

```scss
.model-skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-card) 25%,
    var(--bg-border) 50%,
    var(--bg-card) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
  border-radius: var(--radius);
  min-height: 200px;
}

@keyframes skeleton-shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .model-skeleton { animation: none; }
}
```

## Preload de fuentes críticas

```html
<!-- index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link 
  rel="preload" 
  href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap"
  as="style"
  onload="this.onload=null;this.rel='stylesheet'"
>
```

## Comandos de análisis rápido

```bash
# Ver tamaño de chunks
pnpm build 2>&1 | grep -E "chunk|Initial|Lazy" | sort -k2 -rh

# Lighthouse headless
npx lighthouse http://localhost:4200 \
  --only-categories=performance,accessibility,seo \
  --chrome-flags="--headless --no-sandbox"

# Verificar tree-shaking de GSAP
npx webpack-bundle-analyzer dist/portfolio/browser/stats.json
```
