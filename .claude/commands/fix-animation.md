# /fix-animation

Diagnostica y corrige problemas de animaciones GSAP en el portfolio.

**Argumentos:** `$ARGUMENTS` — descripción del problema o nombre del componente/animación

## Proceso de diagnóstico

### 1. Identificar el componente
Lee el archivo TypeScript del componente mencionado en `$ARGUMENTS`.
Si no se especifica, busca con:
```bash
grep -rn "gsap\|ScrollTrigger\|Flip" src/app/features/ --include="*.ts" -l
```

### 2. Checklist de diagnóstico GSAP

Verifica en el código encontrado:

**Registro de plugins**
- [ ] `ScrollTrigger` registrado en `main.ts` o en el servicio antes de usar
- [ ] `Flip` registrado si se usa para filtros
- [ ] `TextPlugin` registrado si se usa typewriter

**SSG Safety**  
- [ ] `isPlatformBrowser(this.platformId)` antes de cualquier GSAP call
- [ ] Las animaciones están dentro de `ngAfterViewInit`, no `ngOnInit`

**Cleanup**
- [ ] `gsap.context()` envuelve todas las animaciones
- [ ] `gsapCtx?.revert()` en `ngOnDestroy`
- [ ] No hay ScrollTriggers sin `once: true` que se acumulen

**ScrollTrigger específico**
- [ ] `ScrollTrigger.refresh()` llamado después de cambios de layout
- [ ] El `trigger` existe en el DOM cuando se ejecuta
- [ ] No hay conflicto entre CSS `transform` y GSAP `transform`

### 3. Problemas comunes y soluciones

**Animación no se dispara:**
→ Verificar que el elemento existe: `console.log(document.querySelector('.selector'))`
→ Revisar el `start` del ScrollTrigger: probar `start: 'top bottom'`

**Animación se repite infinitamente:**
→ Agregar `once: true` al ScrollTrigger
→ Verificar que no hay re-render del componente reseteando el estado

**Memory leak:**
→ Asegurar que `gsapCtx?.revert()` está en ngOnDestroy
→ `ScrollTrigger.getAll().forEach(t => t.kill())` si el context no es suficiente

**Animación en SSG/Vercel no funciona:**
→ Todo el código GSAP debe estar dentro de `if (isPlatformBrowser(this.platformId))`

### 4. Corrección
Proporciona el código corregido con explicación de qué se cambió y por qué.
