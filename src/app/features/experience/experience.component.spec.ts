import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ExperienceComponent } from './experience.component';
import { TimelineItem } from '@core/models/timeline-item.model';

const mockTimeline: TimelineItem[] = [
  {
    id: 6,
    title: 'Full Stack Developer - Crop Platform',
    subtitle: 'Proyecto AgriTech',
    description: 'Plataforma de gestión agrícola.',
    date: '2026',
    type: 'work',
    tags: ['Angular', 'Node.js'],
  },
  {
    id: 7,
    title: 'Desarrollador - Calculadora ROI',
    subtitle: 'Herramienta financiera',
    description: 'Calculadora de retorno de inversión.',
    date: '2026',
    type: 'work',
    tags: ['TypeScript'],
  },
  {
    id: 8,
    title: 'Frontend Developer - Portafolio',
    subtitle: 'Marca personal',
    description: 'Portafolio profesional.',
    date: '2026',
    type: 'work',
    tags: ['Angular', 'GSAP'],
  },
  {
    id: 1,
    title: 'Ingeniero Electrónico',
    subtitle: 'ITM',
    description: 'Titulación en ingeniería electrónica.',
    date: '2017',
    type: 'education',
    tags: ['Electrónica'],
  },
];

describe('ExperienceComponent', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperienceComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crearse correctamente', () => {
    const fixture = TestBed.createComponent(ExperienceComponent);
    fixture.detectChanges();
    httpMock.expectOne('assets/data/timeline.json').flush(mockTimeline);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('workItems debe iniciar vacío antes de la petición HTTP', () => {
    const fixture = TestBed.createComponent(ExperienceComponent);
    expect(fixture.componentInstance.workItems()).toEqual([]);
    fixture.detectChanges();
    httpMock.expectOne('assets/data/timeline.json').flush(mockTimeline);
  });

  it('debe cargar solo items de tipo "work" desde el JSON', () => {
    const fixture = TestBed.createComponent(ExperienceComponent);
    fixture.detectChanges();
    httpMock.expectOne('assets/data/timeline.json').flush(mockTimeline);
    const items = fixture.componentInstance.workItems();
    expect(items.every((i) => i.type === 'work')).toBeTrue();
  });

  it('debe cargar exactamente 3 items de experiencia laboral', () => {
    const fixture = TestBed.createComponent(ExperienceComponent);
    fixture.detectChanges();
    httpMock.expectOne('assets/data/timeline.json').flush(mockTimeline);
    expect(fixture.componentInstance.workItems().length).toBe(3);
  });

  it('debe excluir los items de tipo "education"', () => {
    const fixture = TestBed.createComponent(ExperienceComponent);
    fixture.detectChanges();
    httpMock.expectOne('assets/data/timeline.json').flush(mockTimeline);
    const items = fixture.componentInstance.workItems();
    expect(items.some((i) => i.type === 'education')).toBeFalse();
  });

  it('los items de experiencia deben incluir Crop Platform', () => {
    const fixture = TestBed.createComponent(ExperienceComponent);
    fixture.detectChanges();
    httpMock.expectOne('assets/data/timeline.json').flush(mockTimeline);
    const titles = fixture.componentInstance.workItems().map((i) => i.title);
    expect(titles).toContain('Full Stack Developer - Crop Platform');
  });

  it('los items de experiencia deben incluir Calculadora ROI', () => {
    const fixture = TestBed.createComponent(ExperienceComponent);
    fixture.detectChanges();
    httpMock.expectOne('assets/data/timeline.json').flush(mockTimeline);
    const titles = fixture.componentInstance.workItems().map((i) => i.title);
    expect(titles).toContain('Desarrollador - Calculadora ROI');
  });

  it('los items de experiencia deben incluir el Portafolio', () => {
    const fixture = TestBed.createComponent(ExperienceComponent);
    fixture.detectChanges();
    httpMock.expectOne('assets/data/timeline.json').flush(mockTimeline);
    const titles = fixture.componentInstance.workItems().map((i) => i.title);
    expect(titles).toContain('Frontend Developer - Portafolio');
  });

  it('todos los items de experiencia deben tener fecha 2026', () => {
    const fixture = TestBed.createComponent(ExperienceComponent);
    fixture.detectChanges();
    httpMock.expectOne('assets/data/timeline.json').flush(mockTimeline);
    const items = fixture.componentInstance.workItems();
    expect(items.every((i) => i.date === '2026')).toBeTrue();
  });

  it('debe hacer la petición HTTP a assets/data/timeline.json', () => {
    const fixture = TestBed.createComponent(ExperienceComponent);
    fixture.detectChanges();
    const req = httpMock.expectOne('assets/data/timeline.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockTimeline);
  });
});
