---
name: gsap-animator
description: Patrones y recetas de animación GSAP para el portfolio. Se activa automáticamente cuando el usuario menciona animación, GSAP, ScrollTrigger, transición, efecto, o cuando se trabaja en archivos gsap.service.ts o componentes con animaciones.
allowed-tools: Read, Grep, Glob
version: 1.0.0
---

# Skill: GSAP Animator — Portfolio Daniel Castañeda

## Regla #1: Siempre limpiar con gsap.context()

```typescript
private gsapCtx!: gsap.Context;

ngAfterViewInit(): void {
  this.gsapCtx = gsap.context(() => {
    // TODAS las animaciones dentro de aquí
  }, this.containerRef); // Scope al componente
}

ngOnDestroy(): void {
  this.gsapCtx?.revert(); // Revierte y limpia todo automáticamente
}
```

## Recetas listas para usar

### Hero — entrada orquestada
```typescript
gsap.timeline({ defaults: { ease: 'power3.out' } })
  .from('.hero-name .char',  { opacity:0, y:60, rotateX:-90, stagger:0.04, duration:0.6 })
  .from('.hero-role',        { opacity:0, x:-24, duration:0.5 }, '-=0.3')
  .from('.hero-badge',       { opacity:0, scale:0.8, duration:0.4 }, '-=0.4')
  .from('.hero-cta > *',     { opacity:0, y:16, stagger:0.1, duration:0.4 }, '-=0.2')
  .from('.hero-terminal',    { opacity:0, scale:0.94, x:30, duration:0.9 }, 0.3);
```

### Skills — barras de progreso
```typescript
bars.forEach((bar, i) => {
  const level = parseFloat(bar.dataset['level'] ?? '0.7');
  gsap.fromTo(bar,
    { scaleX: 0 },
    {
      scaleX: level, transformOrigin: 'left',
      duration: 1.2, ease: 'power2.out', delay: i * 0.06,
      scrollTrigger: { trigger: bar, start: 'top 90%', once: true }
    }
  );
});
```

### Proyectos — filtro con Flip
```typescript
import { Flip } from 'gsap/Flip';

applyFilter(category: string): void {
  const cards = document.querySelectorAll('.project-card');
  const state = Flip.getState(cards);
  
  cards.forEach(card => {
    const show = category === 'all' || card.dataset['category']?.includes(category);
    (card as HTMLElement).style.display = show ? 'flex' : 'none';
  });
  
  Flip.from(state, {
    duration: 0.5, ease: 'power2.inOut', absolute: true, stagger: 0.04,
    onEnter: els => gsap.from(els, { opacity:0, scale:0.85, duration:0.35 }),
    onLeave: els => gsap.to(els,   { opacity:0, scale:0.85, duration:0.25 })
  });
}
```

### Navbar — shrink en scroll
```typescript
ScrollTrigger.create({
  start: 'top -80', end: 99999,
  onUpdate: (self) => {
    gsap.to('.navbar', {
      paddingTop:    self.isActive ? '12px' : '20px',
      paddingBottom: self.isActive ? '12px' : '20px',
      backdropFilter: self.isActive ? 'blur(20px)' : 'blur(0px)',
      duration: 0.3, ease: 'power2.out'
    });
  }
});
```

### Cursor custom — lag suave
```typescript
let rx = 0, ry = 0;
const ring = document.getElementById('cursor-ring')!;

document.addEventListener('mousemove', ({ clientX: mx, clientY: my }) => {
  gsap.set('#cursor-dot', { x: mx, y: my });     // Instantáneo
  
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const tick = () => {
    rx = lerp(rx, mx, 0.12);
    ry = lerp(ry, my, 0.12);
    gsap.set(ring, { x: rx, y: ry });
    requestAnimationFrame(tick);
  };
  tick();
});
```

## Easing recomendados por situación

| Situación | Easing |
|-----------|--------|
| Entrada suave | `power3.out` |
| Botones/hover | `power2.out` |
| Rebote magnético | `elastic.out(1, 0.4)` |
| Aparición de cards | `back.out(1.2)` |
| Scroll progress | `none` |
| Barras de skills | `power2.out` |
| Flip de filtros | `power2.inOut` |
