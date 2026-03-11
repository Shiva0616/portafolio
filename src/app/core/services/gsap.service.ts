import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { TextPlugin } from 'gsap/TextPlugin';

@Injectable({ providedIn: 'root' })
export class GsapService {
  private readonly platformId = inject(PLATFORM_ID);
  private isBrowser = false;

  init(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (!this.isBrowser) return;
    gsap.registerPlugin(ScrollTrigger, Flip, TextPlugin);
  }

  /**
   * Creates a hero entrance timeline with staggered reveals.
   * Expects the following selectors in the hero section:
   * .hero-name, .hero-monogram, .hero-role, .hero-chip, .hero-cta, .hero-canvas
   */
  heroEntrance(): gsap.core.Timeline {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (!this.isBrowser) return tl;

    // Staggered name reveal — split letters fade in from below
    tl.from('.hero-name', {
      y: 80,
      opacity: 0,
      duration: 1,
      stagger: 0.05,
    });

    // Monogram glitch effect — rapid scale + skew flicker
    tl.fromTo(
      '.hero-monogram',
      { opacity: 0, scale: 0.8, skewX: -20 },
      {
        opacity: 1,
        scale: 1,
        skewX: 0,
        duration: 0.6,
        ease: 'steps(8)',
      },
      '-=0.4'
    );
    // Quick glitch flicker after landing
    tl.to('.hero-monogram', {
      keyframes: [
        { skewX: 10, scaleX: 1.05, duration: 0.05 },
        { skewX: -5, scaleX: 0.98, duration: 0.05 },
        { skewX: 3, scaleX: 1.02, duration: 0.05 },
        { skewX: 0, scaleX: 1, duration: 0.05 },
      ],
    });

    // Role typewriter — text appears character by character
    tl.from('.hero-role', {
      opacity: 0,
      duration: 0.3,
    }, '-=0.1');

    // Chip reveals — stagger from below with slight rotation
    tl.from('.hero-chip', {
      y: 30,
      opacity: 0,
      rotation: -5,
      duration: 0.5,
      stagger: 0.1,
      ease: 'back.out(1.4)',
    }, '-=0.2');

    // CTA button reveals — scale up from center
    tl.from('.hero-cta', {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      stagger: 0.15,
      ease: 'back.out(1.7)',
    }, '-=0.3');

    // Canvas fade in — the 3D canvas fades in behind everything
    tl.from('.hero-canvas', {
      opacity: 0,
      duration: 1.2,
      ease: 'power2.inOut',
    }, '-=0.8');

    return tl;
  }

  /**
   * Cycles through an array of texts on the given element using GSAP TextPlugin.
   * Runs indefinitely with a typewriter + delete effect.
   */
  typewriterRole(element: HTMLElement, texts: string[]): gsap.core.Timeline {
    const tl = gsap.timeline({ repeat: -1 });

    if (!this.isBrowser || texts.length === 0) return tl;

    texts.forEach((text) => {
      // Type in the text
      tl.to(element, {
        duration: text.length * 0.06,
        text: { value: text, delimiter: '' },
        ease: 'none',
      });
      // Hold the text for a moment
      tl.to(element, { duration: 1.8 });
      // Delete the text
      tl.to(element, {
        duration: text.length * 0.03,
        text: { value: '', delimiter: '' },
        ease: 'none',
      });
      // Brief pause before next text
      tl.to(element, { duration: 0.3 });
    });

    return tl;
  }

  /**
   * Reveals project cards with a stagger using ScrollTrigger.
   * Cards fade in and slide up as the container scrolls into view.
   */
  projectCardsReveal(container: HTMLElement): void {
    if (!this.isBrowser) return;

    const cards = container.querySelectorAll('.project-card');
    if (cards.length === 0) return;

    gsap.set(cards, { y: 60, opacity: 0 });

    ScrollTrigger.batch(cards, {
      onEnter: (batch) => {
        gsap.to(batch, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          overwrite: true,
        });
      },
      onLeaveBack: (batch) => {
        gsap.to(batch, {
          y: 60,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
          overwrite: true,
        });
      },
      start: 'top 85%',
      end: 'bottom 15%',
    });
  }

  /**
   * Uses GSAP Flip to animate project filtering.
   * Takes a callback that performs the actual DOM filter (show/hide cards),
   * then GSAP Flip animates the layout change.
   */
  filterProjects(filterFn: () => void): void {
    if (!this.isBrowser) return;

    const cards = document.querySelectorAll('.project-card');
    const state = Flip.getState(cards);

    // Execute the filter function (e.g., toggling display/classes)
    filterFn();

    Flip.from(state, {
      duration: 0.6,
      ease: 'power2.inOut',
      stagger: 0.05,
      absolute: true,
      scale: true,
      onEnter: (elements) =>
        gsap.fromTo(
          elements,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.6 }
        ),
      onLeave: (elements) =>
        gsap.to(elements, { opacity: 0, scale: 0.8, duration: 0.4 }),
    });
  }

  /**
   * Reveals timeline items alternating from left and right with ScrollTrigger.
   */
  timelineReveal(items: HTMLElement[]): void {
    if (!this.isBrowser || items.length === 0) return;

    items.forEach((item, index) => {
      const fromLeft = index % 2 === 0;

      gsap.from(item, {
        x: fromLeft ? -100 : 100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          end: 'top 50%',
          toggleActions: 'play none none reverse',
        },
      });
    });
  }

  /**
   * Animates skill bars from scaleX(0) to their target width using ScrollTrigger.
   */
  animateSkillBars(bars: HTMLElement[]): void {
    if (!this.isBrowser || bars.length === 0) return;

    bars.forEach((bar) => {
      gsap.from(bar, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: bar,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    });
  }

  /**
   * Animated counter that counts from 0 to `end`, optionally appending a suffix.
   */
  countUp(el: HTMLElement, end: number, suffix = ''): void {
    if (!this.isBrowser) return;

    const counter = { value: 0 };

    gsap.to(counter, {
      value: end,
      duration: 2,
      ease: 'power1.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      onUpdate: () => {
        el.textContent = `${Math.round(counter.value)}${suffix}`;
      },
    });
  }

  /**
   * Creates a scrub-based parallax effect on the given element.
   * The element moves vertically based on scroll position.
   */
  sectionParallax(el: HTMLElement, strength = 50): void {
    if (!this.isBrowser) return;

    gsap.to(el, {
      y: -strength,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }

  /**
   * Kills all active ScrollTriggers and GSAP tweens to prevent memory leaks.
   */
  cleanup(): void {
    if (!this.isBrowser) return;

    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    gsap.killTweensOf('*');
  }
}
