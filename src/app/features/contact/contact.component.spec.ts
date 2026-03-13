import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent, ReactiveFormsModule],
    }).compileComponents();
  });

  it('debe crearse correctamente', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('debe iniciar con el formulario inválido (campos vacíos)', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    expect(fixture.componentInstance.contactForm.invalid).toBeTrue();
  });

  it('debe iniciar con sending en false', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    expect(fixture.componentInstance.sending()).toBeFalse();
  });

  it('debe iniciar con sent en false', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    expect(fixture.componentInstance.sent()).toBeFalse();
  });

  it('debe iniciar con error en false', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    expect(fixture.componentInstance.error()).toBeFalse();
  });

  it('campo name debe ser inválido si está vacío', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    const control = fixture.componentInstance.contactForm.get('name');
    control?.setValue('');
    expect(control?.invalid).toBeTrue();
  });

  it('campo name debe ser inválido si tiene menos de 2 caracteres', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    const control = fixture.componentInstance.contactForm.get('name');
    control?.setValue('A');
    expect(control?.invalid).toBeTrue();
  });

  it('campo name debe ser válido con al menos 2 caracteres', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    const control = fixture.componentInstance.contactForm.get('name');
    control?.setValue('Daniel');
    expect(control?.valid).toBeTrue();
  });

  it('campo email debe ser inválido con formato incorrecto', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    const control = fixture.componentInstance.contactForm.get('email');
    control?.setValue('correo-sin-arroba');
    expect(control?.invalid).toBeTrue();
  });

  it('campo email debe ser válido con formato correcto', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    const control = fixture.componentInstance.contactForm.get('email');
    control?.setValue('test@example.com');
    expect(control?.valid).toBeTrue();
  });

  it('campo message debe ser inválido con menos de 10 caracteres', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    const control = fixture.componentInstance.contactForm.get('message');
    control?.setValue('Corto');
    expect(control?.invalid).toBeTrue();
  });

  it('campo message debe ser válido con 10 o más caracteres', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    const control = fixture.componentInstance.contactForm.get('message');
    control?.setValue('Este es un mensaje suficientemente largo.');
    expect(control?.valid).toBeTrue();
  });

  it('formulario completo y válido debe ser válido', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    const comp = fixture.componentInstance;
    comp.contactForm.setValue({
      name: 'Daniel',
      email: 'danysuarez0616@gmail.com',
      subject: 'Consulta',
      message: 'Hola, me interesa colaborar contigo en un proyecto.',
    });
    expect(comp.contactForm.valid).toBeTrue();
  });

  it('sendMessage() no debe hacer nada si el formulario es inválido', async () => {
    const fixture = TestBed.createComponent(ContactComponent);
    const comp = fixture.componentInstance;
    // formulario vacío → inválido
    await comp.sendMessage();
    expect(comp.sending()).toBeFalse();
    expect(comp.sent()).toBeFalse();
  });

  it('debe exponer 3 entradas de contactInfo', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    expect(fixture.componentInstance.contactInfo.length).toBe(3);
  });

  it('contactInfo debe incluir un email de contacto', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    const emailEntry = fixture.componentInstance.contactInfo.find(
      (c) => c.icon === 'email',
    );
    expect(emailEntry).toBeTruthy();
    expect(emailEntry!.href).toContain('mailto:');
  });
});
