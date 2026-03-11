export interface Project {
  id: number;
  title: string;
  description: string;
  category: 'web' | 'iot' | 'hardware' | 'automation' | 'software';
  stack: string[];
  image?: string;
  github?: string;
  demo?: string;
  model3d?: {
    type: 'gltf' | 'three';
    src?: string;
    component?: string;
    alt: string;
  };
}
