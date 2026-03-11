# /new-component

Genera un componente Angular standalone completo para el portfolio de Daniel Castañeda.

**Argumentos:** `$ARGUMENTS` — nombre del componente en kebab-case (ej: `project-card`, `skills-tab`)

## Instrucciones

1. Lee `.claude/skills/component-generator/SKILL.md` para obtener los patrones exactos
2. Ejecuta: `pnpm exec ng generate component features/$ARGUMENTS --standalone --change-detection=OnPush --style=scss`
3. Modifica el componente generado para que siga exactamente los patrones del skill
4. Agrega las animaciones GSAP básicas (reveal on scroll)
5. Verifica que el template tenga roles ARIA correctos
6. Muestra el código completo de los 4 archivos generados (.ts, .html, .scss, .spec.ts)

## Resultado esperado

Un componente listo para producción con:
- TypeScript strict, standalone, OnPush
- GSAP context inicializado y limpiado en ngOnDestroy  
- Template HTML con roles ARIA semánticos
- SCSS con `prefers-reduced-motion` fallback
- Test básico de creación del componente
