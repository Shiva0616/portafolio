import {
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { ThreeService } from '@core/services/three.service';

export interface Model3DConfig {
  type: 'gltf' | 'three';
  src?: string;
  fallback?: 'wireframe' | 'particles' | 'wave';
  alt: string;
}

@Component({
  selector: 'app-model-viewer',
  standalone: true,
  imports: [NgClass],
  templateUrl: './model-viewer.component.html',
  styleUrls: ['./model-viewer.component.scss'],
})
export class ModelViewerComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly threeService = inject(ThreeService);

  readonly config = input.required<Model3DConfig>();

  readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('viewerCanvas');

  readonly isLoading = signal(true);
  readonly hasError = signal(false);

  private cleanupFn: (() => void) | null = null;
  private observer: IntersectionObserver | null = null;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    requestAnimationFrame(() => {
      this.setupLazyLoad();
    });
  }

  ngOnDestroy(): void {
    this.disposeScene();

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
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
            this.initScene();
            this.observer?.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    this.observer.observe(canvasEl.parentElement ?? canvasEl);
  }

  private initScene(): void {
    const canvasEl = this.canvas()?.nativeElement;
    const cfg = this.config();
    if (!canvasEl) return;

    try {
      if (cfg.type === 'gltf' && cfg.src) {
        this.cleanupFn = this.threeService.loadGLBModel(canvasEl, cfg.src);
      } else {
        const fallbackType = cfg.fallback ?? 'wireframe';
        this.cleanupFn = this.threeService.createFallbackScene(canvasEl, fallbackType);
      }

      this.isLoading.set(false);
    } catch (error) {
      console.error('ModelViewer: Failed to initialize 3D scene', error);
      this.hasError.set(true);
      this.isLoading.set(false);
      this.loadFallback(canvasEl);
    }
  }

  private loadFallback(canvasEl: HTMLCanvasElement): void {
    try {
      const fallbackType = this.config().fallback ?? 'particles';
      this.cleanupFn = this.threeService.createFallbackScene(canvasEl, fallbackType);
      this.hasError.set(false);
    } catch {
      // Final fallback: just show the error state
    }
  }

  private disposeScene(): void {
    if (this.cleanupFn) {
      this.cleanupFn();
      this.cleanupFn = null;
    }
  }
}
