import { Injectable, PLATFORM_ID, inject, signal, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ScrollService implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);

  /** ID of the section currently visible in the viewport. */
  readonly activeSection = signal('');

  /** Scroll progress from 0 (top) to 1 (bottom of page). */
  readonly scrollProgress = signal(0);

  /** Current vertical scroll position in pixels. */
  readonly scrollY = signal(0);

  /** Direction of the last scroll movement. */
  readonly scrollDirection = signal<'up' | 'down'>('down');

  private sectionObserver: IntersectionObserver | null = null;
  private scrollHandler: (() => void) | null = null;
  private lastScrollY = 0;

  /**
   * Smooth-scrolls to the section with the given ID.
   * Falls back gracefully if the section does not exist.
   */
  scrollTo(sectionId: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const target = document.getElementById(sectionId);
    if (!target) return;

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /**
   * Initializes an IntersectionObserver that watches all <section> elements
   * (or elements with [data-section]) and updates `activeSection` with the
   * ID of the most visible section. Also attaches a scroll listener for
   * computing `scrollProgress`.
   */
  initSectionObserver(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // --- Scroll progress tracking ---
    this.scrollHandler = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      this.scrollProgress.set(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0);
      this.scrollY.set(scrollTop);
      this.scrollDirection.set(scrollTop > this.lastScrollY ? 'down' : 'up');
      this.lastScrollY = scrollTop;
    };
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
    // Fire once to set initial value
    this.scrollHandler();

    // --- Section visibility tracking ---
    const sections = document.querySelectorAll<HTMLElement>('section[id], [data-section][id]');
    if (sections.length === 0) return;

    // Track visibility ratios to pick the most visible section
    const visibilityMap = new Map<string, number>();

    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).id;
          if (id) {
            visibilityMap.set(id, entry.intersectionRatio);
          }
        });

        // Find the section with the highest intersection ratio
        let maxRatio = 0;
        let activeSectionId = '';

        visibilityMap.forEach((ratio, id) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            activeSectionId = id;
          }
        });

        if (activeSectionId) {
          this.activeSection.set(activeSectionId);
        }
      },
      {
        // Multiple thresholds give us a granular intersection ratio
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: '0px',
      }
    );

    sections.forEach((section) => this.sectionObserver!.observe(section));
  }

  /**
   * Cleans up the IntersectionObserver and scroll listener.
   * Called automatically on service destroy and can be called manually.
   */
  ngOnDestroy(): void {
    this.destroy();
  }

  destroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.sectionObserver) {
      this.sectionObserver.disconnect();
      this.sectionObserver = null;
    }

    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
      this.scrollHandler = null;
    }
  }
}
