import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser, NgClass } from '@angular/common';
import gsap from 'gsap';

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  imports: [NgClass],
  templateUrl: './custom-cursor.component.html',
  styleUrls: ['./custom-cursor.component.scss'],
})
export class CustomCursorComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);

  readonly cursorDot = viewChild<ElementRef<HTMLDivElement>>('cursorDot');
  readonly cursorRing = viewChild<ElementRef<HTMLDivElement>>('cursorRing');

  readonly hoverActive = signal(false);
  readonly clicking = signal(false);
  readonly isTouch = signal(false);

  private mouseX = 0;
  private mouseY = 0;
  private ringX = 0;
  private ringY = 0;
  private rafId: number | null = null;

  private mouseMoveHandler: ((e: MouseEvent) => void) | null = null;
  private mouseDownHandler: (() => void) | null = null;
  private mouseUpHandler: (() => void) | null = null;
  private mouseOverHandler: ((e: MouseEvent) => void) | null = null;
  private mouseOutHandler: ((e: MouseEvent) => void) | null = null;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Detect touch devices
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.isTouch.set(isTouch);
    if (isTouch) return;

    this.mouseMoveHandler = (e: MouseEvent) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      const dot = this.cursorDot()?.nativeElement;
      if (dot) {
        gsap.set(dot, { x: this.mouseX - 3, y: this.mouseY - 3 });
      }
    };

    this.mouseDownHandler = () => {
      this.clicking.set(true);
    };

    this.mouseUpHandler = () => {
      this.clicking.set(false);
    };

    this.mouseOverHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [data-cursor="pointer"], input, textarea, select, label')) {
        this.hoverActive.set(true);
      }
    };

    this.mouseOutHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [data-cursor="pointer"], input, textarea, select, label')) {
        this.hoverActive.set(false);
      }
    };

    document.addEventListener('mousemove', this.mouseMoveHandler, { passive: true });
    document.addEventListener('mousedown', this.mouseDownHandler);
    document.addEventListener('mouseup', this.mouseUpHandler);
    document.addEventListener('mouseover', this.mouseOverHandler, { passive: true });
    document.addEventListener('mouseout', this.mouseOutHandler, { passive: true });

    this.startRingLoop();
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }

    if (this.mouseMoveHandler) {
      document.removeEventListener('mousemove', this.mouseMoveHandler);
    }
    if (this.mouseDownHandler) {
      document.removeEventListener('mousedown', this.mouseDownHandler);
    }
    if (this.mouseUpHandler) {
      document.removeEventListener('mouseup', this.mouseUpHandler);
    }
    if (this.mouseOverHandler) {
      document.removeEventListener('mouseover', this.mouseOverHandler);
    }
    if (this.mouseOutHandler) {
      document.removeEventListener('mouseout', this.mouseOutHandler);
    }
  }

  private startRingLoop(): void {
    const lerp = 0.15;

    const animate = () => {
      this.ringX += (this.mouseX - this.ringX) * lerp;
      this.ringY += (this.mouseY - this.ringY) * lerp;

      const ring = this.cursorRing()?.nativeElement;
      if (ring) {
        gsap.set(ring, { x: this.ringX, y: this.ringY });
      }

      this.rafId = requestAnimationFrame(animate);
    };

    this.rafId = requestAnimationFrame(animate);
  }
}
