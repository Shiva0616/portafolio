import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { CustomCursorComponent } from '@shared/components/custom-cursor/custom-cursor.component';
import { ScrollProgressComponent } from '@shared/components/scroll-progress/scroll-progress.component';
import { HeroComponent } from '@features/hero/hero.component';
import { AboutComponent } from '@features/about/about.component';
import { SkillsComponent } from '@features/skills/skills.component';
import { ProjectsComponent } from '@features/projects/projects.component';
import { ExperienceComponent } from '@features/experience/experience.component';
import { ContactComponent } from '@features/contact/contact.component';
import { GsapService } from '@core/services/gsap.service';
import { ThemeService } from '@core/services/theme.service';
import { ScrollService } from '@core/services/scroll.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    CustomCursorComponent,
    ScrollProgressComponent,
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ProjectsComponent,
    ExperienceComponent,
    ContactComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly gsapService = inject(GsapService);
  private readonly themeService = inject(ThemeService);
  private readonly scrollService = inject(ScrollService);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.gsapService.init();
      this.themeService.init();
      this.scrollService.initSectionObserver();
    }
  }
}
