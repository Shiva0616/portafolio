import { Component, input } from '@angular/core';

@Component({
  selector: 'app-section-title',
  standalone: true,
  templateUrl: './section-title.component.html',
  styleUrls: ['./section-title.component.scss'],
})
export class SectionTitleComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
}
