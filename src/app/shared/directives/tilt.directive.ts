import {
  Directive,
  ElementRef,
  inject,
  input,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';

@Directive({
  selector: '[appTilt]',
  standalone: true,
})
export class TiltDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);

  /** Maximum tilt angle in degrees. Default 10. */
  readonly appTiltStrength = input<number>(10);

  /** Perspective value in pixels for the 3D effect. Default 800. */
  readonly appTiltPerspective = input<number>(800);

  /** Duration of the tilt animation in seconds. Default 0.4. */
  readonly appTiltSpeed = input<number>(0.4);

  private mouseMoveHandler: ((e: MouseEvent) => void) | null = null;
  private mouseLeaveHandler: (() => void) | null = null;
  private isTouch = false;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (this.isTouch) return;

    const nativeEl = this.el.nativeElement;
    nativeEl.style.transformStyle = 'preserve-3d';
    nativeEl.style.willChange = 'transform';

    this.ngZone.runOutsideAngular(() => {
      this.bindEvents();
    });
  }

  ngOnDestroy(): void {
    this.unbindEvents();
  }

  private bindEvents(): void {
    const nativeEl = this.el.nativeElement;

    this.mouseMoveHandler = (e: MouseEvent) => {
      const rect = nativeEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalize to -1..1
      const normalizedX = (e.clientX - centerX) / (rect.width / 2);
      const normalizedY = (e.clientY - centerY) / (rect.height / 2);

      const strength = this.appTiltStrength();
      const perspective = this.appTiltPerspective();

      // RotateX is based on Y position (tilting up/down)
      // RotateY is based on X position (tilting left/right)
      const rotateX = -normalizedY * strength;
      const rotateY = normalizedX * strength;

      gsap.to(nativeEl, {
        rotateX,
        rotateY,
        transformPerspective: perspective,
        duration: this.appTiltSpeed(),
        ease: 'power2.out',
      });
    };

    this.mouseLeaveHandler = () => {
      gsap.to(nativeEl, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      });
    };

    nativeEl.addEventListener('mousemove', this.mouseMoveHandler, { passive: true });
    nativeEl.addEventListener('mouseleave', this.mouseLeaveHandler);
  }

  private unbindEvents(): void {
    const nativeEl = this.el.nativeElement;

    if (this.mouseMoveHandler) {
      nativeEl.removeEventListener('mousemove', this.mouseMoveHandler);
      this.mouseMoveHandler = null;
    }

    if (this.mouseLeaveHandler) {
      nativeEl.removeEventListener('mouseleave', this.mouseLeaveHandler);
      this.mouseLeaveHandler = null;
    }

    // Reset transform on destroy
    gsap.set(nativeEl, { rotateX: 0, rotateY: 0 });
  }
}
