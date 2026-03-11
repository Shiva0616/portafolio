export interface Skill {
  name: string;
  icon: string;
  level: number; // 0-100
  category: 'frontend' | 'backend' | 'hardware' | 'tools';
}
