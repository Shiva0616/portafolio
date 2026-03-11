import { Component, computed, inject } from '@angular/core';
import { ScrollService } from '@core/services/scroll.service';

@Component({
  selector: 'app-scroll-progress',
  standalone: true,
  templateUrl: './scroll-progress.component.html',
  styleUrls: ['./scroll-progress.component.scss'],
})
export class ScrollProgressComponent {
  private readonly scrollService = inject(ScrollService);

  readonly progress = this.scrollService.scrollProgress;

  readonly transformStyle = computed(() => `scaleX(${this.progress()})`);
}
