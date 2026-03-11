import {
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';

@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);

  /** Delay in seconds before the animation starts after entering viewport. */
  readonly appRevealDelay = input<number>(0);

  /** Direction from which the element enters. */
  readonly appRevealDirection = input<'up' | 'down' | 'left' | 'right'>('up');

  /** Distance in pixels for the translate animation. */
  readonly appRevealDistance = input<number>(30);

  /** Duration of the animation in seconds. */
  readonly appRevealDuration = input<number>(0.8);

  private observer: IntersectionObserver | null = null;
  private tween: gsap.core.Tween | null = null;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const nativeEl = this.el.nativeElement;

    // Set initial hidden state
    gsap.set(nativeEl, {
      opacity: 0,
      ...this.getInitialTransform(),
    });

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animate();
            this.observer?.disconnect();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    this.observer.observe(nativeEl);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this.tween) {
      this.tween.kill();
      this.tween = null;
    }
  }

  private animate(): void {
    const nativeEl = this.el.nativeElement;

    this.tween = gsap.to(nativeEl, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: this.appRevealDuration(),
      delay: this.appRevealDelay(),
      ease: 'power3.out',
    });
  }

  private getInitialTransform(): Record<string, number> {
    const distance = this.appRevealDistance();
    const direction = this.appRevealDirection();

    switch (direction) {
      case 'up':
        return { y: distance };
      case 'down':
        return { y: -distance };
      case 'left':
        return { x: distance };
      case 'right':
        return { x: -distance };
      default:
        return { y: distance };
    }
  }
}
