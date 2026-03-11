import {
  Component,
  AfterViewInit,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { SectionTitleComponent } from '@shared/components/section-title/section-title.component';
import { TimelineItemComponent } from '@shared/components/timeline-item/timeline-item.component';
import { RevealDirective } from '@shared/directives/reveal.directive';
import { GsapService } from '@core/services/gsap.service';
import { TimelineItem } from '@core/models/timeline-item.model';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [SectionTitleComponent, TimelineItemComponent, RevealDirective],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly gsapService = inject(GsapService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly educationItems = signal<TimelineItem[]>([]);
  readonly complementaryItems = signal<TimelineItem[]>([]);

  readonly statsSection = viewChild<ElementRef>('statsSection');

  readonly stats = [
    { value: 5, suffix: '+', label: 'Proyectos' },
    { value: 3, suffix: '+', label: 'Años Experiencia' },
    { value: 10, suffix: '+', label: 'Tecnologías' },
  ];

  ngOnInit(): void {
    this.http
      .get<TimelineItem[]>('assets/data/timeline.json')
      .subscribe((items) => {
        this.educationItems.set(items.filter((i) => i.type === 'education'));
        this.complementaryItems.set(
          items.filter((i) => i.type === 'complementary'),
        );
      });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    setTimeout(() => {
      const statsEl = this.statsSection()?.nativeElement as
        | HTMLElement
        | undefined;
      if (statsEl) {
        const counters = (statsEl as HTMLElement).querySelectorAll(
          '.stat-value',
        );
        counters.forEach((el: Element, i: number) => {
          this.gsapService.countUp(
            el as HTMLElement,
            this.stats[i].value,
            this.stats[i].suffix,
          );
        });
      }
    }, 200);
  }

  ngOnDestroy(): void {}
}
