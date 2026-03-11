import {
  Component,
  AfterViewInit,
  computed,
  ElementRef,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { SectionTitleComponent } from '@shared/components/section-title/section-title.component';
import { ProjectCardComponent } from '@shared/components/project-card/project-card.component';
import { RevealDirective } from '@shared/directives/reveal.directive';
import { GsapService } from '@core/services/gsap.service';
import { Project } from '@core/models/project.model';

interface ProjectFilter {
  id: string;
  label: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [SectionTitleComponent, ProjectCardComponent, RevealDirective],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit, AfterViewInit {
  private readonly http = inject(HttpClient);
  private readonly gsapService = inject(GsapService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly projectsGrid = viewChild<ElementRef>('projectsGrid');

  readonly allProjects = signal<Project[]>([]);
  readonly activeFilter = signal<string>('all');

  readonly filters: ProjectFilter[] = [
    { id: 'all', label: 'Todos' },
    { id: 'web', label: 'Web' },
    { id: 'iot', label: 'IoT' },
    { id: 'hardware', label: 'Hardware' },
    { id: 'automation', label: 'Automatización' },
    { id: 'software', label: 'Software' },
  ];

  readonly filteredProjects = computed(() => {
    const filter = this.activeFilter();
    const projects = this.allProjects();
    if (filter === 'all') return projects;
    return projects.filter((p) => p.category === filter);
  });

  ngOnInit(): void {
    this.http
      .get<Project[]>('assets/data/projects.json')
      .subscribe((projects) => this.allProjects.set(projects));
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    setTimeout(() => {
      const grid = this.projectsGrid()?.nativeElement;
      if (grid) {
        this.gsapService.projectCardsReveal(grid);
      }
    }, 300);
  }

  setFilter(filterId: string): void {
    if (this.activeFilter() === filterId) return;

    this.gsapService.filterProjects(() => {
      this.activeFilter.set(filterId);
    });
  }
}
