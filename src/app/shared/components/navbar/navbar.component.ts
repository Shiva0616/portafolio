import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { ScrollService } from '@core/services/scroll.service';
import { ThemeService } from '@core/services/theme.service';

interface NavSection {
  id: string;
  label: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgClass],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  private readonly scrollService = inject(ScrollService);
  private readonly themeService = inject(ThemeService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly sections: NavSection[] = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' },
  ];

  readonly activeSection = this.scrollService.activeSection;
  readonly isDark = this.themeService.isDark;
  readonly mobileMenuOpen = signal(false);
  readonly navbarVisible = signal(true);
  readonly navbarScrolled = signal(false);

  private lastScrollY = 0;
  private scrollListener: (() => void) | null = null;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.scrollListener = () => {
      const currentY = window.scrollY;
      this.navbarScrolled.set(currentY > 50);

      if (currentY > this.lastScrollY && currentY > 100) {
        this.navbarVisible.set(false);
        this.mobileMenuOpen.set(false);
      } else {
        this.navbarVisible.set(true);
      }

      this.lastScrollY = currentY;
    };

    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }

  ngOnDestroy(): void {
    if (this.scrollListener && isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  navigateTo(sectionId: string): void {
    this.scrollService.scrollTo(sectionId);
    this.mobileMenuOpen.set(false);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }
}
