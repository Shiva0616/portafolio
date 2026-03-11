import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SectionTitleComponent } from '@shared/components/section-title/section-title.component';
import { SkillCardComponent } from '@shared/components/skill-card/skill-card.component';
import { RevealDirective } from '@shared/directives/reveal.directive';
import { Skill } from '@core/models/skill.model';

interface SkillCategory {
  id: Skill['category'];
  label: string;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [SectionTitleComponent, SkillCardComponent, RevealDirective],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent implements OnInit {
  private readonly http = inject(HttpClient);

  readonly allSkills = signal<Skill[]>([]);
  readonly activeCategory = signal<Skill['category']>('frontend');

  readonly categories: SkillCategory[] = [
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'hardware', label: 'Hardware' },
    { id: 'tools', label: 'Herramientas' },
  ];

  readonly filteredSkills = computed(() =>
    this.allSkills().filter((s) => s.category === this.activeCategory())
  );

  ngOnInit(): void {
    this.http
      .get<Skill[]>('assets/data/skills.json')
      .subscribe((skills) => this.allSkills.set(skills));
  }

  setCategory(category: Skill['category']): void {
    this.activeCategory.set(category);
  }
}
