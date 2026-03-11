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
  selector: '[appMagnetic]',
  standalone: true,
})
export class MagneticDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);

  /** Strength of the magnetic pull (0 to 1). Default 0.35. */
  readonly appMagneticStrength = input<number>(0.35);

  private mouseEnterHandler: (() => void) | null = null;
  private mouseMoveHandler: ((e: MouseEvent) => void) | null = null;
  private mouseLeaveHandler: (() => void) | null = null;
  private isTouch = false;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (this.isTouch) return;

    this.ngZone.runOutsideAngular(() => {
      this.bindEvents();
    });
  }

  ngOnDestroy(): void {
    this.unbindEvents();
  }

  private bindEvents(): void {
    const nativeEl = this.el.nativeElement;

    this.mouseEnterHandler = () => {
      gsap.to(nativeEl, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
    };

    this.mouseMoveHandler = (e: MouseEvent) => {
      const rect = nativeEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * this.appMagneticStrength();
      const deltaY = (e.clientY - centerY) * this.appMagneticStrength();

      gsap.to(nativeEl, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    this.mouseLeaveHandler = () => {
      gsap.to(nativeEl, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)',
      });
    };

    nativeEl.addEventListener('mouseenter', this.mouseEnterHandler);
    nativeEl.addEventListener('mousemove', this.mouseMoveHandler, { passive: true });
    nativeEl.addEventListener('mouseleave', this.mouseLeaveHandler);
  }

  private unbindEvents(): void {
    const nativeEl = this.el.nativeElement;

    if (this.mouseEnterHandler) {
      nativeEl.removeEventListener('mouseenter', this.mouseEnterHandler);
      this.mouseEnterHandler = null;
    }

    if (this.mouseMoveHandler) {
      nativeEl.removeEventListener('mousemove', this.mouseMoveHandler);
      this.mouseMoveHandler = null;
    }

    if (this.mouseLeaveHandler) {
      nativeEl.removeEventListener('mouseleave', this.mouseLeaveHandler);
      this.mouseLeaveHandler = null;
    }

    // Reset position on destroy
    gsap.set(nativeEl, { x: 0, y: 0, scale: 1 });
  }
}
