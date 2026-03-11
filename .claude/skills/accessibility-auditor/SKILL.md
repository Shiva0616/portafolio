---
name: accessibility-auditor
description: Audita accesibilidad WCAG 2.1 AA. Se activa automáticamente antes de commits con HTML, cuando el usuario menciona accesibilidad, a11y, screen reader, o cuando revisa templates Angular.
allowed-tools: Read, Grep, Glob, Bash
version: 1.0.0
---

# Skill: Accessibility Auditor — Portfolio Daniel Castañeda

Audiencia del portfolio: reclutadores con distintas capacidades. WCAG 2.1 AA es el estándar mínimo.

## Verificaciones rápidas (ejecuto siempre)

```bash
# Buscar imágenes sin alt
grep -rn "<img" src/ | grep -v 'alt='

# Buscar inputs sin label
grep -rn "<input" src/ | grep -v 'aria-label\|id='

# Buscar botones sin texto accesible
grep -rn "<button" src/ | grep -v 'aria-label\|aria-labelledby'

# Buscar divs con click handlers (debería ser button/a)
grep -rn "(click)" src/ | grep "div\|span"
```

## Patrones correctos para el portfolio

### Navbar accesible
```html
<nav role="navigation" aria-label="Navegación principal">
  <ul role="list">
    <li>
      <a href="#about" 
         [class.active]="activeSection() === 'about'"
         [attr.aria-current]="activeSection() === 'about' ? 'page' : null">
        Sobre mí
      </a>
    </li>
  </ul>
  <button 
    class="nav-toggle"
    [attr.aria-expanded]="mobileMenuOpen()"
    aria-controls="mobile-menu"
    aria-label="Abrir menú de navegación"
  >
    <span aria-hidden="true"></span>
  </button>
</nav>

<!-- Skip link - PRIMERO en el body -->
<a href="#main-content" class="skip-link">
  Saltar al contenido principal
</a>
```

```scss
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--accent);
  color: var(--bg);
  padding: 8px 16px;
  z-index: 10000;
  
  &:focus {
    top: 0; // Visible cuando se enfoca con Tab
  }
}
```

### Formulario de contacto accesible
```html
<form (ngSubmit)="onSubmit()" novalidate>
  <div class="form-group">
    <label for="name" class="form-label">
      Nombre <span aria-label="requerido">*</span>
    </label>
    <input
      id="name"
      type="text"
      [formControl]="nameControl"
      [attr.aria-invalid]="nameControl.invalid && nameControl.touched"
      [attr.aria-describedby]="nameControl.invalid ? 'name-error' : null"
      autocomplete="name"
      required
    />
    <span 
      id="name-error" 
      role="alert"
      *ngIf="nameControl.invalid && nameControl.touched"
      class="form-error"
    >
      {{ getNameError() }}
    </span>
  </div>
</form>
```

### Proyectos — filtros accesibles
```html
<div role="group" aria-label="Filtrar proyectos por categoría">
  <button
    *ngFor="let filter of filters"
    [class.active]="activeFilter() === filter.value"
    [attr.aria-pressed]="activeFilter() === filter.value"
    (click)="setFilter(filter.value)"
  >
    {{ filter.label }}
  </button>
</div>

<div 
  id="projects-grid"
  aria-live="polite"
  aria-label="Proyectos filtrados"
>
  <!-- Las cards se actualizan aquí -->
</div>
```

### Modelos 3D accesibles
```html
<!-- Sketchfab embed con fallback -->
<div class="model-viewer" [attr.aria-label]="model.alt">
  @if (modelLoaded()) {
    <iframe
      [src]="safeModelUrl"
      [title]="model.alt"
      loading="lazy"
      allow="fullscreen"
    ></iframe>
  } @else {
    <!-- Skeleton o imagen estática de fallback -->
    <div class="model-skeleton" aria-busy="true" aria-label="Cargando modelo 3D"></div>
  }
</div>
```

## Focus management

```typescript
// Después de abrir/cerrar modal o menu
@ViewChild('firstFocusableElement') firstEl!: ElementRef;

openMenu(): void {
  this.menuOpen.set(true);
  // Mover focus al primer elemento del menu
  setTimeout(() => this.firstEl.nativeElement.focus(), 100);
}

closeMenu(): void {
  this.menuOpen.set(false);
  // Devolver focus al botón que abrió el menu
  this.toggleBtn.nativeElement.focus();
}

// Trap focus dentro del modal/menu
@HostListener('keydown', ['$event'])
handleKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape') this.closeMenu();
  if (e.key === 'Tab') {
    // Implementar focus trap
  }
}
```
