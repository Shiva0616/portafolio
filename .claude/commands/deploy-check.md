# /deploy-check

Verificación completa antes de hacer deploy a Vercel. Ejecuta todos los checks en orden.

## Pasos

### Paso 1: Linting y formato
```bash
pnpm lint
pnpm format --check
```
Si hay errores de lint: corrígelos antes de continuar.

### Paso 2: Build de producción
```bash
pnpm build
```
- Verifica que no haya errores de compilación
- Muestra el resumen de bundle sizes
- Alerta si algún chunk supera 500KB

### Paso 3: Verificaciones de seguridad
```bash
# Buscar console.log en código de producción
grep -rn "console\.log" src/app/ --include="*.ts"

# Buscar variables de entorno expuestas
grep -rn "API_KEY\|SECRET\|PASSWORD" src/ --include="*.ts" --include="*.html"

# Verificar que .env no está en git
git check-ignore .env
```

### Paso 4: SEO básico
Lee `src/index.html` y verifica:
- [ ] `<title>` descriptivo
- [ ] `<meta name="description">` presente y único
- [ ] `<meta property="og:*">` para Open Graph
- [ ] `<html lang="es">` presente
- [ ] `<link rel="canonical">` si aplica

### Paso 5: Checklist final
```
[ ] pnpm lint ✅ sin errores
[ ] pnpm build ✅ sin errores  
[ ] Bundle inicial < 500KB
[ ] No hay console.log en producción
[ ] No hay API keys en código
[ ] Meta tags SEO completos
[ ] Variables de entorno en Vercel configuradas
```

### Paso 6: Reporte de deploy
Si todo está OK: "✅ Listo para deploy. Ejecuta: `vercel --prod`"
Si hay issues: Lista detallada de lo que debe corregirse primero.
