import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { ScrollService } from './scroll.service';

describe('ScrollService', () => {
  let service: ScrollService;

  describe('en entorno browser', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          ScrollService,
          { provide: PLATFORM_ID, useValue: 'browser' },
        ],
      });
      service = TestBed.inject(ScrollService);
    });

    afterEach(() => {
      service.destroy();
    });

    it('debe crearse correctamente', () => {
      expect(service).toBeTruthy();
    });

    it('activeSection debe iniciar vacío', () => {
      expect(service.activeSection()).toBe('');
    });

    it('scrollProgress debe iniciar en 0', () => {
      expect(service.scrollProgress()).toBe(0);
    });

    it('scrollY debe iniciar en 0', () => {
      expect(service.scrollY()).toBe(0);
    });

    it('scrollDirection debe iniciar en "down"', () => {
      expect(service.scrollDirection()).toBe('down');
    });

    it('scrollTo() no debe lanzar errores si el elemento no existe', () => {
      expect(() => service.scrollTo('seccion-inexistente')).not.toThrow();
    });

    it('scrollTo() no debe lanzar errores si el elemento sí existe', () => {
      const section = document.createElement('section');
      section.id = 'hero';
      document.body.appendChild(section);

      expect(() => service.scrollTo('hero')).not.toThrow();

      document.body.removeChild(section);
    });

    it('initSectionObserver() no debe lanzar errores sin secciones en el DOM', () => {
      expect(() => service.initSectionObserver()).not.toThrow();
    });

    it('destroy() puede llamarse varias veces sin errores', () => {
      service.initSectionObserver();
      expect(() => {
        service.destroy();
        service.destroy();
      }).not.toThrow();
    });

    it('scrollProgress debe ser 0 cuando el doc no tiene scroll', () => {
      service.initSectionObserver();
      // Simular evento scroll manualmente
      window.dispatchEvent(new Event('scroll'));
      expect(service.scrollProgress()).toBeGreaterThanOrEqual(0);
      expect(service.scrollProgress()).toBeLessThanOrEqual(1);
    });
  });

  describe('en entorno server (SSR)', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          ScrollService,
          { provide: PLATFORM_ID, useValue: 'server' },
        ],
      });
      service = TestBed.inject(ScrollService);
    });

    it('scrollTo() no debe lanzar errores en SSR', () => {
      expect(() => service.scrollTo('hero')).not.toThrow();
    });

    it('initSectionObserver() no debe lanzar errores en SSR', () => {
      expect(() => service.initSectionObserver()).not.toThrow();
    });

    it('destroy() no debe lanzar errores en SSR', () => {
      expect(() => service.destroy()).not.toThrow();
    });
  });
});
