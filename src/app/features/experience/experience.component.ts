import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SectionTitleComponent } from '@shared/components/section-title/section-title.component';
import { TimelineItemComponent } from '@shared/components/timeline-item/timeline-item.component';
import { RevealDirective } from '@shared/directives/reveal.directive';
import { TimelineItem } from '@core/models/timeline-item.model';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [SectionTitleComponent, TimelineItemComponent, RevealDirective],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
})
export class ExperienceComponent implements OnInit {
  private readonly http = inject(HttpClient);
  readonly workItems = signal<TimelineItem[]>([]);

  ngOnInit(): void {
    this.http
      .get<TimelineItem[]>('assets/data/timeline.json')
      .subscribe((items) => {
        this.workItems.set(items.filter((i) => i.type === 'work'));
      });
  }
}
