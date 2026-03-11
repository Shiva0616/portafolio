# /add-project

Agrega un nuevo proyecto al portfolio de Daniel Castañeda con toda la información necesaria.

**Argumentos:** `$ARGUMENTS` — nombre del proyecto

## Proceso

### 1. Solicitar información
Pregunta al usuario:
- Título del proyecto
- Categoría: `web` | `iot` | `hardware` | `automation`
- Descripción técnica (2-3 líneas)
- Problema que resuelve (1 línea)
- Stack de tecnologías (lista separada por comas)
- URL de GitHub (opcional)
- URL de demo (opcional)
- Modelo 3D disponible: `sketchfab` | `spline` | `none`
- Si tiene modelo 3D: URL del embed

### 2. Actualizar projects.json
Lee `src/assets/data/projects.json` y agrega el nuevo proyecto siguiendo exactamente esta interfaz:

```typescript
interface Project {
  id: number;           // siguiente ID disponible
  title: string;
  category: 'web' | 'iot' | 'hardware' | 'automation';
  description: string;
  problem: string;
  stack: string[];
  githubUrl?: string;
  demoUrl?: string;
  model3d?: {
    type: 'sketchfab' | 'spline' | 'gltf' | 'none';
    src?: string;
    alt: string;
  };
}
```

### 3. Verificar la card
Confirma que el proyecto aparecerá correctamente en:
- Filtro "Todos"
- Su filtro de categoría específica
- El modelo 3D tiene alt text descriptivo

### 4. Commit
Genera el commit semántico:
```bash
git add src/assets/data/projects.json
git commit -m "feat(projects): add $ARGUMENTS project card"
```
