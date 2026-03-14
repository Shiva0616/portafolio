import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { AppComponent } from './app.component';
import { ThemeService } from '@core/services/theme.service';
import { GsapService } from '@core/services/gsap.service';
import { ScrollService } from '@core/services/scroll.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    TestBed.overrideComponent(AppComponent, {
      set: {
        template: '<main></main><footer><p>&copy; 2026 Shiva. Todos los derechos reservados.</p></footer>',
      },
    });

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    }).compileComponents();
  });

  it('debe crearse correctamente', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('debe renderizar el footer con el año 2026', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const footer: HTMLElement = fixture.nativeElement.querySelector('footer');
    expect(footer).toBeTruthy();
    expect(footer.textContent).toContain('2026');
  });

  it('debe renderizar el elemento <main>', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const main: HTMLElement = fixture.nativeElement.querySelector('main');
    expect(main).toBeTruthy();
  });

  it('ngOnInit() debe llamar a gsapService.init()', () => {
    const gsapService = TestBed.inject(GsapService);
    spyOn(gsapService, 'init');
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(gsapService.init).toHaveBeenCalled();
  });

  it('ngOnInit() debe llamar a themeService.init()', () => {
    const themeService = TestBed.inject(ThemeService);
    spyOn(themeService, 'init');
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(themeService.init).toHaveBeenCalled();
  });

  it('ngOnInit() debe llamar a scrollService.initSectionObserver()', () => {
    const scrollService = TestBed.inject(ScrollService);
    spyOn(scrollService, 'initSectionObserver');
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(scrollService.initSectionObserver).toHaveBeenCalled();
  });
});
