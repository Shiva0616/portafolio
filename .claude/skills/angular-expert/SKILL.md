---
name: angular-expert
description: Guía de patrones Angular 17+ para el portfolio. Se activa automáticamente cuando se crea o modifica un componente Angular, servicio, directiva o cuando el usuario menciona Angular, componente, standalone, signals.
allowed-tools: Read, Grep, Glob, Bash
version: 1.0.0
---

# Skill: Angular Expert — Portfolio Daniel Castañeda

## Patrones obligatorios en este proyecto

### Componente standalone completo
```typescript
import { Component, inject, signal, computed, effect, 
         OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { gsap } from 'gsap';

@Component({
  selector: 'app-[feature]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './[feature].component.html',
  styleUrl: './[feature].component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush // ← Siempre
})
export class [Feature]Component implements AfterViewInit, OnDestroy {
  @ViewChild('container') container!: ElementRef;
  
  private platformId = inject(PLATFORM_ID);
  private gsapCtx!: gsap.Context;
  
  // Signals para estado
  isAnimated = signal(false);
  activeTab = signal<string>('all');
  
  // Computed derivado
  filteredItems = computed(() => {
    const tab = this.activeTab();
    return tab === 'all' ? this.items : this.items.filter(i => i.category === tab);
  });
  
  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return; // SSG safe
    
    this.gsapCtx = gsap.context(() => {
      // Animaciones aquí
    }, this.container);
  }
  
  ngOnDestroy(): void {
    this.gsapCtx?.revert(); // Cleanup GSAP
  }
}
```

### Service patrón
```typescript
@Injectable({ providedIn: 'root' })
export class PortfolioDataService {
  private http = inject(HttpClient);
  
  // Cache con signal
  private _projects = signal<Project[]>([]);
  projects = this._projects.asReadonly();
  
  loadProjects(): Observable<Project[]> {
    return this.http.get<Project[]>('assets/data/projects.json').pipe(
      tap(data => this._projects.set(data))
    );
  }
}
```

### Directiva de reveal (usada en TODO el portfolio)
```typescript
@Directive({ selector: '[appReveal]', standalone: true })
export class RevealDirective implements AfterViewInit {
  @Input() revealDelay = 0;
  @Input() revealDirection: 'up' | 'left' | 'right' = 'up';
  
  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);
  
  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const fromVars = {
      up:    { opacity: 0, y: 40 },
      left:  { opacity: 0, x: -40 },
      right: { opacity: 0, x: 40 },
    }[this.revealDirection];
    
    gsap.from(this.el.nativeElement, {
      ...fromVars,
      duration: 0.7,
      delay: this.revealDelay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: this.el.nativeElement,
        start: 'top 85%',
        once: true,
      },
    });
  }
}
```

## Estructura de archivo por tipo

```
features/hero/
├── hero.component.ts       ← lógica
├── hero.component.html     ← template
├── hero.component.scss     ← estilos scoped
└── hero.component.spec.ts  ← tests

core/services/
└── gsap.service.ts         ← wrapper de GSAP

core/models/
├── project.model.ts        ← interfaces
└── skill.model.ts
```

## Interfaces del portfolio

```typescript
// project.model.ts
export interface Project {
  id: number;
  title: string;
  category: 'web' | 'iot' | 'hardware' | 'automation';
  description: string;
  problem: string;
  stack: string[];
  githubUrl?: string;
  demoUrl?: string;
  model3d?: Model3DConfig;
}

export interface Model3DConfig {
  type: 'sketchfab' | 'spline' | 'gltf' | 'three';
  src?: string;
  component?: string;
  alt: string;
}

// skill.model.ts
export interface Skill {
  name: string;
  icon: string;
  level: 'Basic' | 'Intermediate' | 'Advanced';
  percentage: number; // 0-100
  category: 'frontend' | 'backend' | 'tools' | 'iot';
}
```
