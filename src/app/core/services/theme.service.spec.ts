import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  describe('en entorno browser', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: PLATFORM_ID, useValue: 'browser' },
        ],
      });
      service = TestBed.inject(ThemeService);
    });

    it('debe crearse correctamente', () => {
      expect(service).toBeTruthy();
    });

    it('debe iniciar en modo oscuro por defecto (signal)', () => {
      expect(service.isDark()).toBeTrue();
    });

    it('init() debe leer "light" de localStorage y desactivar el modo oscuro', () => {
      localStorage.setItem('theme', 'light');
      service.init();
      expect(service.isDark()).toBeFalse();
      expect(document.documentElement.classList.contains('dark')).toBeFalse();
    });

    it('init() debe leer "dark" de localStorage y activar el modo oscuro', () => {
      localStorage.setItem('theme', 'dark');
      service.init();
      expect(service.isDark()).toBeTrue();
      expect(document.documentElement.classList.contains('dark')).toBeTrue();
    });

    it('init() sin preferencia guardada debe usar prefers-color-scheme', () => {
      const mql = { matches: false } as MediaQueryList;
      spyOn(window, 'matchMedia').and.returnValue(mql);
      service.init();
      expect(service.isDark()).toBeFalse();
    });

    it('toggle() debe cambiar de dark a light y persistir en localStorage', () => {
      localStorage.setItem('theme', 'dark');
      service.init();
      service.toggle();
      expect(service.isDark()).toBeFalse();
      expect(localStorage.getItem('theme')).toBe('light');
    });

    it('toggle() dos veces debe volver al estado original', () => {
      localStorage.setItem('theme', 'dark');
      service.init();
      service.toggle();
      service.toggle();
      expect(service.isDark()).toBeTrue();
    });

    it('toggle() debe añadir clase "dark" en <html> cuando activa dark mode', () => {
      localStorage.setItem('theme', 'light');
      service.init();
      service.toggle();
      expect(document.documentElement.classList.contains('dark')).toBeTrue();
    });

    it('toggle() debe quitar clase "dark" en <html> cuando activa light mode', () => {
      localStorage.setItem('theme', 'dark');
      service.init();
      service.toggle();
      expect(document.documentElement.classList.contains('dark')).toBeFalse();
    });
  });

  describe('en entorno server (SSR)', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: PLATFORM_ID, useValue: 'server' },
        ],
      });
      service = TestBed.inject(ThemeService);
    });

    it('init() no debe lanzar errores en SSR', () => {
      expect(() => service.init()).not.toThrow();
    });

    it('toggle() no debe lanzar errores en SSR', () => {
      expect(() => service.toggle()).not.toThrow();
    });
  });
});
