---
name: component-generator
description: Genera componentes Angular completos y consistentes para el portfolio. Se activa cuando el usuario pide crear un nuevo componente, sección, o card del portfolio.
allowed-tools: Read, Bash, Glob
version: 1.0.0
---

# Skill: Component Generator — Portfolio Daniel Castañeda

Cuando genero un componente para este portfolio, siempre sigo esta estructura exacta:

## Paso 1: Generar con Angular CLI

```bash
# Siempre con pnpm y standalone
pnpm exec ng generate component features/[nombre] \
  --standalone \
  --change-detection=OnPush \
  --style=scss \
  --skip-tests=false
```

## Paso 2: Template del componente TypeScript

```typescript
import { Component, inject, signal, computed,
         AfterViewInit, OnDestroy, ElementRef, ViewChild,
         ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-[nombre]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './[nombre].component.html',
  styleUrl: './[nombre].component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class [Nombre]Component implements AfterViewInit, OnDestroy {
  @ViewChild('sectionRef') sectionRef!: ElementRef;
  
  private platformId = inject(PLATFORM_ID);
  private gsapCtx!: gsap.Context;
  
  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    this.gsapCtx = gsap.context(() => {
      this.initAnimations();
    }, this.sectionRef);
  }
  
  private initAnimations(): void {
    gsap.from('[data-reveal]', {
      opacity: 0, y: 30, stagger: 0.08, duration: 0.7, ease: 'power3.out',
      scrollTrigger: {
        trigger: this.sectionRef.nativeElement,
        start: 'top 80%', once: true
      }
    });
  }
  
  ngOnDestroy(): void {
    this.gsapCtx?.revert();
  }
}
```

## Paso 3: Template HTML base

```html
<section
  id="[nombre]"
  #sectionRef
  class="py-28 relative z-10"
  aria-label="[Descripción semántica de la sección]"
>
  <div class="container mx-auto px-8 max-w-5xl">
    
    <!-- Section header -->
    <div class="mb-14">
      <p class="section-label" data-reveal>Label</p>
      <h2 class="section-title" data-reveal>[Título de la sección]</h2>
      <p class="section-subtitle" data-reveal>[Subtítulo opcional]</p>
    </div>
    
    <!-- Content -->
    <div data-reveal>
      <!-- Contenido principal aquí -->
    </div>
    
  </div>
</section>
```

## Paso 4: SCSS base

```scss
:host {
  display: block;
}

// Usar CSS custom properties del design system
// NO hardcodear colores — usar variables de tailwind.config.ts

// Animaciones específicas del componente
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Patrones de cards del portfolio

### Project Card
```html
<article
  class="project-card"
  [attr.data-category]="project.category"
  role="article"
>
  <div class="project-card__header">
    <span class="project-card__cat">{{ project.category }}</span>
    <a [href]="project.githubUrl" target="_blank" 
       rel="noopener noreferrer"
       aria-label="Ver {{ project.title }} en GitHub">
      <!-- GitHub icon -->
    </a>
  </div>
  <h3 class="project-card__title">{{ project.title }}</h3>
  <p class="project-card__desc">{{ project.description }}</p>
  <div class="project-card__stack">
    <span *ngFor="let tech of project.stack" class="stack-chip">{{ tech }}</span>
  </div>
</article>
```

### Skill Card
```html
<div class="skill-card" role="listitem">
  <span class="skill-card__icon" aria-hidden="true">{{ skill.icon }}</span>
  <span class="skill-card__name">{{ skill.name }}</span>
  <span class="skill-card__level">{{ skill.level }}</span>
  <div 
    class="skill-bar"
    role="progressbar" 
    [attr.aria-valuenow]="skill.percentage"
    aria-valuemin="0" aria-valuemax="100"
    [attr.aria-label]="skill.name + ': ' + skill.percentage + '%'"
  >
    <div 
      class="skill-bar__fill"
      [attr.data-level]="skill.percentage / 100"
    ></div>
  </div>
</div>
```
