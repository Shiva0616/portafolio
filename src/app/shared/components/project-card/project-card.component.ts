import {
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { Project } from '@core/models/project.model';
import { ThreeService } from '@core/services/three.service';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
})
export class ProjectCardComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly threeService = inject(ThreeService);

  readonly project = input.required<Project>();

  readonly modelInteraction = output<Project>();

  readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('projectCanvas');

  readonly isLoading = signal(true);
  readonly isHovered = signal(false);

  private cleanupFn: (() => void) | null = null;
  private observer: IntersectionObserver | null = null;

  get categoryColorClass(): string {
    const colorMap: Record<string, string> = {
      web: 'bg-accent-cyan/20 text-accent-cyan',
      iot: 'bg-accent-green/20 text-accent-green',
      hardware: 'bg-accent-purple/20 text-accent-purple',
      automation: 'bg-accent-blue/20 text-accent-blue',
      software: 'bg-accent-cyan/20 text-accent-cyan',
    };
    return colorMap[this.project().category] ?? 'bg-accent-cyan/20 text-accent-cyan';
  }

  get categoryLabel(): string {
    const labelMap: Record<string, string> = {
      web: 'Web',
      iot: 'IoT',
      hardware: 'Hardware',
      automation: 'Automation',
      software: 'Software',
    };
    return labelMap[this.project().category] ?? this.project().category;
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    requestAnimationFrame(() => {
      this.setupLazyLoad();
    });
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.dispose3D();
  }

  onMouseEnter(): void {
    this.isHovered.set(true);
    this.modelInteraction.emit(this.project());
  }

  onMouseLeave(): void {
    this.isHovered.set(false);
  }

  private setupLazyLoad(): void {
    const canvasEl = this.canvas()?.nativeElement;
    if (!canvasEl) {
      this.isLoading.set(false);
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.init3DScene();
            this.observer?.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    this.observer.observe(canvasEl);
  }

  private init3DScene(): void {
    const canvasEl = this.canvas()?.nativeElement;
    const proj = this.project();
    if (!canvasEl) return;

    if (proj.model3d?.type === 'gltf' && proj.model3d.src) {
      this.cleanupFn = this.threeService.loadGLBModel(canvasEl, proj.model3d.src);
    } else {
      this.cleanupFn = this.threeService.createFallbackScene(canvasEl, 'particles');
    }

    this.isLoading.set(false);
  }

  private dispose3D(): void {
    if (this.cleanupFn) {
      this.cleanupFn();
      this.cleanupFn = null;
    }
  }
}
