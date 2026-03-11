import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  inject,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GsapService } from '@core/services/gsap.service';
import { ScrollService } from '@core/services/scroll.service';
import { ThemeService } from '@core/services/theme.service';
import { createHeroParticles } from './hero-scene';
import { MagneticDirective } from '@shared/directives/magnetic.directive';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [MagneticDirective],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly gsapService = inject(GsapService);
  private readonly scrollService = inject(ScrollService);
  private readonly themeService = inject(ThemeService);

  readonly isDark = this.themeService.isDark;

  readonly heroCanvas = viewChild<ElementRef<HTMLCanvasElement>>('heroCanvas');
  readonly roleText = viewChild<ElementRef<HTMLSpanElement>>('roleText');

  private cleanupScene: (() => void) | null = null;
  private heroTimeline: gsap.core.Timeline | null = null;

  readonly techStack = [
    'Angular',
    'TypeScript',
    'Node.js',
    'Java',
    'C++',
    'IoT',
  ];
  readonly roles = [
    'Desarrollador Full Stack',
    'Ingeniero Electrónico',
    'Especialista IoT',
    'Automatización Industrial',
  ];

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const canvas = this.heroCanvas()?.nativeElement;
    if (canvas) {
      this.cleanupScene = createHeroParticles(canvas);
    }

    setTimeout(() => {
      this.heroTimeline = this.gsapService.heroEntrance();

      const roleEl = this.roleText()?.nativeElement;
      if (roleEl) {
        this.gsapService.typewriterRole(roleEl, this.roles);
      }
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.cleanupScene) {
      this.cleanupScene();
    }
    if (this.heroTimeline) {
      this.heroTimeline.kill();
    }
  }

  scrollToProjects(): void {
    this.scrollService.scrollTo('projects');
  }
}
