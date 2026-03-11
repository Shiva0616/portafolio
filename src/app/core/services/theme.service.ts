import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);

  /** Whether dark mode is active. Defaults to true (dark-first). */
  readonly isDark = signal(true);

  /**
   * Initializes the theme by checking localStorage first,
   * then falling back to the OS-level prefers-color-scheme preference.
   * Must be called once at app bootstrap (e.g. in AppComponent.ngOnInit).
   */
  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const stored = localStorage.getItem('theme');

    if (stored === 'light') {
      this.isDark.set(false);
    } else if (stored === 'dark') {
      this.isDark.set(true);
    } else {
      // No explicit preference stored — check OS preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDark.set(prefersDark);
    }

    this.applyTheme();
  }

  /**
   * Toggles between dark and light mode.
   * Persists the choice to localStorage and applies the class immediately.
   */
  toggle(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.isDark.update((current) => !current);
    this.applyTheme();
  }

  /**
   * Applies or removes the 'dark' class on the <html> element
   * and persists the current preference to localStorage.
   */
  private applyTheme(): void {
    const doc = document.documentElement;

    if (this.isDark()) {
      doc.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      doc.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
}
