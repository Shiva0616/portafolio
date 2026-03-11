# /audit

Ejecuta una auditoría completa del portfolio de Daniel Castañeda cubriendo: accesibilidad, performance, código y UX.

**Argumentos:** `$ARGUMENTS` — sección a auditar (opcional: `hero`, `projects`, `contact`, o vacío para todo)

## Pasos de auditoría

### 1. Análisis de código
- Lee todos los archivos `.ts` en `src/app/features/$ARGUMENTS/` (o todo si no hay argumento)
- Verifica que use `ChangeDetectionStrategy.OnPush`
- Verifica que GSAP tenga cleanup en `ngOnDestroy`
- Verifica que no haya `any` en TypeScript
- Busca `console.log` que no deberían estar en producción

### 2. Accesibilidad (usa el skill accessibility-auditor)
Ejecuta:
```bash
grep -rn "<img" src/app/features/ | grep -v 'alt='
grep -rn "<button" src/app/features/ | grep -v 'aria-label\|aria-labelledby\|[a-z]>'
grep -rn "(click)" src/app/features/ | grep "div\|span"
```

### 3. Performance (usa el skill performance-optimizer)
```bash
pnpm build 2>&1 | tail -30
```
Analiza el output de bundle sizes.

### 4. Reporte final

Entrega un reporte estructurado con:

#### ✅ Lo que está bien
(Lista de puntos positivos)

#### ⚠️ Issues menores
(Issues que no bloquean pero deberían corregirse)

#### 🚨 Issues críticos  
(Issues que deben corregirse antes del deploy)

#### 📋 Plan de acción
(Lista priorizada de correcciones con estimado de tiempo)
