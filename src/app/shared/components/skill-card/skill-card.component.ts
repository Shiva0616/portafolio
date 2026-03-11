import {
  Component,
  ElementRef,
  inject,
  input,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';
import { Skill } from '@core/models/skill.model';

@Component({
  selector: 'app-skill-card',
  standalone: true,
  templateUrl: './skill-card.component.html',
  styleUrls: ['./skill-card.component.scss'],
})
export class SkillCardComponent {
  private readonly platformId = inject(PLATFORM_ID);

  readonly skill = input.required<Skill>();
  readonly cardEl = viewChild<ElementRef<HTMLDivElement>>('cardElement');

  get categoryColor(): string {
    const colors: Record<string, string> = {
      frontend: '#00C8FF',
      backend: '#00FFB3',
      hardware: '#7B2FFF',
      tools: '#0052FF',
    };
    return colors[this.skill().category] ?? '#00C8FF';
  }
}
