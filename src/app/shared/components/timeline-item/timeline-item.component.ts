import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { TimelineItem } from '@core/models/timeline-item.model';

@Component({
  selector: 'app-timeline-item',
  standalone: true,
  imports: [NgClass],
  templateUrl: './timeline-item.component.html',
  styleUrls: ['./timeline-item.component.scss'],
})
export class TimelineItemComponent {
  readonly item = input.required<TimelineItem>();
  readonly index = input<number>(0);
  readonly side = input<'left' | 'right'>('left');

  get typeIcon(): string {
    return this.item().type === 'education' ? 'graduation' : 'briefcase';
  }

  get typeColor(): string {
    return this.item().type === 'education' ? '#7B2FFF' : '#00C8FF';
  }

  get isLeft(): boolean {
    return this.side() === 'left';
  }
}
